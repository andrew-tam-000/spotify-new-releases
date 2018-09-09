import { ofType, combineEpics } from 'redux-observable';
import _ from 'lodash';
import { merge } from 'rxjs/observable/merge';
import {
    take,
    takeUntil,
    skipWhile,
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
import { firebaseUserIdSelector, accessTokenSelector } from '../selectors';
import firebase from '../firebase';
import { getSpotifyUserSuccess, createPlaylistStart } from '../redux/actions';

export default function fetchUserData(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('GET_SPOTIFY_USER_START'),
        // Only do this if the access token has been set
        mergeMap( action => (
            state$
                .pipe(
                    skipWhile(state => !accessTokenSelector(state)),
                    take(1),
                    switchMap(
                        action => {
                            return from(spotifyApi.getMe())
                                .pipe(
                                    mergeMap( user => of(
                                        getSpotifyUserSuccess(user),
                                    )),
                                    catchError( e => of({type: 'error', payload: JSON.parse(e.response).error.message}))
                                )
                        }
                    )
                )
        )),
    );
}
