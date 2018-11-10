import analyzer from "./analyzer";
import spotify from "./spotify";
import discover from "./discover";
import { combineReducers } from "redux";
import {
    addTracksToPlaylistSuccess,
    addGenreColors,
    removeGenreColors,
    showSideBar,
    hideSideBar,
    setDiscover
} from "../actions/";
import { reduce, set, omit } from "lodash";

const appReducer = combineReducers({
    analyzer,
    firebase: (state = {}, { type, payload }) => {
        switch (type) {
            case "REALTIME_FIREBASE_USER_SUCCESS":
            case "GET_FIREBASE_USER_SUCCESS":
                return {
                    ...payload
                };
            case "CREATE_FIREBASE_USER_SUCCESS":
            case "UPDATE_FIREBASE_USER_SUCCESS":
                return {
                    ...state,
                    ...payload
                };
            case "CREATE_ACCESS_TOKEN_SUCCESS":
                return {
                    ...state,
                    token: payload
                };
            default:
                return state;
        }
    },
    search: (state = {}, { type, payload }) => {
        switch (type) {
            case "search|OPEN_PANEL":
                return {
                    ...state,
                    isOpen: true
                };
            case "search|CLOSE_PANEL":
                return {
                    ...state,
                    isOpen: false
                };
            case "SET_SEARCH_RESULTS":
                return {
                    ...state,
                    ...payload
                };
            case "SET_SEARCH_TEXT":
                return {
                    ...state,
                    text: payload
                };
            default:
                return state;
        }
    },
    spotify,
    playlist: (state = {}, { type, payload }) => {
        switch (type) {
            case addTracksToPlaylistSuccess().type:
                return [...state, ...payload];
            case "REFRESH_PLAYLIST_SUCCESS":
            case "CREATE_PLAYLIST_SUCCESS":
                return {
                    ...state,
                    playlist: payload
                };
            default:
                return state;
        }
    },
    user: (state = {}) => state,
    showSideBar: (state = {}, { type, payload }) => {
        switch (type) {
            case showSideBar().type:
                return {
                    type: payload.type,
                    data: payload.data
                };
            case hideSideBar().type:
                return false;
            default:
                return state;
        }
    },
    discover,
    genreColors: (state = {}, { type, payload }) => {
        switch (type) {
            case addGenreColors().type:
                return {
                    ...state,
                    ...reduce(payload, (acc, { genre, color }) => set(acc, genre, color), {})
                };
            case removeGenreColors().type:
                return omit(state, payload);
            default:
                return state;
        }
    }
});

export default appReducer;
