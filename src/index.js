import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import Routes from './components/Routes';
import { Provider } from 'react-redux';
import store from './redux';
import { getAccessTokenFromUrl } from './utils';
import { ConnectedRouter } from "react-router-redux";
import history from './history';

if (!getAccessTokenFromUrl(window)) {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Routes/>
            </ConnectedRouter>
        </Provider>
    , document.getElementById('root'));
    registerServiceWorker();
}
