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
import { firebaseUserIdSelector } from '../selectors';
import firebase from '../firebase';
import { storeFirebaseUserSuccess } from '../redux/actions';

export default function fetchUserData(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('SET_FIREBASE_USER_START//'),
        mergeMap( action => (
            from(firebaseApp.retrieveUserData(action.payload))
                .pipe(
                    mergeMap( doc => doc.exists
                        ?  of(storeFirebaseUserSuccess(doc.data()))
                        : of({type: 'error', payload: 'User does not exist'})
                    ),
                    catchError( e => of({type: 'error', payload: e.message})),
                )
        )),
    );
}
