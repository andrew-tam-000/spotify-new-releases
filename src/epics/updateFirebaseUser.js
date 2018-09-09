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
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import { updateFirebaseUserSuccess, updateFirebaseUserError } from '../redux/actions';
import { firebaseUserIdSelector } from '../selectors';

export default function updateFirebaseUser(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('UPDATE_FIREBASE_USER_START'),
        mergeMap( action => from(
            firebaseApp.updateUserData(firebaseUserIdSelector(state$.value), action.payload)
        )
            .pipe(
                mergeMap( userData => of(updateFirebaseUserSuccess(userData))),
                catchError(e => of(updateFirebaseUserError(e.message)))
            )
        ),
        catchError(e => of(updateFirebaseUserError(e.message)))
    );
}
