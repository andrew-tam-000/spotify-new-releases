import spotifyApi from '../../spotifyApi';
import _ from 'lodash';

import {
    searchTextSelector,
    playlistIdSelector,
    playlistUriSelector
} from '../../selectors';


export function fetchAccessToken() {
    return {
        type: 'FETCH_ACCESS_TOKEN'
    }
}

function setAccessToken(hash) {
    return {
        type: 'SET_ACCESS_TOKEN',
        payload: hash
    }
}

function setUser(user) {
    return {
        type: 'SET_USER',
        payload: user
    }
}

function setPlaylist(playlist) {
    return {
        type: 'SET_PLAYLIST',
        payload: playlist
    }
}

function setSearchResults(searchResults) {
    return {
        type: 'SET_SEARCH_RESULTS',
        payload: searchResults
    }
}

export function setAccessTokenAsync(hash) { return (dispatch, getState) => {
        spotifyApi.setAccessToken(hash);
        dispatch(setAccessToken(hash));
        return dispatch(setUserAsync())
            .then( () => dispatch(createPlaylistAsync()))
        ;
    }
}

export function setUserAsync() {
    return dispatch => {
        return spotifyApi
            .getMe()
            .then( user => dispatch(setUser(user)))
    }
}

export function createPlaylistAsync() {
    return (dispatch, getState) => {
        const state = getState();
        const userId = _.get(state, 'user.id');

        if (userId) {
            return spotifyApi
                .createPlaylist(userId, {name: 'Random'})
                .then( playlist => dispatch(setPlaylist(playlist)))
        }
    }
}

export function searchAsync() {
    return (dispatch, getState) => {
        const q = searchTextSelector(getState());
        return spotifyApi
            .search(q, ['artist', 'track', 'album'])
            .then( searchResults => dispatch(setSearchResults(searchResults)))
    }
}

export function setSearchText(text) {
    return {
        type: 'SET_SEARCH_TEXT',
        payload: text
    }
}

export function addTracksToPlaylistAsync(uris) {
    return (dispatch, getState) => {
        const playlistId = playlistIdSelector(getState());
        return spotifyApi
            .addTracksToPlaylist(
                playlistId,
                uris
            )
            .then( () => dispatch(refreshPlaylist()))

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

export function refreshPlaylist() {
    return (dispatch, getState) => {
        const playlistId = playlistIdSelector(getState());
        return spotifyApi
            .getPlaylist(playlistId)
            .then(playlist => dispatch(setPlaylist(playlist)))
        ;
    }
}

export function play(trackUri) {
    return (dispatch, getState) => {
        const playlistUri = playlistUriSelector(getState());
        return spotifyApi
            .play({
                context_uri: playlistUri,
                offset: {
                    uri: trackUri
                }
            })

    }
}
