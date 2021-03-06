import {
    initializeOnAnalyzerStart,
    initializeOnAnalyzerSuccess,
    getSongsSuccess,
    getSongDataSuccess,
    getArtistDataSuccess
} from "../actions/";
import { slice, map, get } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
        case initializeOnAnalyzerStart().type:
            return {
                ...state,
                loading: true
            };
        case initializeOnAnalyzerSuccess().type:
            return {
                ...state,
                loading: false
            };
        case getSongsSuccess().type:
            return {
                ...state,
                songs: map(payload, ({ added_at, track }) => ({
                    added_at,
                    track: get(track, "id")
                }))
            };
        case getArtistDataSuccess().type:
            return {
                ...state,
                artistData: map(payload, ({ id }) => id)
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
                advancedSearch: {
                    ...state.advancedSearch,
                    attributes: {
                        ...state.advancedSearch.attributes,
                        ...payload
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
        case "advanced-search|SET_ARTISTS":
            return {
                ...state,
                advancedSearch: {
                    ...state.advancedSearch,
                    artists: payload
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
        case "analyzer|OPEN_SEARCH_PANEL":
            return {
                ...state,
                openSearchPanel: true
            };
        case "analyzer|CLOSE_SEARCH_PANEL":
            return {
                ...state,
                openSearchPanel: false
            };
        default:
            return state;
    }
};
