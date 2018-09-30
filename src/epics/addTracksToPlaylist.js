import { ofType } from "redux-observable";
import _ from "lodash";
import { mergeMap, catchError } from "rxjs/operators";
import { from, of } from "rxjs";
import { playlistIdSelector } from "../selectors";
import {
    addTracksToPlaylistSuccess,
    refreshPlaylistStart,
    updateFirebaseUserStart
} from "../redux/actions";

export default function addTracksToPlaylist(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType("ADD_TRACKS_TO_PLAYLIST_START"),
        mergeMap(action =>
            from(Promise.resolve(action.payload)).pipe(
                mergeMap(uri => [addTracksToPlaylistSuccess(uri)]),
                catchError(e => {
                    return of({ type: "error", payload: JSON.parse(e.response).error.message });
                })
            )
        )
    );
}
