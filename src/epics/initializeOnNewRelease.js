import { ofType } from "redux-observable";
import { mergeMap, catchError, mapTo, take } from "rxjs/operators";
import { of, zip, concat } from "rxjs";
import { push } from "react-router-redux";
import {
    createAccessTokenStart,
    createAccessTokenSuccess,
    initializeOnNewReleasesStart,
    getNewReleasesStart
} from "../redux/actions";
import { firebaseUserIdSelector } from "../selectors";

export default function initializeOnNewRelease(action$, state$) {
    return action$.pipe(
        ofType(initializeOnNewReleasesStart().type),
        mergeMap(() =>
            concat(
                //of(createAccessTokenStart()),
                action$.pipe(
                    //ofType(createAccessTokenSuccess().type),
                    mapTo(getNewReleasesStart()),
                    take(1)
                )
            )
        ),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
//initializeOnAnalyzerSuccess())
