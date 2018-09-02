import _ from 'lodash';
import initialState from '../state';

export default (state = initialState, { type, payload }) => {
    if (type == 'SET_ACCESS_TOKEN') {
        return {
            ...state,
            accessToken: payload
        };
    }
    else if (type == 'SET_USER') {
        return {
            ...state,
            user: payload
        };
    }
    else if (type == 'SET_PLAYLIST') {
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
