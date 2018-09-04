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
import { setAccessToken } from '../redux/actions';

const scopes = [
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-library-read',
    'user-read-recently-played',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
];

const tokenUrl = `https://accounts.spotify.com/authorize?client_id=27135c7bda1c48f3ba0f6be1161b0561&redirect_uri=http://localhost:3000&response_type=token&show_dialog=true&scope=${_.join(scopes, ' ')}`;

export default function fetchAccessToken(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('FETCH_ACCESS_TOKEN'),
        mergeMap(
            action => {
                const external = window.open(tokenUrl);
                const getUrl$ = interval(400).pipe(
                    map( () => getAccessTokenFromUrl(external)),
                    catchError(e => getUrl$)
                );
                return getUrl$
                    .pipe(
                        takeWhile(val => val),
                        take(1),
                        mergeMap(
                            token => {
                                external.close();
                                return of(token);
                            }
                        ),
                    )
            }
        ),
        mergeMap( token => of(setAccessToken(token))),
    );
}
