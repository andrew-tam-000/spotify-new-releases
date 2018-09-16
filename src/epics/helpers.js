import lzString from "lz-string";
import { last, mapTo, filter, expand, mergeMap, catchError } from "rxjs/operators";
import { merge, EMPTY, from, of } from "rxjs";
import { getSongsStart, getSongsSuccess } from "../redux/actions";

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
