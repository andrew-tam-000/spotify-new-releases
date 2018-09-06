import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import { getAccessTokenFromUrl } from '../utils';
import _ from 'lodash';
import spotifyApi from '../spotifyApi';
import { connect } from 'react-redux';
import { setAccessTokenStart} from '../redux/actions';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
                </header>
                <button onClick={() => this.props.setAccessTokenStart()}>
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
    { setAccessTokenStart }
)(App);
