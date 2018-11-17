import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";
import rootEpic from "../epics";
import history from "../history";
import { routerMiddleware } from "react-router-redux";
import firebaseApp from "../firebase";
import spotifyApi, { basicSpotifyApi } from "../spotifyApi";
import initialState from "./state";

const epicMiddleware = createEpicMiddleware({
    dependencies: {
        firebaseApp,
        spotifyApi,
        basicSpotifyApi
    }
});

const store = createStore(
    rootReducer,
    initialState,
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
