import {
    getCurrentlyPlayingTrackSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess,
    setSearchResults
} from "../actions/";
import { reduce, set, get } from "lodash";

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
                songs: reduce(
                    payload,
                    // Duck type response
                    (acc, song) =>
                        song.added_at
                            ? set(acc, get(song, "track.id"), get(song, "track"))
                            : set(acc, get(song, "id"), song),
                    state.songs
                )
            };
        case getSongDataSuccess().type:
            return {
                ...state,
                songData: reduce(
                    payload,
                    (acc, songData) => set(acc, get(songData, "id"), songData),
                    state.songData
                )
            };
        case getArtistDataSuccess().type:
            return {
                ...state,
                artistData: reduce(
                    payload,
                    (acc, artist) => set(acc, get(artist, "id"), artist),
                    state.artistData
                )
            };
        default:
            return state;
    }
};
