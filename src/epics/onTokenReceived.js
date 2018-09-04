import { ofType, combineEpics } from 'redux-observable';
import _ from 'lodash';
import { merge } from 'rxjs/observable/merge';
import { mapTo } from 'rxjs/operators';
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

export default function onTokenReceived(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('FETCH_ACCESS_TOKEN'),
        mergeMap(
            () => action$.pipe(
                ofType('SET_ACCESS_TOKEN'),
                take(1)
            )
        ),
        mapTo({
            type: 'CREATE_LAULI'
        })
    )
}
