import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { of, EMPTY } from "rxjs";
import { setNewReleaseModalGenre, setNewReleaseModalColor } from "../redux/actions";
import { genreColorsMapSelector } from "../selectors";
import lzString from "lz-string";

export default function syncGenreToColor(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(setNewReleaseModalGenre().type),
        mergeMap(({ payload }) => {
            const existingColor = genreColorsMapSelector(state$.value)[payload];
            return existingColor ? of(setNewReleaseModalColor(existingColor)) : EMPTY;
        })
    );
}
