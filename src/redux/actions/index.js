import spotifyApi from '../../spotifyApi';
import _ from 'lodash';


// TODO: Deprecate this file

import {
    searchTextSelector,
    playlistIdSelector,
    playlistUriSelector
} from '../../selectors';

export function play(trackUri) {
    return {
        type: 'PLAY_SONG',
        payload: trackUri
    }
}

export function refreshPlaylist() {
    return {
        type: 'REFRESH_PLAYLIST',
    }
}

export function setFirebaseUserId(id) {
    return {
        type: 'SET_FIREBASE_USER_ID',
        payload: id,
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


export function fetchAccessToken() {
    return {
        type: 'FETCH_ACCESS_TOKEN'
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

export function setAccessToken(hash) {
    return {
        type: 'SET_ACCESS_TOKEN',
        payload: hash
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
