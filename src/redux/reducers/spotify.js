import {
    getCurrentlyPlayingTrackSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess,
    getRelatedArtistsSuccess,
    getArtistTopTracksSuccess,
    pauseSongSuccess,
    setSearchResults
} from "../actions/";
import { reduce, set, get, keyBy, compact, filter, first, map } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
        case "GET_SPOTIFY_USER_SUCCESS":
            return {
                ...state,
                user: payload
            };
        case setSearchResults().type:
            return {
                ...state,
                songs: reduce(
                    get(payload, "tracks.items"),
                    (acc, track) => (acc[track.id] ? acc : set(acc, track.id, track)),
                    state.songs
                ),
                artistData: reduce(
                    get(payload, "artists.items"),
                    (acc, artist) => (acc[artist.id] ? acc : set(acc, artist.id, artist)),
                    state.artistData
                )
            };
        case getCurrentlyPlayingTrackSuccess().type:
            return {
                ...state,
                nowPlaying: payload
            };
        case getSongsSuccess().type:
            return {
                ...state,
                songs: {
                    ...state.songs,
                    ...keyBy(
                        filter(
                            // Duck type response
                            // for checking library songs or not
                            compact(
                                get(first(payload), "added_at")
                                    ? map(payload, song => get(song, "track"))
                                    : payload
                            ),
                            ({ id }) => !state.songs[id]
                        ),
                        "id"
                    )
                }
            };
        case getSongDataSuccess().type:
            return {
                ...state,
                songData: {
                    ...state.songData,
                    ...keyBy(filter(compact(payload), ({ id }) => !state.songData[id]), "id")
                }
            };
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
        default:
            return state;
    }
};
