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
import { getFirebaseUserSuccess } from '../redux/actions';
import { accessTokenSelector } from '../selectors';

export default function initializeConnections(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('GET_FIREBASE_USER_START'),
        mergeMap(
            action => (
                from(firebaseApp.retrieveUserData(action.payload))
                    .pipe(
                        mergeMap(doc => (
                            doc.exists ? (
                                of(getFirebaseUserSuccess(doc.data()))
                            ) : (
                                of({
                                    type: 'error',
                                    payload: 'User does not exist'
                                })
                            )
                        ))
                    )
            )
        )
    );
}
