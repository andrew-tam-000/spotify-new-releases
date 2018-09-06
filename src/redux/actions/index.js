import spotifyApi from '../../spotifyApi';
import _ from 'lodash';

import {
    searchTextSelector,
    playlistIdSelector,
    playlistUriSelector
} from '../../selectors';

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

export function setFirebaseUserIdStart() {
    return {
        type: 'SET_FIREBASE_USER_ID_START',
    }
}
export function setFirebaseUserIdSuccess(id) {
    return {
        type: 'SET_FIREBASE_USER_ID_SUCCESS',
        payload: id,
    }
}
export function setFirebaseUserIdError(message) {
    return {
        type: 'SET_FIREBASE_USER_ID_ERROR',
        payload: message,
    }
}

export function updateFirebaseUser(firebaseUser) {
    return {
        type: 'UPDATE_FIREBASE_USER',
        payload: firebaseUser
    }
}

export function setFirebaseUser(firebaseUser) {
    return {
        type: 'SET_FIREBASE_USER',
        payload: firebaseUser
    }
}


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

export function setUserUrl(url) {
    return {
        type: 'SET_USER_URL',
        payload: url,
    }
}

export function fetchUserData(userId) {
    return {
        type: 'FETCH_USER_DATA',
        payload: userId
    }
}


export function setSpotifyUser(spotifyUser) {
    return {
        type: 'SET_SPOTIFY_USER',
        payload: spotifyUser
    }
}

export function setPlaylist(playlist) {
    return {
        type: 'SET_PLAYLIST',
        payload: playlist
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
