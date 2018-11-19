import { ofType } from "redux-observable";
import { concat, interval, of } from "rxjs";
import { mapTo, mergeMap } from "rxjs/operators";
import {
    getCurrentlyPlayingTrackStart,
    createAccessTokenSuccess,
    getDevicesStart
} from "../redux/actions";

export default function onLoginEpic(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(createAccessTokenSuccess().type),
        mergeMap(() =>
            concat(
                of(getDevicesStart()),
                interval(5000).pipe(mergeMap(() => of(getCurrentlyPlayingTrackStart())))
            )
        )
    );
}
