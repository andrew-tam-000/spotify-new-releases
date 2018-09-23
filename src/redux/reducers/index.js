import initialState from "../state";
import { slice } from "lodash";

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case "CREATE_ACCESS_TOKEN_SUCCESS":
            return {
                ...state,
                firebase: {
                    ...state.firebase,
                    token: payload
                }
            };
        case "GET_SPOTIFY_USER_SUCCESS":
            return {
                ...state,
                spotifyUser: payload
            };
        case "REALTIME_FIREBASE_USER_SUCCESS":
        case "GET_FIREBASE_USER_SUCCESS":
            return {
                ...state,
                firebase: payload
            };
        case "CREATE_FIREBASE_USER_SUCCESS":
        case "UPDATE_FIREBASE_USER_SUCCESS":
            return {
                ...state,
                firebase: {
                    ...state.firebase,
                    ...payload
                }
            };
        case "REFRESH_PLAYLIST_SUCCESS":
        case "CREATE_PLAYLIST_SUCCESS":
            return {
                ...state,
                playlist: payload
            };
        case "SET_SEARCH_RESULTS":
            return {
                ...state,
                search: {
                    ...state.search,
                    ...payload
                }
            };
        case "SET_SEARCH_TEXT":
            return {
                ...state,
                search: {
                    ...state.search,
                    text: payload
                }
            };
        case "GET_SONGS_SUCCESS":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    songs: payload
                }
            };
        case "GET_SONG_DATA_SUCCESS":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    songData: payload
                }
            };
        case "GET_ARTIST_DATA_SUCCESS":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    artistData: payload
                }
            };
        case "advanced-search|ADD_TRACK":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    advancedSearch: {
                        ...state.analyzer.advancedSearch,
                        tracks: slice([payload, ...state.analyzer.advancedSearch.tracks], 0, 5)
                    }
                }
            };
        case "advanced-search|UPDATE_ATTRIBUTES":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    advancedSearch: {
                        ...state.analyzer.advancedSearch,
                        attributes: {
                            ...state.analyzer.advancedSearch.attributes,
                            ...payload
                        }
                    }
                }
            };
        case "advanced-search|REMOVE_TRACK":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    advancedSearch: {
                        ...state.analyzer.advancedSearch,
                        tracks: [
                            ...slice(state.analyzer.advancedSearch.tracks, 0, payload),
                            ...slice(state.analyzer.advancedSearch.tracks, payload + 1)
                        ]
                    }
                }
            };
        case "advanced-search|GET_RESULTS_SUCCESS":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    advancedSearch: {
                        ...state.analyzer.advancedSearch,
                        results: payload
                    }
                }
            };
        case "advanced-search|CHANGE_TAB":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    advancedSearch: {
                        ...state.analyzer.advancedSearch,
                        activeTab: payload
                    }
                }
            };
        case "analyzer|UPDATE_SEARCH_TERM":
            return {
                ...state,
                analyzer: {
                    ...state.analyzer,
                    searchTerm: payload
                }
            };
        default:
            return state;
    }
};
