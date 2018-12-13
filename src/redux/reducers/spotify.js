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
import { uniq, reduce, set, get, keyBy, compact, filter, first, map } from "lodash";

function mergeNewItems(obj, arr, idGetter) {
    return {
        ...obj,
        ...keyBy(filter(compact(arr), item => !obj[get(item, idGetter)]), idGetter)
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
                newReleases: payload
            };
        case setSearchResults().type:
            return {
                ...state,
                songs: mergeNewItems(state.songs, get(payload, "tracks.items"), "id"),
                albums: mergeNewItems(state.albums, get(payload, "albums.items"), "id"),
                artistData: mergeNewItems(state.artistData, get(payload, "artists.items"), "id"),
                playlists: mergeNewItems(state.playlists, get(payload, "playlists.items"), "id"),
                search: payload
            };
        case getCurrentlyPlayingTrackSuccess().type:
            return {
                ...state,
                nowPlaying: payload
            };
        case getTracksSuccess().type:
            return {
                ...state,
                songs: mergeNewItems(state.songs, payload, "id")
            };

        case getSongsSuccess().type:
            return {
                ...state,
                library: payload.songs,
                artistData: mergeNewItems(state.artistData, payload.artists, "id"),
                songs: mergeNewItems(state.songs, map(payload.songs, "track"), "id")
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
                songs: {
                    ...state.songs,
                    ...keyBy(filter(payload.tracks, ({ id }) => !state.songs[id]), "id")
                }
            };

        case getAlbumsSuccess().type:
            return {
                ...state,
                albums: mergeNewItems(state.albums, payload, "id")
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
