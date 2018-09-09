
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
    filter,
    distinctUntilChanged,
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
import { accessTokenSelector, firebaseUserIdSelector, songAddedSelector } from '../selectors';
import { realtimeFirebaseUserSuccess, refreshPlaylistStart } from '../redux/actions';

export default function firebaseListener(action$, state$, { firebaseApp }) {
    return state$.pipe(
        skipWhile(state => !firebaseUserIdSelector(state)),
        map(state => firebaseUserIdSelector(state)),
        distinctUntilChanged(),
        mergeMap( userId => firebaseApp.subscribeToDoc(userId)),
        mergeMap( doc => ([
            realtimeFirebaseUserSuccess(doc),
            ...(_.get(doc, 'songAdded') !== songAddedSelector(state$.value) && [refreshPlaylistStart()])
        ])),
        catchError(e => of({type: 'error', payload: e.message}))
    );
}
