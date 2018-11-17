import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { of, EMPTY } from "rxjs";
import { setLocalStorage } from "../redux/actions";
import lzString from "lz-string";

window.lzstring = lzString;
export default function setLocalStorageEpic(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(setLocalStorage().type),
        mergeMap(({ payload: { key, data, expiration } }) => {
            localStorage.setItem(
                key,
                lzString.compressToUTF16(JSON.stringify({ value: data, expiration }))
            );
            return EMPTY;
        }),
        catchError(e => of({ type: "error", payload: e }))
    );
}
