import { from, of, interval, concat } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { getCurrentlyPlayingTrackStart, getCurrentlyPlayingTrackSuccess } from "../redux/actions";

export default function getAdvancedSearchResults(action$, state$, { spotifyApi }) {
    return interval(5000).pipe(
        mergeMap(() =>
            concat(
                of(getCurrentlyPlayingTrackStart()),
                from(spotifyApi.getMyCurrentPlayingTrack()).pipe(
                    mergeMap(resp => of(getCurrentlyPlayingTrackSuccess(resp))),
                    catchError(e => ({ type: "error", payload: e.message }))
                )
            )
        )
    );
}
