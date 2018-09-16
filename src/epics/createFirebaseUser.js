import { ofType, combineEpics } from "redux-observable";
import _ from "lodash";
import { merge } from "rxjs/observable/merge";
import {
  wow,
  take,
  takeUntil,
  mergeMap,
  switchMap,
  mapTo,
  delay,
  map,
  catchError,
  takeWhile,
  skipWhile
} from "rxjs/operators";
import { from, of, interval, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import uuid from "uuid/v1";
import { push } from "react-router-redux";
import Promise from "bluebird";
import spotifyApi from "../spotifyApi";
import { getAccessTokenFromUrl } from "../utils";
import { createFirebaseUserSuccess, createFirebaseUserError } from "../redux/actions";
import {
  spotifyUserIdSelector,
  spotifyPlaylistIdSelector,
  accessTokenSelector
} from "../selectors";

export default function createFirebaseUser(action$, state$, { firebaseApp }) {
  return action$.pipe(
    ofType("CREATE_FIREBASE_USER_START"),
    mergeMap(() => {
      const id = uuid();
      const doc = {
        id,
        token: null,
        playlistId: null,
        songAdded: null,
        playStatus: null
      };
      return from(firebaseApp.setUserData(doc).then(() => doc)).pipe(
        catchError(e => of(createFirebaseUserError(e.message)))
      );
    }),
    mergeMap(doc => of(createFirebaseUserSuccess(doc))),
    catchError(e => of(createFirebaseUserError(e.message)))
  );
}
