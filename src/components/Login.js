import React, { Component } from "react";
import { join } from "lodash";
import Button from "@material-ui/core/Button";
import { getAccessTokenFromUrl, getKeyFromLocalStorage, setKeyInLocalStorage } from "../utils";
import { connect } from "react-redux";
import { createAccessTokenSuccess, updateFirebaseUserStart } from "../redux/actions";

const scopes = [
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-library-read"
    //"user-read-recently-played",
    //"user-top-read",
    //"playlist-read-private",
    //"playlist-read-collaborative",
    //"playlist-modify-public",
    //"playlist-modify-private"
];

const tokenUrl = `https://accounts.spotify.com/authorize?show_dialog=false&client_id=27135c7bda1c48f3ba0f6be1161b0561&redirect_uri=${
    window.location.protocol
}//${window.location.host}&response_type=token&show_dialog=true&scope=${join(scopes, " ")}`;

class Login extends Component {
    state = {
        tokenWindow: null,
        setIntervalId: null
    };

    openLogin = () => {
        if (this.state.tokenWindow || this.state.setInteralId) {
            return;
        }

        const tokenWindow = window.open(tokenUrl);
        const setIntervalId = setInterval(() => {
            try {
                const accessToken = getAccessTokenFromUrl(tokenWindow);
                if (accessToken) {
                    tokenWindow.close();
                    clearInterval(this.state.setIntervalId);
                    // TODO: this should be a sideeffect
                    // setKeyInLocalStorage("accessToken", accessToken);
                    this.props.createAccessTokenSuccess(accessToken);
                    this.setState({ tokenWindow: null, setIntervalId: null });
                }
            } catch (e) {
                console.warn(e);
            }
        }, 400);

        this.setState({
            window: tokenWindow,
            setIntervalId: setIntervalId
        });
    };

    render() {
        return (
            <Button onClick={this.openLogin} variant="contained">
                Login
            </Button>
        );
    }
}

export default connect(
    null,
    { createAccessTokenSuccess }
)(Login);
