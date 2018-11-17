import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import registerServiceWorker from "./registerServiceWorker";
import Routes from "./components/Routes";
import store from "./redux";
import { getAccessTokenFromUrl } from "./utils";
import history from "./history";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import FastClick from "fastclick";
FastClick.attach(document.body);

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

if (!getAccessTokenFromUrl(window)) {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        </MuiThemeProvider>,
        document.getElementById("root")
    );
    registerServiceWorker();
}
