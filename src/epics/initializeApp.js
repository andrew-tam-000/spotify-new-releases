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
    zip,
    concat,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import {
    createAccessTokenStart,
    getSpotifyUserStart,
    createPlaylistStart,
    createUserIdStart,
    createFirebaseUserStart,
    initializeAppStart,

    createAccessTokenSuccess,
    getSpotifyUserSuccess,
    createPlaylistSuccess,
    createUserIdSuccess,
    createFirebaseUserSuccess,
    initializeAppSuccess,
    } from '../redux/actions';
import { accessTokenSelector, firebaseUserIdSelector} from '../selectors';

export default function initializeApp(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(initializeAppStart().type),
        mergeMap( action => concat(
            of(createAccessTokenStart()),
            of(getSpotifyUserStart()),
            of(createPlaylistStart()),
            of(createUserIdStart()),
            of(createFirebaseUserStart()),
            zip(
                action$.pipe(ofType(createAccessTokenSuccess().type)),
                action$.pipe(ofType(getSpotifyUserSuccess().type)),
                action$.pipe(ofType(createPlaylistSuccess().type)),
                action$.pipe(ofType(createUserIdSuccess().type)),
                action$.pipe(ofType(createFirebaseUserSuccess().type))
            ).pipe(
                mergeMap( () => ([
                    initializeAppSuccess(),
                    push(firebaseUserIdSelector(state$.value)),
                ]))
            )
        )),
        catchError(e => ({type: 'error', payload: e.message})),
    );
}
