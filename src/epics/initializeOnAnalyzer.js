import { ofType } from "redux-observable";
import {
    map as map$,
    filter as filter$,
    distinctUntilChanged,
    mergeMap,
    switchMap,
    catchError,
    mapTo,
    take
} from "rxjs/operators";
import { of, concat } from "rxjs";
import {
    initializeOnAnalyzerStart,
    getSongsStart,
    getSongsSuccess,
    initializeOnAnalyzerSuccess
} from "../redux/actions";
import { accessTokenSelector } from "../selectors";

export default function initializeOnAnalyzer(action$, state$) {
    return action$.pipe(
        ofType(initializeOnAnalyzerStart().type),
        switchMap(() =>
            state$.pipe(
                map$(state => accessTokenSelector(state)),
                filter$(state => state),
                distinctUntilChanged(),
                mergeMap(action =>
                    concat(
                        of(getSongsStart()),
                        action$.pipe(
                            ofType(getSongsSuccess().type),
                            mapTo(initializeOnAnalyzerSuccess()),
                            take(1)
                        )
                    )
                )
            )
        ),

        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
//initializeOnAnalyzerSuccess())
