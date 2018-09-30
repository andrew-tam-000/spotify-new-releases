import { slice } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
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
