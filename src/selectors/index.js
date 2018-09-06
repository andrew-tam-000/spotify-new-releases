import _ from 'lodash';
import { createSelector } from 'reselect';

export const accessTokenSelector = createSelector(
    state => _.get(state, 'app.firebase.token'),
    accessToken => accessToken
);

export const spotifyPlaylistIdSelector = createSelector(
    state => _.get(state, 'app.playlist.id'),
    playlistId => playlistId
);

export const firebaseUserIdSelector = createSelector(
    state => _.get(state, 'app.firebase.id'),
    userId => userId
)

export const searchTracksSelector = createSelector(
    state => _.get(state, 'app.search.tracks.items') || [],
    tracks => tracks
);

export const searchTextSelector = createSelector(
    state => _.get(state, 'app.search.text') || '',
    text => text
);

export const playlistIdSelector = createSelector(
    state => _.get(state, 'app.playlist.id') || '',
    playlistId => playlistId
)

export const playlistTracksSelector = createSelector(
    state => _.get(state, 'app.playlist.tracks.items') || [],
    tracks => tracks
);

export const playlistUriSelector = createSelector(
    state => _.get(state, 'app.playlist.uri') || '',
    playlistId => playlistId
)

export const spotifyUserIdSelector = createSelector(
    state => _.get(state, 'app.spotifyUser.id') || '',
    spotifyUserId => spotifyUserId
)

