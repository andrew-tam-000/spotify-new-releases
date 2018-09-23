import spotifyApi from "../../spotifyApi";
import _ from "lodash";

import { searchTextSelector, playlistIdSelector, playlistUriSelector } from "../../selectors";

export function realtimeFirebaseUserSuccess(userData) {
    return {
        type: "REALTIME_FIREBASE_USER_SUCCESS",
        payload: userData
    };
}
export function realtimeFirebaseUserError(errMsg) {
    return {
        type: "REALTIME_FIREBASE_USER_ERROR",
        payload: errMsg
    };
}

///////////////////////////////////////////////
//
// GET_FIREBASE_USER
//
///////////////////////////////////////////////
export function getFirebaseUserStart(userId) {
    return {
        type: "GET_FIREBASE_USER_START",
        payload: userId
    };
}
export function getFirebaseUserSuccess(userData) {
    return {
        type: "GET_FIREBASE_USER_SUCCESS",
        payload: userData
    };
}

///////////////////////////////////////////////
//
// PLAY_SONG
//
///////////////////////////////////////////////
export function playSongStart(trackUri) {
    return {
        type: "PLAY_SONG_START",
        payload: trackUri
    };
}
export function playSongSuccess() {
    return {
        type: "PLAY_SONG_SUCCESS"
    };
}
export function playSongError(message) {
    return {
        type: "PLAY_SONG_ERROR",
        payload: message
    };
}

///////////////////////////////////////////////
//
// CREATE_PLAYLIST
//
///////////////////////////////////////////////
export function createPlaylistStart() {
    return {
        type: "CREATE_PLAYLIST_START"
    };
}
export function createPlaylistSuccess(playlist) {
    return {
        type: "CREATE_PLAYLIST_SUCCESS",
        payload: playlist
    };
}
export function createPlaylistError() {
    return {
        type: "CREATE_PLAYLIST_ERROR"
    };
}

///////////////////////////////////////////////
//
// CREATE_PLAYLIST
//
///////////////////////////////////////////////
export function deletePlaylistStart(playlistId) {
    return {
        type: "DELETE_PLAYLIST_START",
        payload: playlistId
    };
}
export function deletePlaylistSuccess() {
    return {
        type: "DELETE_PLAYLIST_SUCCESS"
    };
}

///////////////////////////////////////////////
//
// SET_PLAYLIST
//
///////////////////////////////////////////////
export function setPlaylistStart() {
    return {
        type: "SET_PLAYLIST_START"
    };
}
export function setPlaylistSuccess(playlist) {
    return {
        type: "SET_PLAYLIST_SUCCESS",
        payload: playlist
    };
}
export function setPlaylistError() {
    return {
        type: "SET_PLAYLIST_ERROR"
    };
}

///////////////////////////////////////////////
//
// UPDATE_FIREBASE_USER
//
///////////////////////////////////////////////
export function updateFirebaseUserStart(userData) {
    return {
        type: "UPDATE_FIREBASE_USER_START",
        payload: userData
    };
}
export function updateFirebaseUserSuccess(userData) {
    return {
        type: "UPDATE_FIREBASE_USER_SUCCESS",
        payload: userData
    };
}
export function updateFirebaseUserError(errorMessage) {
    return {
        type: "UPDATE_FIREBASE_USER_ERROR",
        payload: errorMessage
    };
}

///////////////////////////////////////////////
//
// CREATE_FIREBASE_USER
//
///////////////////////////////////////////////
export function createFirebaseUserStart() {
    return {
        type: "CREATE_FIREBASE_USER_START"
    };
}
export function createFirebaseUserSuccess(firebaseUser) {
    return {
        type: "CREATE_FIREBASE_USER_SUCCESS",
        payload: firebaseUser
    };
}
export function createFirebaseUserError() {
    return {
        type: "CREATE_FIREBASE_USER_ERROR"
    };
}

///////////////////////////////////////////////
//
// SET_ACCESS_TOKEN
//
///////////////////////////////////////////////
export function createAccessTokenStart() {
    return {
        type: "CREATE_ACCESS_TOKEN_START"
    };
}
export function createAccessTokenSuccess(token) {
    return {
        type: "CREATE_ACCESS_TOKEN_SUCCESS",
        payload: token
    };
}

///////////////////////////////////////////////
//
// GET_SPOTIFY_USER
//
///////////////////////////////////////////////
export function getSpotifyUserStart() {
    return {
        type: "GET_SPOTIFY_USER_START"
    };
}
export function getSpotifyUserSuccess(spotifyUser) {
    return {
        type: "GET_SPOTIFY_USER_SUCCESS",
        payload: spotifyUser
    };
}

///////////////////////////////////////////////
//
// INITIALIZE_APP
//
///////////////////////////////////////////////
export function initializeAppStart() {
    return {
        type: "INITIALIZE_APP_START"
    };
}
export function initializeAppSuccess() {
    return {
        type: "INITIALIZE_APP_SUCCESS"
    };
}

export function initializeOnPlaylist(userId) {
    return {
        type: "INITIALIZE_ON_PLAYLIST",
        payload: userId
    };
}

///////////////////////////////////////////////
//
// ADD_TRACKS_TO_PLAYLIST
//
///////////////////////////////////////////////
export function addTracksToPlaylistStart(uris) {
    return {
        type: "ADD_TRACKS_TO_PLAYLIST_START",
        payload: uris
    };
}
export function addTracksToPlaylistSuccess() {
    return {
        type: "ADD_TRACKS_TO_PLAYLIST_SUCCESS"
    };
}

///////////////////////////////////////////////
//
// REFRESH_PLAYLIST
//
///////////////////////////////////////////////
export function refreshPlaylistStart() {
    return {
        type: "REFRESH_PLAYLIST_START"
    };
}
export function refreshPlaylistSuccess(playlist) {
    return {
        type: "REFRESH_PLAYLIST_SUCCESS",
        payload: playlist
    };
}

///////////////////////////////////////////////
//
// INITIALIZE_ON_ANALYZER
//
///////////////////////////////////////////////
export function initializeOnAnalyzerStart() {
    return {
        type: "INITIALIZE_ON_ANALYZER_START"
    };
}
export function initializeOnAnalyzerSuccess() {
    return {
        type: "INITIALIZE_ON_ANALYZER_SUCCESS"
    };
}

///////////////////////////////////////////////
//
// GET_SONGS
//
///////////////////////////////////////////////
export function getSongsStart() {
    return {
        type: "GET_SONGS_START"
    };
}
export function getSongsSuccess(songs) {
    return {
        type: "GET_SONGS_SUCCESS",
        payload: songs
    };
}

///////////////////////////////////////////////
//
// GET_SONG_DATA
//
///////////////////////////////////////////////
export function getSongDataStart() {
    return {
        type: "GET_SONG_DATA_START"
    };
}

export function getSongDataSuccess(songData) {
    return {
        type: "GET_SONG_DATA_SUCCESS",
        payload: songData
    };
}

///////////////////////////////////////////////
//
// GET_ARTIST_DATA
//
///////////////////////////////////////////////
export function getArtistDataStart() {
    return {
        type: "GET_ARTIST_DATA_START"
    };
}

export function getArtistDataSuccess(songData) {
    return {
        type: "GET_ARTIST_DATA_SUCCESS",
        payload: songData
    };
}

///////////////////////////////////////////////
//
// analzyer
//
///////////////////////////////////////////////
export function analyzerUpdateSearchTerm(term) {
    return {
        type: "analyzer|UPDATE_SEARCH_TERM",
        payload: term
    };
}
///////////////////////////////////////////////
//
// advanced-search
//
///////////////////////////////////////////////
export function advancedSearchAddTrack(trackDetails) {
    return {
        type: "advanced-search|ADD_TRACK",
        payload: trackDetails
    };
}

export function advancedSearchRemoveTrack(index) {
    return {
        type: "advanced-search|REMOVE_TRACK",
        payload: index
    };
}

export function advancedSearchUpdateAttributes(trackDetails) {
    return {
        type: "advanced-search|UPDATE_ATTRIBUTES",
        payload: trackDetails
    };
}

export function advancedSearchGetResultsStart(params) {
    return {
        type: "advanced-search|GET_RESULTS_START",
        payload: params
    };
}

export function advancedSearchGetResultsSuccess(results) {
    return {
        type: "advanced-search|GET_RESULTS_SUCCESS",
        payload: results
    };
}

export function advancedSearchGetResultsError(errMsg) {
    return {
        type: "advanced-search|GET_RESULTS_ERROR",
        payload: errMsg
    };
}

export function advancedSearchChangeTab(index) {
    return {
        type: "advanced-search|CHANGE_TAB",
        payload: index
    };
}

////////////////////////////////////////////////////
export function updateFirebaseUser(firebaseUser) {
    return {
        type: "UPDATE_FIREBASE_USER",
        payload: firebaseUser
    };
}

export function setUserUrl(url) {
    return {
        type: "SET_USER_URL",
        payload: url
    };
}

export function setSearchResults(searchResults) {
    return {
        type: "SET_SEARCH_RESULTS",
        payload: searchResults
    };
}

export function setSearchText(text) {
    return {
        type: "SET_SEARCH_TEXT",
        payload: text
    };
}
