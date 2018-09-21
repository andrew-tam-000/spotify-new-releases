import { ofType, combineEpics } from "redux-observable";
import _ from "lodash";
import { merge } from "rxjs";
import {
    filter,
    take,
    takeUntil,
    mergeMap,
    switchMap,
    mapTo,
    delay,
    map,
    catchError,
    takeWhile
} from "rxjs/operators";
import { from, of, interval, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import uuid from "uuid/v1";
import { push } from "react-router-redux";
import Promise from "bluebird";
import spotifyApi from "../spotifyApi";
import { getAccessTokenFromUrl } from "../utils";
import { createAccessTokenSuccess, updateFirebaseUserStart } from "../redux/actions";
import { accessTokenSelector } from "../selectors";

const scopes = [
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-library-read",
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private"
];

const tokenUrl = `https://accounts.spotify.com/authorize?client_id=27135c7bda1c48f3ba0f6be1161b0561&redirect_uri=http://localhost:3000&response_type=token&show_dialog=true&scope=${_.join(
    scopes,
    " "
)}`;

function getAccessTokenFromLocalStorageObs() {
    return of(window.localStorage.getItem("accessToken")).pipe(
        filter(token => token),
        map(token => token)
    );
}

function getAccessTokenFromUrlObs() {
    return of(window.localStorage.getItem("accessToken")).pipe(
        filter(token => !token),
        mergeMap(token => {
            const external = window.open(tokenUrl);
            const getUrl$ = interval(400).pipe(
                map(() => getAccessTokenFromUrl(external)),
                map(val => val),
                takeWhile(val => val),
                take(1),
                mergeMap(token => {
                    external.close();
                    window.localStorage.setItem("accessToken", token);
                    return of(token);
                }),
                catchError(e => {
                    console.warn(e);
                    return getUrl$;
                })
            );
            return getUrl$;
        })
    );
}

// Check if we have an access token stored firset
export default function createAccessToken(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType("CREATE_ACCESS_TOKEN_START"),
        // Check 2 things -- check if the
        mergeMap(action => merge(getAccessTokenFromUrlObs(), getAccessTokenFromLocalStorageObs())),
        mergeMap(token => [createAccessTokenSuccess(token), updateFirebaseUserStart({ token })])
    );
}
