import { ofType } from "redux-observable";
import { map, get, omitBy, isUndefined, size } from "lodash";
import { timer, from, of } from "rxjs";
import { mergeMap, debounce, catchError } from "rxjs/operators";
import {
    advancedSearchSelector,
    songsWithDataByIdSelector,
    advancedSearchTracksSelector,
    advancedSearchAttributesSelector
} from "../selectors";
import {
    advancedSearchGetResultsStart,
    advancedSearchGetResultsSuccess,
    advancedSearchGetResultsError,
    advancedSearchChangeTab
} from "../redux/actions";

export default function getAdvancedSearchResults(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(advancedSearchGetResultsStart().type),
        debounce(() => timer(400)),
        mergeMap(() => {
            const advancedSearchAttributes = advancedSearchAttributesSelector(state$.value);
            const tracks = advancedSearchTracksSelector(state$.value);
            const songsWithDataById = songsWithDataByIdSelector(state$.value);
            const seedTracks = tracks;
            const seedArtists = map(tracks, track =>
                get(songsWithDataById, `${track}.songDetails.track.artists.0.id`)
            );
            return from(
                spotifyApi.getRecommendations(
                    omitBy(
                        {
                            ...advancedSearchAttributes,
                            seed_tracks: size(seedTracks) && seedTracks,
                            seed_artists: size(seedArtists) && seedArtists,
                            limit: 99
                        },
                        isUndefined
                    )
                )
            ).pipe(
                mergeMap(resp => [
                    advancedSearchGetResultsSuccess(resp),
                    advancedSearchChangeTab(2)
                ]),
                catchError(e => of(advancedSearchGetResultsError(e.message)))
            );
        })
    );
}
