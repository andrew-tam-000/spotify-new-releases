import lzString from "lz-string";
import { castArray } from "lodash";
import { first, filter, mergeMap, catchError } from "rxjs/operators";
import { from, of } from "rxjs";
import axios from "axios";

export function getValueFromLocalStorage(keyName) {
    return hasLocalStorageKey(keyName).pipe(
        filter(data => data.value),
        mergeMap(() => of(JSON.parse(localStorage.getItem(keyName)))),
        catchError(e => console.error(e))
    );
}

export function hasLocalStorageKey(keyName) {
    const hasValue = of(!!localStorage.getItem(keyName));
    return of(hasValue);
}

export function apiObservable(apiCall, apiArgs, onSuccess) {
    return from(apiCall.apply(null, castArray(apiArgs))).pipe(
        mergeMap(onSuccess),
        catchError(e => of({ type: "error", payload: e.message }))
    );
}

let hasToken = false;
let apiQueue = [];
let setIntervalId;
const getToken = () =>
    axios({
        url: "https://s3.amazonaws.com/spotify-access-token/access_token.txt",
        method: "GET"
    })
        .then(({ data }) => data)
        .catch(e => console.error(e));
const maximumRetries = 5;
const retryRequest = requestFunction =>
    new Promise((resolve, reject) => {
        let retries = maximumRetries;
        const executeFunction = () =>
            requestFunction()
                .then(resolve)
                .catch(
                    e =>
                        retries--
                            ? setTimeout(executeFunction, 500 * (maximumRetries - retries))
                            : console.warn(e) ||
                              reject(new Error(`Request failed after ${maximumRetries} attempts`))
                );
        return executeFunction();
    });

export const basicSpotifyApiWrapper = (basicSpotifyApi, requestFunction) =>
    new Promise((resolve, reject) => {
        const newPromise = new Promise((resolve, reject) => {
            // Push the function on
            apiQueue.push([requestFunction, resolve, reject]);
        });

        newPromise.then(resolve).catch(reject);

        // If we don't have a loop yet, then start one
        if (!setIntervalId) {
            const fetchTokenPromise = getToken().then(access_token => {
                hasToken = true;
                basicSpotifyApi.setAccessToken(access_token);
            });
            // BUG  - request function gets scoped and never re-checked
            setIntervalId = setInterval(() => {
                fetchTokenPromise.then(() => {
                    // Also, since no loop has been created, lets fetch out access token
                    // Only execute a request if there are requests,
                    // and we have a token
                    if (apiQueue.length && hasToken) {
                        const [[currentRequest, resolve, reject]] = apiQueue.splice(0, 1);
                        retryRequest(() => currentRequest(basicSpotifyApi))
                            .then(resolve)
                            .catch(reject);
                    }
                });
            }, 50);
        }
    });
