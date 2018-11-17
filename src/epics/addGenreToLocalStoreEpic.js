import { ofType, combineEpics } from "redux-observable";
import _ from "lodash";
import { merge } from "rxjs/observable/merge";
import {
    take,
    takeUntil,
    mergeMap,
    map as map$,
    switchMap,
    mapTo,
    delay,
    map,
    catchError,
    takeWhile,
    filter
} from "rxjs/operators";
import { from, of, interval, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import uuid from "uuid/v1";
import { push } from "react-router-redux";
import Promise from "bluebird";
import spotifyApi from "../spotifyApi";
import { getAccessTokenFromUrl } from "../utils";
import { addGenreColors, setLocalStorage } from "../redux/actions";
import { genreColorsSelector } from "../selectors";

export default function addGenreToLocalStoreEpic(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(addGenreColors().type),
        map$(action => setLocalStorage("genreColors", genreColorsSelector(state$.value)))
    );
}
