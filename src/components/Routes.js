import React from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Spotify from './Spotify';
import App from './App';

const RouteProvider = props => (
    <Router>
        <div>
            <Route path='/:id' component={Spotify}/>
            <Route exact path='/' component={App}/>
        </div>
    </Router>
);

export default RouteProvider;
