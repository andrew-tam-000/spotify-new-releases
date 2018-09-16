import { ofType } from "redux-observable";
import { mergeMap, catchError, skipWhile } from "rxjs/operators";
import { from, of } from "rxjs";
import { updateFirebaseUserSuccess, updateFirebaseUserError } from "../redux/actions";
import { firebaseUserIdSelector } from "../selectors";

export default function updateFirebaseUser(action$, state$, { firebaseApp }) {
  return action$.pipe(
    ofType("UPDATE_FIREBASE_USER_START"),
    skipWhile(() => !firebaseUserIdSelector(state$.value)),
    mergeMap(action => {
      const { meta, ...payload } = action.payload;
      return from(firebaseApp.updateUserData(firebaseUserIdSelector(state$.value), payload)).pipe(
        mergeMap(userData => [updateFirebaseUserSuccess(userData), meta]),
        catchError(e => of(updateFirebaseUserError(e.message)))
      );
    }),
    catchError(e => of(updateFirebaseUserError(e.message)))
  );
}
