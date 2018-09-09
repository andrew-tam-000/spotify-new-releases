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
    skipWhile,
} from 'rxjs/operators';
import {
    from,
    of,
    interval,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { playlistIdSelector, accessTokenSelector } from '../selectors';
import { refreshPlaylistSuccess, setPlaylistError } from '../redux/actions';

export default function refreshPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('REFRESH_PLAYLIST_START'),
        switchMap(action => (
            state$
                .pipe(
                    skipWhile(state => !playlistIdSelector(state) || !accessTokenSelector(state)),
                    take(1),
                    switchMap(
                        action => from(spotifyApi.getPlaylist(playlistIdSelector(state$.value)))
                            .pipe(
                                mergeMap( playlist => of(refreshPlaylistSuccess(playlist))),
                                catchError( e => of(setPlaylistError(JSON.parse(e.response).error.message))),
                            )
                    )
                )
        )),
    );
}
