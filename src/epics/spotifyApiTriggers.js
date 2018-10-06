import { merge } from "rxjs/observable/merge";

import { ofType } from "redux-observable";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import {
    getArtistTopTracksStart,
    getArtistTopTracksSuccess,
    getRelatedArtistsStart,
    getRelatedArtistsSuccess
} from "../redux/actions";
import { apiObservable } from "./helpers";

const getRelatedArtists = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getRelatedArtistsStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getArtistRelatedArtists, [action.payload], resp =>
                of(getRelatedArtistsSuccess(action.payload, resp.artists))
            )
        )
    );

const getArtistTopTracks = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getArtistTopTracksStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getArtistTopTracks, [action.payload, "US"], resp => {
                return of(getArtistTopTracksSuccess(action.payload, resp.tracks));
            })
        )
    );

export default (...args) => merge(getArtistTopTracks(...args), getRelatedArtists(...args));
