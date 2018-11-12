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
    setDiscover,
    toggleNewReleaseAlbum,
    toggleNewReleaseColors,
    openNewReleaseModal,
    closeNewReleaseModal,
    setNewReleaseModalGenre,
    setNewReleaseModalColor,
    setNewReleaseModalError,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks
} from "../actions/";
import { filter, map, omit, find } from "lodash";

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
    genreColors: (state = [], { type, payload }) => {
        switch (type) {
            case addGenreColors().type:
                return [
                    ...map(
                        state,
                        existingGenre =>
                            find(
                                payload.genreColors,
                                newGenre => newGenre.genre === existingGenre.genre
                            ) || existingGenre
                    ),
                    // Filter the newly added genres
                    ...filter(
                        payload.genreColors,
                        newGenre =>
                            // If you can't find the new genre in the existing genre
                            // then we should filter it out
                            !find(state, existingGenre => existingGenre.genre === newGenre.genre)
                    )
                ];
            case removeGenreColors().type:
                // TODO;
                return omit(state, payload);
            default:
                return state;
        }
    },
    newReleases: (state = {}, { type, payload }) => {
        switch (type) {
            case toggleNewReleaseAlbum().type:
                return {
                    ...state,
                    openAlbums: {
                        ...state.openAlbums,
                        [payload]: !state.openAlbums[payload]
                    }
                };
            case hideAllNewReleaseTracks().type:
                return {
                    ...state,
                    showAllTracks: false
                };
            case showAllNewReleaseTracks().type:
                return {
                    ...state,
                    showAllTracks: true
                };
            case toggleNewReleaseColors().type:
                return {
                    ...state,
                    showColors: !state.showColors
                };
            case openNewReleaseModal().type:
                return {
                    ...state,
                    modal: true
                };
            case closeNewReleaseModal().type:
                return {
                    ...state,
                    modal: false,
                    modalGenre: "",
                    modalColor: ""
                };

            case setNewReleaseModalGenre().type:
                return {
                    ...state,
                    modalGenre: payload
                };
            case setNewReleaseModalColor().type:
                return {
                    ...state,
                    modalColor: payload
                };
            default:
                return state;
        }
    }
});

export default appReducer;
