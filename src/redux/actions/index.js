import spotifyApi from '../../spotifyApi';
import _ from 'lodash';

import {
    searchTextSelector,
    playlistIdSelector,
    playlistUriSelector
} from '../../selectors';

///////////////////////////////////////////////
//
// PLAY_SONG
//
///////////////////////////////////////////////
export function playSongStart(trackUri) {
    return {
        type: 'PLAY_SONG_START',
        payload: trackUri
    }
}
export function playSongSuccess() {
    return {
        type: 'PLAY_SONG_SUCCESS',
    }
}
export function playSongError(message) {
    return {
        type: 'PLAY_SONG_ERROR',
        payload: message
    }
}

///////////////////////////////////////////////
//
// CREATE_PLAYLIST
//
///////////////////////////////////////////////
export function createPlaylistStart() {
    return {
        type: 'CREATE_PLAYLIST_START',
    }
}
export function createPlaylistSuccess(playlist) {
    return {
        type: 'CREATE_PLAYLIST_SUCCESS',
        payload: playlist,
    }
}
export function createPlaylistError() {
    return {
        type: 'CREATE_PLAYLIST_ERROR',
    }
}

///////////////////////////////////////////////
//
// SET_PLAYLIST
//
///////////////////////////////////////////////
export function setPlaylistStart() {
    return {
        type: 'SET_PLAYLIST_START',
    }
}
export function setPlaylistSuccess(playlist) {
    return {
        type: 'SET_PLAYLIST_SUCCESS',
        payload: playlist,
    }
}
export function setPlaylistError() {
    return {
        type: 'SET_PLAYLIST_ERROR',
    }
}

///////////////////////////////////////////////
//
// SET_FIREBASE_USER
//
///////////////////////////////////////////////
export function storeFirebaseUserStart() {
    return {
        type: 'STORE_FIREBASE_USER_START',
    }
}
export function storeFirebaseUserSuccess(firebaseUser) {
    return {
        type: 'STORE_FIREBASE_USER_SUCCESS',
        payload: firebaseUser
    }
}
export function storeFirebaseUserError() {
    return {
        type: 'STORE_FIREBASE_USER_ERROR',
    }
}


///////////////////////////////////////////////
//
// SET_ACCESS_TOKEN
//
///////////////////////////////////////////////
export function setAccessTokenStart() {
    return {
        type: 'SET_ACCESS_TOKEN_START'
    }
}
export function setAccessTokenSuccess(token) {
    return {
        type: 'SET_ACCESS_TOKEN_SUCCESS',
        payload: token
    }
}

///////////////////////////////////////////////
//
// CREATE_USER_ID
//
///////////////////////////////////////////////
export function createUserIdStart() {
    return {
        type: 'CREATE_USER_ID_START',
    }
}
export function createUserIdSuccess() {
    return {
        type: 'CREATE_USER_ID_SUCCESS',
    }
}

///////////////////////////////////////////////
//
// SET_SPOTIFY_USER
//
///////////////////////////////////////////////
export function setSpotifyUserStart() {
    return {
        type: 'SET_SPOTIFY_USER_START',
    }
}
export function setSpotifyUserSuccess(spotifyUser) {
    return {
        type: 'SET_SPOTIFY_USER_SUCCESS',
        payload: spotifyUser
    }
}

///////////////////////////////////////////////
//
// INITIALIZE_APP
//
///////////////////////////////////////////////
export function initializeAppStart() {
    return {
        type: 'INITIALIZE_APP_START',
    }
}








export function setUserUrl(url) {
    return {
        type: 'SET_USER_URL',
        payload: url,
    }
}

export function setSearchResults(searchResults) {
    return {
        type: 'SET_SEARCH_RESULTS',
        payload: searchResults
    }
}

export function setSearchText(text) {
    return {
        type: 'SET_SEARCH_TEXT',
        payload: text
    }
}

export function addTracksToPlaylist(uris) {
    return {
        type: 'ADD_TRACKS_TO_PLAYLIST',
        payload: uris,
    }
}
export function updateFirebaseUser(firebaseUser) {
    return {
        type: 'UPDATE_FIREBASE_USER',
        payload: firebaseUser
    }
}



/*
export function removeTracksToPlaylistAsync(uris) {
    return (dispatch, getState) => {
        const playlistId = playlistIdSelector(getState());
        return spotifyApi
            .removeTracksFromPlaylist(
                playlistId,
                uris
            )
            .then( () => dispatch(refreshPlaylist()))

    }
}
*/
