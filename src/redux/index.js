import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import logger from 'redux-logger';
import rootEpic from '../epics';
import history from '../history';
import {
    routerReducer,
    routerMiddleware,
} from "react-router-redux";
import firebaseApp from '../firebase';

const epicMiddleware = createEpicMiddleware({
    dependencies: {
        firebaseApp,
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
        logger
    )
);

epicMiddleware.run(rootEpic);

window.store = store;

export default store;
