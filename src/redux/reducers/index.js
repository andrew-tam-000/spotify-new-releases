import _ from 'lodash';
import initialState from '../state';

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'SET_ACCESS_TOKEN_SUCCESS':
            return {
                ...state,
                firebase: {
                    ...state.firebase,
                    token: payload,
                }
            };
        case 'SET_SPOTIFY_USER_SUCCESS':
            return {
                ...state,
                spotifyUser: payload
            };
        case 'STORE_FIREBASE_USER_SUCCESS':
        case 'SET_FIREBASE_USER_SUCCESS':
            return {
                ...state,
                firebase: payload,
            }
        case 'UPDATE_FIREBASE_USER':
            return {
                ...state,
                firebase: {
                    ...state.firebase,
                    ...payload,
                }
            }
        case 'REFRESH_PLAYLIST_SUCCESS':
        case 'CREATE_PLAYLIST_SUCCESS':
            return {
                ...state,
                playlist: payload
            };
        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                search: {
                    ...state.search,
                    ...payload,
                }
            };
        case 'SET_SEARCH_TEXT':
            return {
                ...state,
                search: {
                    ...state.search,
                    text: payload
                }
            };
        default:
            return state;
    }
}
