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
    ignoreElements,
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
import { firebaseUserIdSelector, playlistUriSelector } from '../selectors';
import { updateFirebaseUser} from '../redux/actions';

export default function updateUserData(action$, state$, { firebaseApp, spotifyApi }) {
    return action$.pipe(
        ofType('SET_ACCESS_TOKEN'),
        switchMap( action => (
            action$.ofType('SET_PLAYLIST')
                .pipe(
                    take(1),
                    mergeMap( ({payload}) => (
                        from(firebaseApp.updateUserData(
                            firebaseUserIdSelector(state$.value),
                            { playlistId: payload.id }
                        ))
                            .pipe(
                                mergeMap(data => of(updateFirebaseUser(data))),
                                catchError( e => of({type: 'error', payload: e.message})),
                            )
                    ))
                )
        )),
    );
}
