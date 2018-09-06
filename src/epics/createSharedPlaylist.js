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
import { spotifyUserIdSelector, spotifyPlaylistIdSelector } from '../selectors';
import firebase from '../firebase';
import { createPlaylistSuccess, createUserIdStart } from '../redux/actions';

// TODO: Refactor this to use refresh playlist
export default function createSharedPlaylist(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('CREATE_PLAYLIST_START'),
        switchMap(
            action => (
                action$
                    .ofType('SET_SPOTIFY_USER_SUCCESS')
                    .pipe(
                        mergeMap( action => (
                            from(spotifyApi.createPlaylist(spotifyUserIdSelector(state$.value), {name: `Custom List - ${new Date().toLocaleString()}`}))
                                .pipe(
                                    mergeMap( playlist => ([
                                        createPlaylistSuccess(playlist),
                                    ])),
                                    catchError( e => {
                                        return of({type: 'error', payload: e})
                                    })
                                )
                        ))
                    )
            )
        )
        /*
            const existingPlaylist = spotifyPlaylistIdSelector(state$.value);
            if (existingPlaylist) {
                return from(spotifyApi.getPlaylist(existingPlaylist))
                    .pipe(
                        mergeMap( playlist => of(setPlaylistSuccess(playlist))),
                        catchError( e => {
                            return of({type: 'error', payload: JSON.parse(e.response).error.message})
                        })
                    )
            }
            */
    )
}
