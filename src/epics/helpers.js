import lzString from "lz-string";
import { castArray } from "lodash";
import { filter, mergeMap, catchError } from "rxjs/operators";
import { from, of } from "rxjs";

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
