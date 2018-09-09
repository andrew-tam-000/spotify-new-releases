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
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import firebase from '../firebase';
import { playlistIdSelector, accessTokenSelector, spotifyUserIdSelector  } from '../selectors';
import { createPlaylistSuccess, createUserIdStart, deletePlaylistStart } from '../redux/actions';

// TODO: Refactor this to use refresh playlist
// TODO: Also use this to delete the playlist right awawy
export default function createSharedPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('CREATE_PLAYLIST_START'),
        mergeMap( action => (
            state$.pipe(
                skipWhile(state => !accessTokenSelector(state) || !spotifyUserIdSelector(state)),
                take(1),
                mergeMap( action => from(spotifyApi.createPlaylist(spotifyUserIdSelector(state$.value), {name: `Custom List - ${new Date().toLocaleString()}`}))
                    .pipe(
                        catchError( e => of({type: 'error', payload: e}))
                    )
                )
            )
        )),
        mergeMap( playlist => ([
            createPlaylistSuccess(playlist),
            deletePlaylistStart(playlist.id),
        ])),
        catchError( e =>of({type: 'error', payload: e}))
    )
}
