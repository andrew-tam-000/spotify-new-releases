import { ofType } from "redux-observable";
import { EMPTY, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { toggleNewReleaseSong, getRecommendationsStart } from "../redux/actions";
import { newReleasesTableOpenSongsSelector } from "../selectors";

export default function getRelatedSongsOnRowClickEpic(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(toggleNewReleaseSong().type),
        mergeMap(
            ({ payload }) =>
                newReleasesTableOpenSongsSelector(state$.value)[payload]
                    ? of(getRecommendationsStart({ seed_tracks: [payload] }))
                    : EMPTY
        )
    );
}
