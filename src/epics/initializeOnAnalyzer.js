import { ofType } from "redux-observable";
import { mergeMap, catchError, mapTo, take } from "rxjs/operators";
import { of, concat } from "rxjs";
import { createAccessTokenStart, initializeOnDiscoverStart } from "../redux/actions";

export default function initializeOnAnalyzer(action$, state$) {
    return action$.pipe(
        ofType(initializeOnDiscoverStart().type),
        mergeMap(() => of(createAccessTokenStart())),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
//initializeOnAnalyzerSuccess())
