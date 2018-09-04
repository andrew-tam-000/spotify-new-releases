import { ofType } from 'redux-observable';
import {
    take,
    mapTo,
    mergeMap,
} from 'rxjs/operators';
import { routerMiddleware, push } from 'react-router-redux'

export default function redirectToPlaylist(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('FETCH_ACCESS_TOKEN'),
        mergeMap(
            () => action$.pipe(
                ofType('SET_ACCESS_TOKEN'),
                take(1)
            )
        ),
        mapTo(push('newPage'))
    )
}
