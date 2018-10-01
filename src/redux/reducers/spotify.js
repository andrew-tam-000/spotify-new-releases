import {
    getCurrentlyPlayingTrackSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess
} from "../actions/";

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
                songs: payload
            };
        case getSongDataSuccess().type:
            return {
                ...state,
                songData: payload
            };
        case getArtistDataSuccess().type:
            return {
                ...state,
                artistData: payload
            };
        default:
            return state;
    }
};
