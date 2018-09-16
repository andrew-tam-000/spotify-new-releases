import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import Routes from "./components/Routes";
import store from "./redux";
import { getAccessTokenFromUrl } from "./utils";
import history from "./history";

if (!getAccessTokenFromUrl(window)) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
  );
  registerServiceWorker();
}
