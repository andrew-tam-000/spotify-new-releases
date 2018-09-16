import { ofType } from "redux-observable";
import { take, mergeMap, catchError, skipWhile } from "rxjs/operators";
import { from, of } from "rxjs";
import { wow, accessTokenSelector, spotifyUserIdSelector } from "../selectors";
import {
  createPlaylistSuccess,
  deletePlaylistStart,
  updateFirebaseUserStart
} from "../redux/actions";

// TODO: Refactor this to use refresh playlist
// TODO: Also use this to delete the playlist right awawy
export default function createSharedPlaylist(action$, state$, { spotifyApi }) {
  return action$.pipe(
    ofType("CREATE_PLAYLIST_START"),
    mergeMap(() => state$),
    skipWhile(state => {
      console.log(state);
      console.log(!accessTokenSelector(state) || !spotifyUserIdSelector(state));
      return !accessTokenSelector(state) || !spotifyUserIdSelector(state);
    }),
    take(1),
    mergeMap(() =>
      from(
        spotifyApi.createPlaylist(spotifyUserIdSelector(state$.value), {
          name: `Custom List - ${new Date().toLocaleString()}`
        })
      ).pipe(catchError(e => of({ type: "error", payload: e })))
    ),
    mergeMap(playlist => [
      updateFirebaseUserStart({ playlistId: playlist.id }),
      createPlaylistSuccess(playlist),
      deletePlaylistStart(playlist.id)
    ]),
    catchError(e => of({ type: "error", payload: e }))
  );
}
