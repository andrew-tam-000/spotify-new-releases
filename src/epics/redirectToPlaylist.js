import { ofType } from 'redux-observable';
import {
    take,
    mapTo,
    mergeMap,
    switchMap,
    map,
} from 'rxjs/operators';
import {
    of
} from 'rxjs';
import { firebaseUserIdSelector } from '../selectors';
import { routerMiddleware, push } from 'react-router-redux'

export default function redirectToPlaylist(action$, state$, { firebaseApp }) {

    return action$.pipe(
        ofType('SET_SPOTIFY_USER_SUCCESS'),
        switchMap(
            () => action$
            .pipe(
                ofType('STORE_FIREBASE_USER_SUCCESS'),
                take(1),
            )
        ),
        map(
            () => push(firebaseUserIdSelector(state$.value))
        ),
    )
}
