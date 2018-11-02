import { ofType } from "redux-observable";
import {
    chunk,
    keys,
    flatMap,
    flatten,
    uniq,
    filter,
    thru,
    isArray,
    map,
    get,
    omitBy,
    isUndefined,
    slice,
    size,
    compact,
    orderBy,
    values
} from "lodash";
import { merge } from "rxjs/observable/merge";
import { EMPTY, concat, from, timer, of, interval, forkJoin } from "rxjs";
import {
    scan,
    last,
    takeWhile,
    take,
    expand,
    mergeMap,
    debounce,
    catchError,
    switchMap,
    mapTo,
    delay
} from "rxjs/operators";
import { getCurrentlyPlayingTrackStart, getCurrentlyPlayingTrackSuccess } from "../redux/actions";
import {
    songsSelector,
    albumsSelector,
    songDataSelector,
    artistDataSelector,
    newReleasesSelector,
    librarySongsWithDataSelector,
    advancedSearchTracksSelector,
    advancedSearchAttributesSelector,
    advancedSearchGenresSelector,
    advancedSearchArtistsSelector
} from "../selectors";
import {
    getArtistsStart,
    getArtistsSuccess,
    getAlbumsStart,
    getAlbumsSuccess,
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
    seekSuccess,
    getNewReleasesStart,
    getNewReleasesSuccess,
    getSongDataStart,
    getSongDataSuccess,
    setLocalStorage
} from "../redux/actions";
import { apiObservable } from "./helpers";
import lzString from "lz-string";

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
        mergeMap(action => {
            const tracks = songsSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    songId => !tracks[songId]
                )
            );
            // Fixing rate limit issue
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 50), (idSet, idx) =>
                          timer(200 * idx).pipe(
                              mergeMap(val =>
                                  apiObservable(spotifyApi.getTracks, [idSet], resp => of(resp))
                              )
                          )
                      )
                  ).pipe(
                      mergeMap(nestedTracksArray =>
                          of(getTracksSuccess(flatMap(nestedTracksArray, ({ tracks }) => tracks)))
                      )
                  )
                : of(getArtistsSuccess([]));
        })
    );

const getArtists = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getArtistsStart().type),
        // Get relevant ids
        mergeMap(action => {
            const artists = artistDataSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    artistId => !artists[artistId]
                )
            );
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 20), idSet =>
                          apiObservable(spotifyApi.getArtists, [idSet], resp => of(resp))
                      )
                  ).pipe(
                      mergeMap(nestedArtistsArray =>
                          of(
                              getArtistsSuccess(
                                  flatMap(nestedArtistsArray, ({ artists }) => artists)
                              )
                          )
                      )
                  )
                : of(getArtistsSuccess([]));
        })
    );

const getSongData = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getSongDataStart().type),
        // Get relevant ids
        mergeMap(action => {
            const songData = songDataSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    songId => !songData[songId]
                )
            );
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 100), idSet =>
                          apiObservable(spotifyApi.getAudioFeaturesForTracks, [idSet], resp =>
                              of(resp)
                          )
                      )
                  ).pipe(
                      mergeMap(nestedTracksArray =>
                          of(
                              getSongDataSuccess(
                                  flatMap(nestedTracksArray, ({ audio_features }) => audio_features)
                              )
                          )
                      )
                  )
                : of(getSongDataSuccess([]));
        })
    );

// Let's also expand artists here
const getSearchResults = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType("SET_SEARCH_TEXT"),
        debounce(() => timer(400)),
        switchMap(
            ({ payload: searchText }) =>
                searchText
                    ? from(spotifyApi.search(searchText, ["artist", "track", "album"])).pipe(
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
                    : EMPTY
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
                of(
                    getRelatedArtistsSuccess(
                        action.payload,
                        orderBy(resp.artists, "popularity", "desc")
                    )
                )
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
        debounce(() => timer(400)),
        mergeMap(action =>
            apiObservable(spotifyApi.seek, [action.payload, {}], resp =>
                of(skipToPreviousSuccess())
            )
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
                            map(flatMap(resp.tracks, track => track.artists), artist => artist.id)
                        )
                    ),
                    action$.pipe(
                        ofType(getArtistsSuccess().type),
                        take(1),
                        mapTo(
                            getRecommendationsSuccess({
                                ...resp,
                                tracks: orderBy(resp.tracks, "popularity", "desc")
                            })
                        )
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

// Each actino should be dispatched with a constant
// and then the success shoudl also return it
const getNewReleases = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getNewReleasesStart().type),
        mergeMap(action =>
            thru(
                JSON.parse(lzString.decompressFromUTF16(localStorage.getItem("newReleases"))),
                ({ newReleases, albums, artists, songs }) => [
                    getAlbumsSuccess(values(albums)),
                    getArtistsSuccess(values(artists)),
                    getTracksSuccess(values(songs)),
                    getNewReleasesSuccess(newReleases)
                ]
            )
        )
    );

/*
        mapTo({ limit: 50, total: 1000, offset: 0, albums: [] }),
        expand(({ limit, total, offset, albums }) =>
            from(spotifyApi.getNewReleases({ country: "US", limit, offset })).pipe(
                mergeMap(resp =>
                    of({
                        offset: offset + limit,
                        limit,
                        albums: [...albums, ...resp.albums.items],
                        total: resp.albums.total
                    })
                ),
                catchError(e => console.error(e))
            )
        ),
        takeWhile(({ offset, total, limit }) => offset < total + limit),
        last(),
        mergeMap(({ albums }) =>
            concat(
                of(getAlbumsStart(map(albums, "id"))),
                action$.pipe(
                    ofType(getAlbumsSuccess().type),
                    take(1),
                    mapTo(getNewReleasesSuccess(albums))
                )
            )
        ),
        catchError(e => console.error(e))
    );
*/

const getAlbums = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getAlbumsStart().type),
        mergeMap(action => {
            const albums = albumsSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    albumId => !albums[albumId]
                )
            );
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 20), idSet =>
                          apiObservable(spotifyApi.getAlbums, [idSet], resp => of(resp))
                      )
                  ).pipe(
                      mergeMap(nestedAlbumsArray =>
                          thru(flatMap(nestedAlbumsArray, ({ albums }) => albums), albums =>
                              concat(
                                  of(getArtistsStart(flatMap(flatMap(albums, "artists"), "id"))),
                                  of(getTracksStart(map(flatMap(albums, "tracks.items"), "id"))),
                                  forkJoin(
                                      action$.pipe(
                                          ofType(getArtistsSuccess().type),
                                          take(1)
                                      ),
                                      action$.pipe(
                                          ofType(getTracksSuccess().type),
                                          take(1)
                                      )
                                  ).pipe(mapTo(getAlbumsSuccess(albums)))
                              )
                          )
                      )
                  )
                : of(getAlbumsSuccess([]));
        })
    );

/*
const newReleases = { newReleases: store.getState().app.spotify.newReleases, artists: store.getState().app.spotify.artistData, songs: store.getState().app.spotify.songs, albums: store.getState().app.spotify.albums}

localStorage.setItem('newReleases', lzstring.compressToUTF16(JSON.stringify(newReleases)))
*/

const cacheNewReleaseData = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getNewReleasesSuccess().type),
        mergeMap(action => {
            const state = state$.value;
            const newReleases = newReleasesSelector(state);
            const artists = albumsSelector(state);
            const tracks = songsSelector(state);
            const albums = albumsSelector(state);
            const newReleaseData = { newReleases, artists, tracks, albums };
            return of(setLocalStorage("newReleaseData", newReleaseData));
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
        seek(...args),
        getNewReleases(...args),
        getAlbums(...args),
        getSongData(...args)
    ).pipe(catchError(e => console.error(e)));
