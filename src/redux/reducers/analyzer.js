import { slice } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
        case "GET_SONGS_SUCCESS":
            return {
                ...state,
                songs: payload
            };
        case "GET_SONG_DATA_SUCCESS":
            return {
                ...state,
                songData: payload
            };
        case "GET_ARTIST_DATA_SUCCESS":
            return {
                ...state,
                artistData: payload
            };
        case "advanced-search|ADD_TRACK":
            return {
                ...state,
                advancedSearch: {
                    ...state.advancedSearch,
                    tracks: slice([payload, ...state.advancedSearch.tracks], 0, 5)
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
                advancedSearch: {
                    ...state.advancedSearch,
                    tracks: [
                        ...slice(state.advancedSearch.tracks, 0, payload),
                        ...slice(state.advancedSearch.tracks, payload + 1)
                    ]
                }
            };
        case "advanced-search|GET_RESULTS_SUCCESS":
            return {
                ...state,
                advancedSearch: {
                    ...state.advancedSearch,
                    results: payload
                }
            };
        case "advanced-search|CHANGE_TAB":
            return {
                ...state,
                advancedSearch: {
                    ...state.advancedSearch,
                    activeTab: payload
                }
            };
        case "advanced-search|SET_GENRES":
            return {
                ...state,
                advancedSearch: {
                    ...state.advancedSearch,
                    genres: payload
                }
            };
        case "analyzer|UPDATE_SEARCH_TERM":
            return {
                ...state,
                searchTerm: payload
            };
        case "analyzer|UPDATE_SORT":
            return {
                ...state,
                sort: payload
            };
        default:
            return state;
    }
};
