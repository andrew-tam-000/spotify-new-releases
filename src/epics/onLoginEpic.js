import { ofType } from "redux-observable";
import { concat, interval, of } from "rxjs";
import { switchMap, mergeMap, takeWhile } from "rxjs/operators";
import { accessTokenSelector } from "../selectors";
import {
    getCurrentlyPlayingTrackStart,
    createAccessTokenSuccess,
    getDevicesStart
} from "../redux/actions";

export default function onLoginEpic(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(createAccessTokenSuccess().type),
        switchMap(({ payload }) => {
            // TODO: Refactor how we set teh access token
            spotifyApi.setAccessToken(payload);
            return concat(
                of(getDevicesStart()),
                of(getCurrentlyPlayingTrackStart()),
                interval(5000).pipe(
                    takeWhile(() => accessTokenSelector(state$.value)),
                    mergeMap(() => of(getCurrentlyPlayingTrackStart()))
                )
            );
        })
    );
}
