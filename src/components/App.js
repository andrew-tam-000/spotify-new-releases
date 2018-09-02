import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import { getAccessTokenFromUrl } from '../utils';
import _ from 'lodash';
import spotifyApi from '../spotifyApi';
import { connect } from 'react-redux';
import { fetchAccessToken } from '../redux/actions';

class App extends Component {
    constructor(props) {

        super(props);
        this.state = {
            isRequesting: false,
            token: null,
        }
    }

    requestToken = () => {
        this.props.fetchAccessToken();
        return;
        //if (this.state.isRequesting) return;

        ////this.setState({isRequesting: true});

        //const external = window.open(tokenUrl);
        //const interval = setInterval(
        //    () => {
        //        try {
        //            // If the window was closed
        //            if (!external.window) {
        //                clearInterval(interval);
        //                /*
        //                this.setState({
        //                    isRequesting: false
        //                })
        //                */
        //            }

        //            const hash = getAccessTokenFromUrl(external);
        //            if (hash) {
        //                clearInterval(interval);
        //                this.props.fetchAccessToken(hash);
        //                external.close();
        //            }
        //        }
        //        catch (e) {
        //            console.error(e);
        //        }
        //    },
        //    1000
        //);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
                </header>
                <button onClick={this.requestToken}>
                    RequestToken!
                </button>

                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default connect(
    null,
    { fetchAccessToken }
)(App);
