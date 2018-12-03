import { map as map$, filter as filter$, distinctUntilChanged, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { getRelatedTracksStart } from "../redux/actions";
import { nowPlayingSongIdSelector } from "../selectors";

export default function onNowPlayingChangeEpic(action$, state$, { spotifyApi }) {
    return state$.pipe(
        map$(state => nowPlayingSongIdSelector(state)),
        filter$(state => state),
        distinctUntilChanged(),
        map$(nowPlayingTrackId => getRelatedTracksStart(nowPlayingTrackId)),
        catchError(e => of({ type: "errorp", payload: e.message }))
    );
}
