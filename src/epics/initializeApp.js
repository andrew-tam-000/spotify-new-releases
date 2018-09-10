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
    setAccessTokenStart,
    getSpotifyUserStart,
    createPlaylistStart,
    createUserIdStart,
    createFirebaseUserStart,
    initializeAppStart,

    setAccessTokenSuccess,
    getSpotifyUserSuccess,
    createPlaylistSuccess,
    createUserIdSuccess,
    createFirebaseUserSuccess,
    initializeAppSuccess,
    } from '../redux/actions';
import { accessTokenSelector } from '../selectors';

export default function initializeApp(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(initializeAppStart().type),
        mergeMap( action => concat(
            of(setAccessTokenStart()),
            of(getSpotifyUserStart()),
            of(createPlaylistStart()),
            of(createUserIdStart()),
            of(createFirebaseUserStart()),
            zip(
                action$.pipe(ofType(setAccessTokenSuccess().type)),
                action$.pipe(ofType(getSpotifyUserSuccess().type)),
                action$.pipe(ofType(createPlaylistSuccess().type)),
                action$.pipe(ofType(createUserIdSuccess().type)),
                action$.pipe(ofType(createFirebaseUserSuccess().type))
            ).pipe(mapTo(initializeAppSuccess()))
        )),
        catchError(e => ({type: 'error', payload: e.message})),
    );
}
