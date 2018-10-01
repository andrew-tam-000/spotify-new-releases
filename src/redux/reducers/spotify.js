import {
    getCurrentlyPlayingTrackSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess
} from "../actions/";
import { reduce, set, get } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
        case "GET_SPOTIFY_USER_SUCCESS":
            return {
                ...state,
                user: payload
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
                    {}
                )
            };
        case getSongDataSuccess().type:
            return {
                ...state,
                songData: reduce(
                    payload,
                    (acc, songData) => set(acc, get(songData, "id"), songData),
                    {}
                )
            };
        case getArtistDataSuccess().type:
            return {
                ...state,
                artistData: reduce(
                    payload,
                    (acc, artist) => set(acc, get(artist, "id"), artist),
                    {}
                )
            };
        default:
            return state;
    }
};
