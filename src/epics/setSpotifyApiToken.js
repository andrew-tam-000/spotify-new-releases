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
    EMPTY,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import { setAccessTokenSuccess } from '../redux/actions';
import { accessTokenSelector } from '../selectors';

export default function setSpotifyApiToken(action$, state$, { firebaseApp, spotifyApi }) {
    return state$.pipe(
        skipWhile(state => !accessTokenSelector(state)),
        take(1),
        mergeMap( () => {
            spotifyApi.setAccessToken(accessTokenSelector(state$.value));
            return EMPTY;
        })
    );
}
