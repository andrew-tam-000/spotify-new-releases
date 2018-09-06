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
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import { playlistIdSelector } from '../selectors';
import { setPlaylistStart, addTracksToPlaylistSuccess, refreshPlaylistStart } from '../redux/actions';

export default function addTracksToPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('ADD_TRACKS_TO_PLAYLIST_START'),
        mergeMap( action => (
            from(spotifyApi.addTracksToPlaylist(playlistIdSelector(state$.value), action.payload))
                .pipe(
                    mergeMap( playlist => ([
                        addTracksToPlaylistSuccess(),
                        refreshPlaylistStart(),
                    ])),
                    catchError( e => {
                        return of({type: 'error', payload: JSON.parse(e.response).error.message})
                    })
                )
        )),
    );
}
