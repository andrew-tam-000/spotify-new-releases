import React from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Spotify from './Spotify';
import App from './App';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import styled from 'styled-components';


const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const RouteProvider = props => (
    <Router>
        <AppWrapper>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        Music
                    </Typography>
                </Toolbar>
            </AppBar>
            <div>
                <Route path='/:id' component={Spotify}/>
                <Route exact path='/' component={App}/>
            </div>
        </AppWrapper>
    </Router>
);

export default RouteProvider;
