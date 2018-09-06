import _ from 'lodash';
import initialState from '../state';

export default (state = initialState, { type, payload }) => {
    if (type == 'SET_ACCESS_TOKEN_SUCCESS') {
        return {
            ...state,
            firebase: {
                ...state.firebase,
                token: payload,
            }
        };
    }
    else if (type == 'SET_SPOTIFY_USER') {
        return {
            ...state,
            spotifyUser: payload
        };
    }
    else if (type == 'SET_FIREBASE_USER') {
        return {
            ...state,
            firebase: payload,
        }
    }
    else if (type == 'UPDATE_FIREBASE_USER') {
        return {
            ...state,
            firebase: {
                ...state.firebase,
                ...payload,
            }
        }
    }
    else if (type == 'SET_FIREBASE_USER_ID_SUCCESS') {
        return {
            ...state,
            firebase: {
                ...state.firebase,
                id: payload
            }
        }
    }
    else if (type == 'SET_PLAYLIST_SUCCESS') {
        return {
            ...state,
            playlist: payload
        };
    }
    else if (type == 'SET_SEARCH_RESULTS') {
        return {
            ...state,
            search: {
                ...state.search,
                ...payload,
            }
        };
    }
    else if (type == 'SET_SEARCH_TEXT') {
        return {
            ...state,
            search: {
                ...state.search,
                text: payload
            }
        };
    }
    else {
        return state;
    }
}
