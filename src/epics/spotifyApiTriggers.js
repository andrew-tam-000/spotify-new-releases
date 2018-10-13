import { ofType } from "redux-observable";
import {
    flatMap,
    uniq,
    filter,
    thru,
    first,
    isArray,
    flatten,
    map,
    get,
    omitBy,
    isUndefined,
    size,
    compact
} from "lodash";
import { merge } from "rxjs/observable/merge";
import { EMPTY, concat, from, timer, of, interval } from "rxjs";
import { take, mergeMap, debounce, catchError, switchMap, mapTo } from "rxjs/operators";
import { getCurrentlyPlayingTrackStart, getCurrentlyPlayingTrackSuccess } from "../redux/actions";
import {
    songsSelector,
    artistDataSelector,
    librarySongsWithDataSelector,
    advancedSearchTracksSelector,
    advancedSearchAttributesSelector,
    advancedSearchGenresSelector,
    advancedSearchArtistsSelector
} from "../selectors";
import {
    getArtistsStart,
    getArtistsSuccess,
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
    getRecommendationsSuccess,
    getTracksStart,
    getTracksSuccess,
    skipToNextStart,
    skipToNextSuccess,
    skipToPreviousStart,
    skipToPreviousSuccess,
    seekStart,
    seekSuccess
} from "../redux/actions";
import { apiObservable } from "./helpers";

const getNowPlayingPing = (action$, state$, { spotifyApi }) =>
    interval(5000).pipe(mergeMap(() => of(getCurrentlyPlayingTrackStart())));

// Need to also grab this track from the api
const getNowPlaying = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getCurrentlyPlayingTrackStart().type),
        mergeMap(action =>
            apiObservable(
                spotifyApi.getMyCurrentPlayingTrack,
                [],
                resp =>
                    songsSelector(state$.value)[resp.item.id]
                        ? from(Promise.resolve()).pipe(mapTo(getCurrentlyPlayingTrackSuccess(resp)))
                        : concat(
                              of(getTracksStart([resp.item.id])),
                              action$.pipe(
                                  ofType(getTracksSuccess().type),
                                  take(1),
                                  mapTo(getCurrentlyPlayingTrackSuccess(resp))
                              )
                          )
            )
        )
    );

const getTracks = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getTracksStart().type),
        mergeMap(action =>
            thru(
                thru(songsSelector(state$.value), songs =>
                    filter(
                        isArray(action.payload) ? action.payload : [action.payload],
                        trackId => !songs[trackId]
                    )
                ),
                trackIds =>
                    size(trackIds)
                        ? apiObservable(spotifyApi.getTracks, [trackIds], resp =>
                              concat(
                                  of(
                                      getArtistsStart(
                                          uniq(
                                              flatMap(resp.tracks, track =>
                                                  map(track.artists, artist => artist.id)
                                              )
                                          )
                                      )
                                  ),
                                  action$.pipe(
                                      ofType(getArtistsSuccess().type),
                                      take(1),
                                      mapTo(getTracksSuccess(resp))
                                  )
                              )
                          )
                        : from(Promise.resolve()).pipe(mapTo(getTracksSuccess()))
            )
        )
    );

// TODO: Make this support more than 50 artist id
const getArtists = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getArtistsStart().type),
        mergeMap(action =>
            thru(
                thru(artistDataSelector(state$.value), artists =>
                    filter(
                        isArray(action.payload) ? action.payload : [action.payload],
                        artistId => !artists[artistId]
                    )
                ),
                artistIds =>
                    size(artistIds)
                        ? apiObservable(spotifyApi.getArtists, [artistIds], resp =>
                              of(getArtistsSuccess(resp.artists))
                          )
                        : from(Promise.resolve()).pipe(mapTo(getArtistsSuccess()))
            )
        )
    );

// Let's also expand artists here
const getSearchResults = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType("SET_SEARCH_TEXT"),
        debounce(() => timer(400)),
        switchMap(({ payload: searchText }) =>
            from(spotifyApi.search(searchText, ["artist", "track", "album"])).pipe(
                mergeMap(resp =>
                    concat(
                        of(
                            getArtistsStart(
                                flatMap(resp.tracks.items, track =>
                                    map(track.artists, artist => artist.id)
                                )
                            )
                        ),
                        action$.pipe(
                            ofType(getArtistsSuccess().type),
                            take(1),
                            mapTo(setSearchResults(resp))
                        )
                    )
                ),
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

const skipToNext = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(skipToNextStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.skipToNext, null, resp => [
                skipToNextSuccess(),
                getCurrentlyPlayingTrackStart()
            ])
        )
    );

const skipToPrevious = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(skipToPreviousStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.skipToPrevious, null, resp => [
                skipToPreviousSuccess(),
                getCurrentlyPlayingTrackStart()
            ])
        )
    );

const seek = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(seekStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.seek, null, resp => of(skipToPreviousSuccess()))
        )
    );

const getRecommendations = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getRecommendationsStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getRecommendations, action.payload, resp =>
                concat(
                    of(
                        getArtistsStart(
                            map(
                                flatten(map(resp.tracks, track => track.artists)),
                                artist => artist.id
                            )
                        )
                    ),
                    action$.pipe(
                        ofType(getArtistsSuccess().type),
                        take(1),
                        mapTo(getRecommendationsSuccess(resp))
                    )
                )
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
        getRecommendations(...args),
        getTracks(...args),
        getArtists(...args),
        skipToNext(...args),
        skipToPrevious(...args),
        seek(...args)
    ).pipe(catchError(e => console.error(e)));
