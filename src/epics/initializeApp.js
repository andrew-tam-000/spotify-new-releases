import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { of, zip, concat } from "rxjs";
import { push } from "react-router-redux";
import {
    createAccessTokenStart,
    getSpotifyUserStart,
    createPlaylistStart,
    createFirebaseUserStart,
    initializeAppStart,
    createAccessTokenSuccess,
    getSpotifyUserSuccess,
    createPlaylistSuccess,
    createFirebaseUserSuccess,
    initializeAppSuccess,
    addGenreColors
} from "../redux/actions";
import { getKeyFromLocalStorage } from "../utils";
import { firebaseUserIdSelector } from "../selectors";
import { get } from "lodash";

export default function initializeApp(action$, state$) {
    return action$.pipe(
        ofType(initializeAppStart().type),
        mergeMap(() =>
            concat(
                //of(createAccessTokenStart()),
                of(addGenreColors(get(getKeyFromLocalStorage("genreColors"), "value"))),
                of(initializeAppSuccess())
                //of(getSpotifyUserStart()),
                //of(createPlaylistStart()),
                //of(createFirebaseUserStart()),
                /*
                zip(
                    //action$.pipe(ofType(createAccessTokenSuccess().type))
                    //action$.pipe(ofType(getSpotifyUserSuccess().type)),
                    //action$.pipe(ofType(createPlaylistSuccess().type)),
                    //action$.pipe(ofType(createFirebaseUserSuccess().type))
                ).pipe(
                    mergeMap(() => [
                        initializeAppSuccess()
                        //push(firebaseUserIdSelector(state$.value))
                    ])
                )
                */
            )
        ),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
