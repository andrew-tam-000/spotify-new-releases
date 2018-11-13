import { ofType } from "redux-observable";
import { mergeMap, catchError, mapTo, take } from "rxjs/operators";
import { of, zip, concat } from "rxjs";
import { push } from "react-router-redux";
import {
    createAccessTokenStart,
    initializeOnAnalyzerStart,
    createAccessTokenSuccess,
    initializeOnAnalyzerSuccess,
    getSongsStart,
    getSongsSuccess,
    getSongDataStart,
    getSongDataSuccess,
    getArtistDataStart,
    getArtistDataSuccess
} from "../redux/actions";
import { firebaseUserIdSelector } from "../selectors";

export default function initializeOnAnalyzer(action$, state$) {
    return action$.pipe(
        ofType(initializeOnAnalyzerStart().type),
        mergeMap(() =>
            concat(
                true &&
                window.localStorage.getItem("artistData") &&
                window.localStorage.getItem("songs") &&
                window.localStorage.getItem("songData")
                    ? of(createAccessTokenSuccess())
                    : of(createAccessTokenStart()),
                action$.pipe(
                    ofType(createAccessTokenSuccess().type),
                    mapTo(getSongsStart()),
                    take(1)
                ),
                action$.pipe(
                    ofType(getSongsSuccess().type),
                    mergeMap(() => [getSongDataStart(), getArtistDataStart()]),
                    take(2)
                )
            )
        ),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
//initializeOnAnalyzerSuccess())
