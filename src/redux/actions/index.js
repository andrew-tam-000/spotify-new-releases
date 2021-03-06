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
export function playSongStart(params) {
    return {
        type: "PLAY_SONG_START",
        payload: params
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
// PAUSE_SONG
//
///////////////////////////////////////////////
export function pauseSongStart() {
    return {
        type: "PAUSE_SONG_START"
    };
}
export function pauseSongSuccess() {
    return {
        type: "PAUSE_SONG_SUCCESS"
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

export function disableAccessToken() {
    return {
        type: "DISABLE_ACCESS_TOKEN"
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

export function getCurrentlyPlayingTrackStart() {
    return {
        type: "spotify|GET_CURRENTLY_PLAYING_TRACK_START"
    };
}

export function getCurrentlyPlayingTrackSuccess(currentlyPlayingTrack) {
    return {
        type: "spotify|GET_CURRENTLY_PLAYING_TRACK_SUCCESS",
        payload: currentlyPlayingTrack
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
export function addTracksToPlaylistSuccess(uris) {
    return {
        type: "ADD_TRACKS_TO_PLAYLIST_SUCCESS",
        payload: uris
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
// INITIALIZE_ON_DISCOVER
//
///////////////////////////////////////////////
export function initializeOnDiscoverStart() {
    return {
        type: "INITIALIZE_ON_DISCOVER_START"
    };
}

///////////////////////////////////////////////
//
// GET_SONGS
//
///////////////////////////////////////////////
export function getSongsStart() {
    return {
        type: "spotify|GET_SONGS_START"
    };
}
export function getSongsSuccess(songs, artists) {
    return {
        type: "spotify|GET_SONGS_SUCCESS",
        payload: { songs, artists }
    };
}

///////////////////////////////////////////////
//
// GET_SONG_DATA
//
///////////////////////////////////////////////
export function getSongDataStart(trackIds) {
    return {
        type: "spotify|GET_SONG_DATA_START",
        payload: trackIds
    };
}

export function getSongDataSuccess(songData) {
    return {
        type: "spotify|GET_SONG_DATA_SUCCESS",
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
        type: "spotify|GET_ARTIST_DATA_START"
    };
}

export function getArtistDataSuccess(artistData) {
    return {
        type: "spotify|GET_ARTIST_DATA_SUCCESS",
        payload: artistData
    };
}

///////////////////////////////////////////////
//
// GET_RELATED_ARTISTS
//
///////////////////////////////////////////////
export function getRelatedArtistsStart(artistId) {
    return {
        type: "spotify|GET_RELATED_ARTISTS_START",
        payload: artistId
    };
}

export function getRelatedArtistsSuccess(artistId, relatedArtists) {
    return {
        type: "spotify|GET_RELATED_ARTISTS_SUCCESS",
        payload: {
            artistId,
            relatedArtists
        }
    };
}

///////////////////////////////////////////////
//
// GET_ARTIST_TOP_TRACKS
//
///////////////////////////////////////////////
export function getArtistTopTracksStart(artistId) {
    return {
        type: "spotify|GET_ARTIST_TOP_TRACKS_START",
        payload: artistId
    };
}

export function getArtistTopTracksSuccess(artistId, topTracks) {
    return {
        type: "spotify|GET_ARTIST_TOP_TRACKS_SUCCESS",
        payload: {
            artistId,
            topTracks
        }
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

export function analyzerUpdateSort(term) {
    return {
        type: "analyzer|UPDATE_SORT",
        payload: term
    };
}

export function analyzerOpenSearchPanel() {
    return {
        type: "analyzer|OPEN_SEARCH_PANEL"
    };
}

export function analyzerCloseSearchPanel() {
    return {
        type: "analyzer|CLOSE_SEARCH_PANEL"
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

export function advancedSearchSetGenres(genres) {
    return {
        type: "advanced-search|SET_GENRES",
        payload: genres
    };
}

export function advancedSearchSetArtists(artists) {
    return {
        type: "advanced-search|SET_ARTISTS",
        payload: artists
    };
}

export function getRecommendationsStart(params) {
    return {
        type: "advanced-search|GET_RECOMMENDATIONS_START",
        payload: params
    };
}

export function getRecommendationsSuccess(resp) {
    return {
        type: "advanced-search|GET_RECOMMENDATIONS_SUCCESS",
        payload: resp
    };
}

////////////////////////////////////////////////////
//
//
// SEARCH
//
////////////////////////////////////////////////////
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

////////////////////////////////////////////////////
//
//
// SHOW_SIDE_BAR
//
//
////////////////////////////////////////////////////
export function showSideBar(type, data) {
    return {
        type: "SHOW_SIDE_BAR",
        payload: { type, data }
    };
}

export function hideSideBar() {
    return {
        type: "HIDE_SIDE_BAR"
    };
}

export function getTracksStart(ids) {
    return {
        type: "spotify|GET_TRACKS_START",
        payload: ids
    };
}

export function getTracksSuccess(tracks) {
    return {
        type: "spotify|GET_TRACKS_SUCCESS",
        payload: tracks
    };
}

export function getArtistsStart(ids) {
    return {
        type: "spotify|GET_ARTISTS_START",
        payload: ids
    };
}

export function getArtistsSuccess(artists) {
    return {
        type: "spotify|GET_ARTISTS_SUCCESS",
        payload: artists
    };
}

////////////////////////////////////////////////////
//
//
// DISCOVER
//
//
////////////////////////////////////////////////////
export function setDiscover(newNode) {
    return {
        type: "discover|SET_DISCOVER",
        payload: newNode
    };
}

export function toggleNode(nodeId) {
    return {
        type: "discover|TOGGLE_NODE",
        payload: nodeId
    };
}

export function nodeFetched(nodeId) {
    return {
        type: "discover|NODE_FETCHED",
        payload: nodeId
    };
}

export function updateNodeUri(newNode) {
    return {
        type: "discover|UPDATE_NODE_URI",
        payload: newNode
    };
}

export function createNodes(parentId, nodes) {
    return {
        type: "discover|CREATE_NODES",
        payload: { parentId, nodes }
    };
}

export function skipToNextStart() {
    return {
        type: "SKIP_TO_NEXT_START"
    };
}

export function skipToNextSuccess() {
    return {
        type: "SKIP_TO_NEXT_SUCCESS"
    };
}

export function skipToPreviousStart() {
    return {
        type: "SKIP_TO_PREVIOUS_START"
    };
}

export function skipToPreviousSuccess() {
    return {
        type: "SKIP_TO_PREVIOUS_SUCCESS"
    };
}

export function seekStart(distance) {
    return {
        type: "spotify|SEEK_START",
        payload: distance
    };
}

export function seekSuccess() {
    return {
        type: "spotify|SEEK_SUCCESS"
    };
}

export function getNewReleasesStart() {
    return {
        type: "spotify|GET_NEW_RELEASES_START"
    };
}

export function getNewReleasesSuccess(newReleases) {
    return {
        type: "spotify|GET_NEW_RELEASES_SUCCESS",
        payload: newReleases
    };
}

export function getAlbumsStart(albumIds) {
    return {
        type: "spotify|GET_ALBUMS_START",
        payload: albumIds
    };
}
export function getAlbumsSuccess(albums) {
    return {
        type: "spotify|GET_ALBUMS_SUCCESS",
        payload: albums
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

export function setLocalStorage(key, data, expiration) {
    return {
        type: "localStorage|SET_DATA",
        payload: { key, data, expiration }
    };
}

export function addGenreColors(genreColors, setActive) {
    return {
        type: "genreColors|ADD_GENRES_WITH_COLOR",
        payload: { genreColors, setActive }
    };
}

export function removeGenreColors(genres) {
    return {
        type: "genreColors|REMOVE_GENRE_COLOR",
        payload: genres
    };
}

export function toggleNewReleaseAlbum(albumId) {
    return {
        type: "newReleases|TOGGLE_NEW_RELEASE_ALBUM",
        payload: albumId
    };
}

export function toggleNewReleaseSong(songId) {
    return {
        type: "newReleases|TOGGLE_NEW_RELEASE_SONG",
        payload: songId
    };
}

export function toggleNewReleaseColors() {
    return {
        type: "newReleases|TOGGLE_NEW_RELEASE_COLORS"
    };
}

export function hideAllNewReleaseTracks() {
    return {
        type: "newReleases|HIDE_ALL_NEW_RELEASE_TRACKS"
    };
}

export function showAllNewReleaseTracks() {
    return {
        type: "newReleases_SHOW_ALL_NEW_RELEASE_TRACKS"
    };
}

export function openNewReleaseModal() {
    return {
        type: "newReleases|OPEN_NEW_RELEASE_MODAL"
    };
}

export function closeNewReleaseModal() {
    return {
        type: "newReleases|CLOSE_NEW_RELEASE_MODAL"
    };
}

export function setNewReleaseModalColor(color) {
    return {
        type: "newReleases|SET_NEW_RELEASE_MODAL_COLOR",
        payload: color
    };
}

export function setNewReleaseModalGenre(genre) {
    return {
        type: "newReleases|SET_NEW_RELEASE_MODAL_GENRE",
        payload: genre
    };
}

export function addTagToQuery(tag) {
    return {
        type: "queryParams|ADD_TAG_TO_QUERY",
        payload: tag
    };
}

export function removeTagFromQuery(tag) {
    return {
        type: "queryParams|REMOVE_TAG_FROM_QUERY",
        payload: tag
    };
}

export function toggleTagFromQuery(tag) {
    return {
        type: "queryParams|TOGGLE_TAG_FROM_QUERY",
        payload: tag
    };
}

export function reorderQueryTags(oldIndex, newIndex) {
    return {
        type: "queryParams|REORDER_TAGS_FROM_QUERY",
        payload: { oldIndex, newIndex }
    };
}

export function reorderTags(oldIndex, newIndex) {
    return {
        type: "REORDER_TAGS",
        payload: { oldIndex, newIndex }
    };
}

export function showErrorModal() {
    return {
        type: "error|SHOW_ERROR_MODAL"
    };
}

export function hideErrorModal() {
    return {
        type: "error|HIDE_ERROR_MODAL"
    };
}

export function setErrorMessage(message) {
    return {
        type: "error|SET_ERROR_MESSAGE",
        payload: message
    };
}

export function getDevicesStart() {
    return {
        type: "spotify|GET_DEVICES_START"
    };
}

export function getDevicesSuccess(devices) {
    return {
        type: "spotify|GET_DEVICES_SUCCESS",
        payload: devices
    };
}

export function transferPlaybackStart(device) {
    return {
        type: "spotify|TRANSFER_PLAYBACK_START",
        payload: device
    };
}

export function transferPlaybackSuccess() {
    return {
        type: "spotify|TRANSFER_PLAYBACK_SUCCESS"
    };
}

export function addToMySavedTracksStart(ids) {
    return {
        type: "spotify|ADD_TO_MY_SAVED_TRACKS_START",
        payload: ids
    };
}

export function addToMySavedTracksSuccess(ids) {
    return {
        type: "spotify|ADD_TO_MY_SAVED_TRACKS_SUCCESS"
    };
}

export function getRelatedTracksStart(id) {
    return {
        type: "spotify|GET_RELATED_TRACKS_START",
        payload: id
    };
}

export function getRelatedTracksSuccess(relatedTracks) {
    return {
        type: "spotify|GET_RELATED_TRACKS_SUCCESS",
        payload: relatedTracks
    };
}

export function toggleSort(sortColumn) {
    return {
        type: "TOGGLE_SORT_COLUMN",
        payload: sortColumn
    };
}

export function getPlaylistStart(playlistId) {
    return {
        type: "spotify|GET_PLAYLIST_START",
        payload: playlistId
    };
}

export function getPlaylistSuccess(playlist) {
    return {
        type: "spotify|GET_PLAYLIST_SUCCESS",
        payload: playlist
    };
}
