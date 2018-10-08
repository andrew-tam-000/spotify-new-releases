import { ofType } from "redux-observable";
import { mergeMap, debounce, catchError } from "rxjs/operators";
import { map, get, omitBy, isUndefined, size, compact } from "lodash";
import { merge } from "rxjs/observable/merge";
import { timer, of, interval, concat } from "rxjs";
import { getCurrentlyPlayingTrackStart, getCurrentlyPlayingTrackSuccess } from "../redux/actions";
import {
    librarySongsWithDataSelector,
    advancedSearchTracksSelector,
    advancedSearchAttributesSelector,
    advancedSearchGenresSelector,
    advancedSearchArtistsSelector
} from "../selectors";
import {
    getArtistTopTracksStart,
    getArtistTopTracksSuccess,
    getRelatedArtistsStart,
    getRelatedArtistsSuccess,
    advancedSearchGetResultsStart,
    advancedSearchGetResultsSuccess,
    advancedSearchChangeTab
} from "../redux/actions";
import { apiObservable } from "./helpers";

const getNowPlaying = (action$, state$, { spotifyApi }) =>
    interval(5000).pipe(
        mergeMap(() =>
            concat(
                of(getCurrentlyPlayingTrackStart()),
                apiObservable(spotifyApi.getMyCurrentPlayingTrack, [], resp =>
                    of(getCurrentlyPlayingTrackSuccess(resp))
                )
            )
        )
    );

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

const getAdvancedSearchResults = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(advancedSearchGetResultsStart().type),
        debounce(() => timer(400)),
        mergeMap(() => {
            const advancedSearchAttributes = advancedSearchAttributesSelector(state$.value);
            const tracks = advancedSearchTracksSelector(state$.value);
            const librarySongsWithData = librarySongsWithDataSelector(state$.value);
            const seedGenres = advancedSearchGenresSelector(state$.value);
            const seedTracks = tracks;
            const seedArtists = advancedSearchArtistsSelector(state$.value).length
                ? advancedSearchArtistsSelector(state$.value)
                : compact(
                      map(tracks, track =>
                          get(librarySongsWithData, `${track}.songDetails.track.artists.0.id`)
                      )
                  );
            return apiObservable(
                spotifyApi.getRecommendations,
                [
                    omitBy(
                        {
                            ...advancedSearchAttributes,
                            seed_tracks: size(seedTracks) ? seedTracks : undefined,
                            seed_artists: size(seedArtists) ? seedArtists : undefined,
                            seed_genres: size(seedGenres) ? seedGenres : undefined,
                            limit: 99
                        },
                        isUndefined
                    )
                ],
                resp => [advancedSearchGetResultsSuccess(resp), advancedSearchChangeTab(2)]
            );
        })
    );

export default (...args) =>
    merge(
        getArtistTopTracks(...args),
        getRelatedArtists(...args),
        getNowPlaying(...args),
        getAdvancedSearchResults(...args)
    ).pipe(catchError(e => console.error(e)));
