import { ofType } from "redux-observable";
import { timer, from, of } from "rxjs";
import { mergeMap, debounce, catchError } from "rxjs/operators";
import {
    advancedSearchGetResultsStart,
    advancedSearchGetResultsSuccess,
    advancedSearchGetResultsError
} from "../redux/actions";

export default function getAdvancedSearchResults(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(advancedSearchGetResultsStart().type),
        debounce(() => timer(400)),
        mergeMap(({ payload: params }) =>
            from(spotifyApi.getRecommendations(params)).pipe(
                mergeMap(resp => of(advancedSearchGetResultsSuccess(resp))),
                catchError(e => of(advancedSearchGetResultsError(e.message)))
            )
        )
    );
}
