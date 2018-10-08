import { ofType } from "redux-observable";
import { map, get, omitBy, isUndefined, size, compact } from "lodash";
import { merge } from "rxjs/observable/merge";
import { from, timer, of, interval } from "rxjs";
import { mergeMap, debounce, catchError, switchMap } from "rxjs/operators";
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
    advancedSearchChangeTab,
    playSongStart,
    playSongSuccess,
    updateFirebaseUserStart,
    setSearchResults,
    pauseSongStart,
    pauseSongSuccess,
    getRecommendationsStart,
    getRecommendationsSuccess
} from "../redux/actions";
import { apiObservable } from "./helpers";

const getNowPlayingPing = (action$, state$, { spotifyApi }) =>
    interval(5000).pipe(mergeMap(() => of(getCurrentlyPlayingTrackStart())));

const getNowPlaying = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getCurrentlyPlayingTrackStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getMyCurrentPlayingTrack, [], resp =>
                of(getCurrentlyPlayingTrackSuccess(resp))
            )
        )
    );

const getSearchResults = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType("SET_SEARCH_TEXT"),
        debounce(() => timer(400)),
        switchMap(({ payload: searchText }) =>
            from(spotifyApi.search(searchText, ["artist", "track", "album"])).pipe(
                mergeMap(resp => of(setSearchResults(resp))),
                catchError(e => of({ type: "error", payload: e }))
            )
        )
    );

const pauseSong = (action$, state$, { firebaseApp, spotifyApi }) =>
    action$.pipe(
        ofType(pauseSongStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.pause, null, resp => [
                pauseSongSuccess(),
                getCurrentlyPlayingTrackStart()
            ])
        )
    );

const playSong = (action$, state$, { firebaseApp, spotifyApi }) =>
    action$.pipe(
        ofType(playSongStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.play, action.payload, resp => [
                playSongSuccess(),
                getCurrentlyPlayingTrackStart(),
                updateFirebaseUserStart({ playStatus: action.payload })
            ])
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
            apiObservable(spotifyApi.getArtistTopTracks, [action.payload, "US"], resp =>
                of(getArtistTopTracksSuccess(action.payload, resp.tracks))
            )
        )
    );

const getRecommendations = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getRecommendationsStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getRecommendations, action.payload, resp =>
                of(getRecommendationsSuccess(resp))
            )
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
        getNowPlayingPing(...args),
        getAdvancedSearchResults(...args),
        playSong(...args),
        getSearchResults(...args),
        pauseSong(...args),
        getRecommendations(...args)
    ).pipe(catchError(e => console.error(e)));