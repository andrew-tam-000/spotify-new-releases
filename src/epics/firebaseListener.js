import _ from "lodash";
import { mergeMap, map, catchError, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { of } from "rxjs";
import { firebaseUserIdSelector, songAddedSelector } from "../selectors";
import {
  realtimeFirebaseUserSuccess,
  realtimeFirebaseUserError,
  refreshPlaylistStart
} from "../redux/actions";

export default function firebaseListener(action$, state$, { firebaseApp }) {
  return state$.pipe(
    skipWhile(state => !firebaseUserIdSelector(state)),
    map(state => firebaseUserIdSelector(state)),
    distinctUntilChanged(),
    mergeMap(userId => firebaseApp.subscribeToDoc(userId)),
    mergeMap(doc => [
      realtimeFirebaseUserSuccess(doc),
      ...(_.get(doc, "songAdded") && _.get(doc, "songAdded") !== songAddedSelector(state$.value)
        ? [refreshPlaylistStart()]
        : [])
    ]),
    catchError(e => of(realtimeFirebaseUserError(e.message)))
  );
}
