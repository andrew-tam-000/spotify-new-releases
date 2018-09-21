import { ofType, combineEpics } from "redux-observable";
import _ from "lodash";
import { merge } from "rxjs/observable/merge";
import {
    take,
    takeUntil,
    mergeMap,
    switchMap,
    mapTo,
    delay,
    map,
    catchError,
    takeWhile,
    ignoreElements
} from "rxjs/operators";
import { from, of, interval, timer } from "rxjs";
import { playlistUriSelector, playlistTracksSelector } from "../selectors";
import { playSongSuccess, playSongError, updateFirebaseUserStart } from "../redux/actions";

export default function addTracksToPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType("PLAY_SONG_START"),
        mergeMap(action =>
            from(
                spotifyApi.play(
                    playlistUriSelector(state$.value)
                        ? {
                              context_uri: playlistUriSelector(state$.value),
                              offset: {
                                  uri: action.payload
                              }
                          }
                        : {
                              uris: [action.payload]
                          }
                )
            ).pipe(
                mergeMap(() => [
                    playSongSuccess(),
                    updateFirebaseUserStart({ playStatus: action.payload })
                ]),
                catchError(e => of(playSongError(JSON.parse(e.response).error.message)))
            )
        )
    );
}
