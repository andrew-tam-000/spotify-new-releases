import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { of, EMPTY } from "rxjs";
import { setLocalStorage } from "../redux/actions";
import lzString from "lz-string";
import { setKeyInLocalStorage } from "../utils";

window.lzstring = lzString;
export default function setLocalStorageEpic(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(setLocalStorage().type),
        mergeMap(({ payload: { key, data, expiration } }) => {
            setKeyInLocalStorage(key, data, expiration);
            return EMPTY;
        }),
        catchError(e => of({ type: "error", payload: e }))
    );
}
