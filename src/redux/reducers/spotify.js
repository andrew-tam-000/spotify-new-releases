import {
    getCurrentlyPlayingTrackSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess,
    getArtistsSuccess,
    getRelatedArtistsSuccess,
    getArtistTopTracksSuccess,
    getRecommendationsSuccess,
    getTracksSuccess,
    getNewReleasesSuccess,
    getAlbumsSuccess,
    getDevicesSuccess,
    getRelatedTracksSuccess,
    setSearchResults,
    setSearchText
} from "../actions/";
import { flatMap, uniq, get, keyBy, compact, filter, first, map, thru, mapValues } from "lodash";

function mergeNewItems({ obj, arr, idGetter, isSimplified }) {
    return {
        ...obj,
        ...keyBy(
            filter(
                map(arr, entity => ({
                    ...entity,
                    isSimplified
                })),
                entity =>
                    thru(
                        obj[get(entity, idGetter)],
                        existingEntity =>
                            // If somethign already exists, then
                            // don't replace it if its not simplified
                            existingEntity
                                ? !existingEntity.isSimplified && entity.isSimplified
                                    ? false
                                    : true
                                : true
                    )
            ),
            idGetter
        )
    };
}

export default (state = {}, { type, payload = {} }) => {
    switch (type) {
        case "GET_SPOTIFY_USER_SUCCESS":
            return {
                ...state,
                user: payload
            };

        case getNewReleasesSuccess().type:
            return {
                ...state,
                newReleases: payload,
                albums: mergeNewItems({
                    obj: state.albums,
                    arr: payload,
                    idGetter: "id",
                    isSimplified: true
                })
            };
        case setSearchResults().type:
            return {
                ...state,
                songs: mergeNewItems({
                    obj: state.songs,
                    arr: get(payload, "tracks.items"),
                    idGetter: "id"
                }),
                albums: mergeNewItems({
                    obj: state.albums,
                    arr: get(payload, "albums.items"),
                    idGetter: "id",
                    isSimplified: true
                }),
                artistData: mergeNewItems({
                    obj: state.artistData,
                    arr: get(payload, "artists.items"),
                    idGetter: "id"
                }),
                playlists: mergeNewItems({
                    obj: state.playlists,
                    arr: get(payload, "playlists.items"),
                    idGetter: "id"
                }),
                search: mapValues(payload, entities => map(entities.items, "id"))
            };
        case getCurrentlyPlayingTrackSuccess().type:
            return {
                ...state,
                nowPlaying: payload
            };
        case getTracksSuccess().type:
            return {
                ...state,
                songs: mergeNewItems({ obj: state.songs, arr: payload, idGetter: "id" })
            };

        case getSongsSuccess().type:
            return {
                ...state,
                library: payload.songs,
                artistData: mergeNewItems({
                    obj: state.artistData,
                    arr: payload.artists,
                    idGetter: "id"
                }),
                songs: mergeNewItems({
                    obj: state.songs,
                    arr: map(payload.songs, "track"),
                    idGetter: "id"
                })
            };
        case getSongDataSuccess().type:
            return {
                ...state,
                songData: {
                    ...state.songData,
                    ...keyBy(filter(compact(payload), ({ id }) => !state.songData[id]), "id")
                }
            };
        case getArtistsSuccess().type:
        case getArtistDataSuccess().type:
            return {
                ...state,
                artistData: {
                    ...state.artistData,
                    ...keyBy(filter(compact(payload), ({ id }) => !state.artistData[id]), "id")
                }
            };
        case getRelatedArtistsSuccess().type:
            return {
                ...state,
                artistData: {
                    ...state.artistData,
                    ...keyBy(
                        filter(compact(payload.relatedArtists), ({ id }) => !state.artistData[id]),
                        "id"
                    )
                },
                relatedArtists: {
                    ...state.relatedArtists,
                    ...(state.relatedArtists[payload.artistId]
                        ? {}
                        : { [payload.artistId]: map(payload.relatedArtists, ({ id }) => id) })
                }
            };
        case getArtistTopTracksSuccess().type:
            return {
                ...state,
                songs: {
                    ...state.songs,
                    ...keyBy(
                        filter(compact(payload.topTracks), ({ id }) => !state.songData[id]),
                        "id"
                    )
                },
                artistTopTracks: {
                    ...state.artistTopTracks,
                    ...(state.artistTopTracks[payload.artistId]
                        ? {}
                        : { [payload.artistId]: map(payload.topTracks, ({ id }) => id) })
                }
            };

        case getRecommendationsSuccess().type:
            return {
                ...state,
                songs: mergeNewItems({
                    obj: state.songs,
                    arr: payload.tracks,
                    idGetter: "id"
                })
            };

        case getAlbumsSuccess().type:
            return {
                ...state,
                albums: mergeNewItems({ obj: state.albums, arr: payload, idGetter: "id" }),
                songs: mergeNewItems({
                    obj: state.songs,
                    arr: flatMap(payload, "tracks.items"),
                    idGetter: "id",
                    isSimplified: true
                })
            };
        case getDevicesSuccess().type:
            return {
                ...state,
                devices: payload
            };
        case getRelatedTracksSuccess().type:
            return {
                ...state,
                relatedTracks: {
                    ...state.relatedTracks,
                    [first(payload.seeds).id]: uniq([
                        ...(state.relatedTracks[first(payload.seeds).id] || []),
                        ...map(payload.tracks, "id")
                    ])
                }
            };
        case setSearchText().type:
            return {
                ...state,
                text: payload
            };
        default:
            return state;
    }
};
