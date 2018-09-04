import { ofType } from 'redux-observable';
import {
    timer,
    from,
    of,
} from 'rxjs';
import {
    takeWhile,
    take,
    switchMap,
    mapTo,
    mergeMap,
    debounce,
    catchError,
} from 'rxjs/operators';
import { routerMiddleware, push } from 'react-router-redux'
import { setSearchResults } from '../redux/actions';

export default function populateSearch(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType('SET_SEARCH_TEXT'),
        debounce(() => timer(400)),
        switchMap(
            ({payload: searchText}) => (
                from(
                    spotifyApi
                        .search(searchText, ['artist', 'track', 'album'])
                )
                    .pipe(
                        mergeMap( resp => of(setSearchResults(resp))),
                        catchError( e => of({type: 'error', payload: e}))
                    )
            )
        ),
    )
}
