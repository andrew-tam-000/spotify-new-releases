import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import rootEpic from '../epics';
import history from '../history';
import {
    routerReducer,
    routerMiddleware,
} from "react-router-redux";
import firebaseApp from '../firebase';
import spotifyApi from '../spotifyApi';

const epicMiddleware = createEpicMiddleware({
    dependencies: {
        firebaseApp,
        spotifyApi,
    }
});

const store = createStore(
    combineReducers({
        app: rootReducer,
        router: routerReducer,
    }),
    applyMiddleware(
        thunk,
        epicMiddleware,
        routerMiddleware(history),
        createLogger({ collapsed: true })
    )
);

epicMiddleware.run(rootEpic);

window.store = store;

export default store;
