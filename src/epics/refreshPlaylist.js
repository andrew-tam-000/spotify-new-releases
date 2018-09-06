import { ofType, combineEpics } from 'redux-observable';
import _ from 'lodash';
import { merge } from 'rxjs/observable/merge';
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
} from 'rxjs/operators';
import {
    from,
    of,
    interval,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { playlistIdSelector } from '../selectors';
import { setPlaylistSuccess, setPlaylistError } from '../redux/actions';

export default function addTracksToPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('SET_PLAYLIST_SUCCESS///'),
        mergeMap( action => (
            from(spotifyApi.getPlaylist(playlistIdSelector(state$.value)))
                .pipe(
                    mergeMap( playlist  => of(setPlaylistSuccess(playlist))),
                    catchError( e => of(setPlaylistError(JSON.parse(e.response).error.message))),
                )
        )),
    );
}
