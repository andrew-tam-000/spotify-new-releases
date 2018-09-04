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
import { setFirebaseUserId } from '../redux/actions';

export default function initializeConnections(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('FETCH_ACCESS_TOKEN'),
        mergeMap(
            () => action$.pipe(
                ofType('SET_ACCESS_TOKEN'),
                take(1)
            )
        ),
        mergeMap(
            action => {
                const id = uuid();
                const doc = {
                    id,
                    token: action.payload
                };
                return from(
                    firebaseApp.setUserData(doc)
                        .then(() => doc)
                )
            },
        ),
        mergeMap( doc => (
            [
                setFirebaseUserId(doc.id),
                push(doc.id)
            ]
        )),
        catchError(e => of({type: 'error', payload: e.message}))
    );
}
