import _ from 'lodash';
import { createSelector } from 'reselect';

export const searchTracksSelector = createSelector(
    state => _.get(state, 'search.tracks.items') || [],
    tracks => tracks
);

export const searchTextSelector = createSelector(
    state => _.get(state, 'search.text') || '',
    text => text
);

export const playlistIdSelector = createSelector(
    state => _.get(state, 'playlist.id') || '',
    playlistId => playlistId
)

export const playlistTracksSelector = createSelector(
    state => _.get(state, 'playlist.tracks.items') || [],
    tracks => tracks
);

export const playlistUriSelector = createSelector(
    state => _.get(state, 'playlist.uri') || '',
    playlistId => playlistId
)
