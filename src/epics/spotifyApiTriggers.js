import { ofType } from "redux-observable";
import axios from "axios";
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
    values,
    range,
    split,
    nth
} from "lodash";
import { merge } from "rxjs/observable/merge";
import { EMPTY, concat, if as if$, from, timer, of, interval, forkJoin } from "rxjs";
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
    delay,
    every as every$
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
    advancedSearchArtistsSelector,
    newReleaseGenresSelector
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
    setLocalStorage,
    disableAccessToken,
    getDevicesStart,
    getDevicesSuccess,
    transferPlaybackStart,
    transferPlaybackSuccess,
    addToMySavedTracksStart,
    addToMySavedTracksSuccess,
    getRelatedTracksStart,
    getRelatedTracksSuccess,
    getPlaylistStart,
    getPlaylistSuccess
} from "../redux/actions";
import { apiObservable, basicSpotifyApiWrapper } from "./helpers";
import { getKeyFromLocalStorage } from "../utils";

// Need to also grab this track from the api
const getNowPlaying = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getCurrentlyPlayingTrackStart().type),
        mergeMap(action =>
            apiObservable(
                spotifyApi.getMyCurrentPlaybackState,
                [],
                resp =>
                    thru(
                        get(resp, "item.id"),
                        songId =>
                            songId
                                ? songsSelector(state$.value)[songId]
                                    ? from(Promise.resolve()).pipe(
                                          mapTo(getCurrentlyPlayingTrackSuccess(resp))
                                      )
                                    : concat(
                                          of(getTracksStart([songId])),
                                          action$.pipe(
                                              ofType(getTracksSuccess().type),
                                              take(1),
                                              mapTo(getCurrentlyPlayingTrackSuccess(resp))
                                          )
                                      )
                                : of(getCurrentlyPlayingTrackSuccess())
                    ),
                resp => {
                    console.log(resp);
                    return of(disableAccessToken());
                }
            )
        )
    );

const getTracks = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getTracksStart().type),
        mergeMap(action => {
            const tracks = songsSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    // keep the id if the no album exists for it,
                    // or the existing album is simplified
                    songId => !tracks[songId] || get(tracks, `${songId}.isSimplified`)
                )
            );
            // Fixing rate limit issue
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 50), (idSet, idx) =>
                          timer(200 * idx).pipe(
                              mergeMap(val =>
                                  from(
                                      basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                                          basicSpotifyApi.getTracks(idSet)
                                      )
                                  )
                              )
                          )
                      )
                  ).pipe(
                      mergeMap(nestedTracksArray =>
                          of(getTracksSuccess(flatMap(nestedTracksArray, ({ tracks }) => tracks)))
                      )
                  )
                : of(getTracksSuccess([]));
        })
    );

const getArtists = (action$, state$, { basicSpotifyApi }) =>
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
                          basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                              basicSpotifyApi.getArtists(idSet)
                          )
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

const getSongData = (action$, state$, { basicSpotifyApi }) =>
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
                          basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                              basicSpotifyApi.getAudioFeaturesForTracks(idSet)
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
const getSearchResults = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType("SET_SEARCH_TEXT"),
        debounce(() => timer(400)),
        switchMap(
            ({ payload: searchText }) =>
                !searchText
                    ? EMPTY
                    : thru(
                          split(searchText, ":"),
                          query =>
                              nth(query, -2) === "playlist"
                                  ? concat(
                                        of(getPlaylistStart(nth(query, -1))),
                                        action$.pipe(
                                            ofType(getPlaylistSuccess().type),
                                            take(1),
                                            mergeMap(({ payload }) =>
                                                of(
                                                    setSearchResults({
                                                        playlists: { items: [payload] }
                                                    })
                                                )
                                            )
                                        )
                                    )
                                  : from(
                                        basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                                            basicSpotifyApi.search(searchText, [
                                                "artist",
                                                "track",
                                                "album",
                                                "playlist"
                                            ])
                                        )
                                    ).pipe(
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

const getRelatedArtists = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getRelatedArtistsStart().type),
        mergeMap(action =>
            basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                basicSpotifyApi.getArtistRelatedArtists(action.payload)
            ).pipe(
                mergeMap(resp =>
                    of(
                        getRelatedArtistsSuccess(
                            action.payload,
                            orderBy(resp.artists, "popularity", "desc")
                        )
                    )
                )
            )
        )
    );

const getArtistTopTracks = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getArtistTopTracksStart().type),
        mergeMap(action =>
            basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                basicSpotifyApi.getArtistTopTracks(action.payload, "US")
            ).pipe(mergeMap(resp => of(getArtistTopTracksSuccess(action.payload, resp.tracks))))
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
            apiObservable(spotifyApi.seek, [action.payload, {}], resp => of(seekSuccess()))
        )
    );

const getRecommendations = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getRecommendationsStart().type),
        mergeMap(action =>
            from(
                basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                    basicSpotifyApi.getRecommendations(action.payload)
                )
            ).pipe(
                mergeMap(
                    resp =>
                        of(
                            getRecommendationsSuccess({
                                ...resp,
                                tracks: orderBy(resp.tracks, "popularity", "desc")
                            })
                        )
                    /*
                    concat(
                        of(getAlbumsStart(map(resp.tracks, "album.id"))),
                        action$.pipe(
                            ofType(getAlbumsSuccess().type),
                            take(1),
                            mergeMap(() =>
                                of(
                                    getRecommendationsSuccess({
                                        ...resp,
                                        tracks: orderBy(resp.tracks, "popularity", "desc")
                                    })
                                )
                            )
                        )
                    )
                    */
                )
            )
        )
    );

const getAdvancedSearchResults = (action$, state$, { basicSpotifyApi }) =>
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

            return basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                basicSpotifyApi.getRecommendations(
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
                )
            ).pipe(
                mergeMap(resp => [
                    advancedSearchGetResultsSuccess(resp),
                    advancedSearchChangeTab(2)
                ])
            );
        })
    );

// Each actino should be dispatched with a constant
// and then the success shoudl also return it
const getNewReleases = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getNewReleasesStart().type),
        mergeMap(
            action =>
                thru(
                    [
                        get(getKeyFromLocalStorage("newReleaseData"), "expiration"),
                        get(getKeyFromLocalStorage("newReleaseData"), "value")
                    ],
                    ([expiration, value]) => false
                    // value && expiration && expiration > new Date().getTime()
                )
                    ? thru(
                          getKeyFromLocalStorage("newReleaseData") || {},
                          ({ value: { newReleases, albums, artists, songs } = {} }) => [
                              getAlbumsSuccess(values(albums)),
                              getArtistsSuccess(values(artists)),
                              getTracksSuccess(values(songs)),
                              getNewReleasesSuccess(newReleases)
                          ]
                      )
                    : from(
                          Promise.resolve(
                              // Get counts
                              basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                                  basicSpotifyApi.getNewReleases({
                                      country: "US",
                                      limit: 20,
                                      offset: 0
                                  })
                              )
                                  .then(({ albums: { total } }) => total)
                                  .then(count =>
                                      Promise.all(
                                          map(chunk(range(count), 20), (items, idx) =>
                                              basicSpotifyApiWrapper(
                                                  basicSpotifyApi,
                                                  basicSpotifyApi =>
                                                      basicSpotifyApi.getNewReleases({
                                                          country: "US",
                                                          limit: items.length,
                                                          offset: idx * 20
                                                      })
                                              )
                                          )
                                      )
                                  )
                                  .then(results => flatMap(results, "albums.items"))
                          )
                      ).pipe(
                          mergeMap(
                              albums =>
                                  concat(
                                      of(getAlbumsStart(map(albums, "id"))),
                                      of(
                                          getArtistsStart(
                                              flatMap(albums, album => map(album.artists, "id"))
                                          )
                                      ),
                                      of(getNewReleasesSuccess(albums))
                                  )
                              /*
                              concat(
                                  of(getAlbumsStart(map(albums, "id"))),
                                  action$.pipe(
                                      ofType(getAlbumsSuccess().type),
                                      take(1),
                                      mergeMap(() => {
                                          return [
                                              thru(
                                                  [
                                                      albums,
                                                      artistDataSelector(state$.value),
                                                      songsSelector(state$.value),
                                                      albumsSelector(state$.value)
                                                  ],
                                                  ([newReleases, artists, songs, albums]) =>
                                                      setLocalStorage(
                                                          "newReleaseData",
                                                          {
                                                              newReleases,
                                                              artists,
                                                              songs,
                                                              albums
                                                          },
                                                          new Date().getTime() + 1000 * 60 * 60 * 24
                                                      )
                                              ),
                                              getNewReleasesSuccess(albums)
                                          ];
                                      })
                                  )
                              )
                              */
                          )
                      )
        )
    );

/*
const newReleases = { newReleases: store.getState().app.spotify.newReleases, artists: store.getState().app.spotify.artistData, songs: store.getState().app.spotify.songs, albums: store.getState().app.spotify.albums}

localStorage.setItem('newReleases', lzstring.compressToUTF16(JSON.stringify(newReleases)))
*/

const getAlbums = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getAlbumsStart().type),
        mergeMap(action => {
            const albums = albumsSelector(state$.value);
            const idsToFetch = uniq(
                filter(
                    isArray(action.payload) ? action.payload : [action.payload],
                    // keep the id if the no album exists for it,
                    // or the existing album is simplified
                    albumId => !albums[albumId] || get(albums, `${albumId}.isSimplified`)
                )
            );
            // TODO: Bug here - we should fetch the artists after we fetch all the tracks
            return size(idsToFetch)
                ? forkJoin(
                      ...map(chunk(idsToFetch, 20), idSet =>
                          basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                              basicSpotifyApi.getAlbums(idSet)
                          )
                      )
                  ).pipe(
                      switchMap(nestedAlbumsArray =>
                          thru(
                              flatMap(nestedAlbumsArray, ({ albums }) => albums),
                              albums => of(getAlbumsSuccess(albums))
                              /*
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
                              */
                          )
                      )
                  )
                : of(getAlbumsSuccess([]));
        })
    );

const getDevices = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getDevicesStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.getMyDevices, [], resp => of(getDevicesSuccess(resp.devices)))
        )
    );

const transferPlayback = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(transferPlaybackStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.transferMyPlayback, [[action.payload], { play: true }], resp =>
                of(transferPlaybackSuccess())
            )
        )
    );

const addToMySavedTracks = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(addToMySavedTracksStart().type),
        mergeMap(action =>
            apiObservable(spotifyApi.addToMySavedTracks, [action.payload], resp =>
                of(addToMySavedTracksSuccess())
            )
        )
    );

const getRelatedTracks = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(getRelatedTracksStart().type),
        mergeMap(({ payload }) =>
            concat(
                of(getRecommendationsStart({ seed_tracks: [payload] })),
                action$.pipe(
                    ofType(getRecommendationsSuccess().type),
                    take(1),
                    mergeMap(({ payload }) =>
                        concat(
                            of(getRelatedTracksSuccess(payload)),
                            of(
                                getArtistsStart(
                                    flatMap(payload.tracks, track =>
                                        map(get(track, "artists"), "id")
                                    )
                                )
                            ),
                            of(getAlbumsStart(map(payload.tracks, "album.id")))
                        )
                    )
                )
            )
        )
    );

const getPlaylist = (action$, state$, { basicSpotifyApi }) =>
    action$.pipe(
        ofType(getPlaylistStart().type),
        mergeMap(({ payload }) =>
            from(
                basicSpotifyApiWrapper(basicSpotifyApi, basicSpotifyApi =>
                    basicSpotifyApi.getPlaylist(payload)
                )
            ).pipe(mergeMap(playlistData => of(getPlaylistSuccess(playlistData))))
        )
    );

export default (...args) =>
    merge(
        getArtistTopTracks(...args),
        getRelatedArtists(...args),
        getNowPlaying(...args),
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
        getSongData(...args),
        getDevices(...args),
        transferPlayback(...args),
        addToMySavedTracks(...args),
        getRelatedTracks(...args),
        getPlaylist(...args)
    ).pipe(catchError(e => console.error(e)));
