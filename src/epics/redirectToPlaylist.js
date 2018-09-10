import { ofType } from 'redux-observable';
import {
    take,
    mapTo,
    mergeMap,
    switchMap,
    map,
    concat,
} from 'rxjs/operators';
import {
    of,
    forkJoin,
    zip
} from 'rxjs';
import { firebaseUserIdSelector } from '../selectors';
import { initializeAppSuccess, } from '../redux/actions';
import { routerMiddleware, push } from 'react-router-redux'

export default function redirectToPlaylist(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(initializeAppSuccess().type),
        map(() => push(firebaseUserIdSelector(state$.value))),
    )
}
