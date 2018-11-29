import { ofType } from "redux-observable";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { setNewReleaseModalGenre, setNewReleaseModalColor } from "../redux/actions";
import { genreColorsMapSelector } from "../selectors";

const generateRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

export default function syncGenreToColor(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(setNewReleaseModalGenre().type),
        mergeMap(({ payload }) => {
            const existingColor = genreColorsMapSelector(state$.value)[payload];
            return of(
                setNewReleaseModalColor(existingColor ? existingColor : generateRandomColor())
            );
        })
    );
}
