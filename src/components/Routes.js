import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Spotify from "./Spotify";
import Analyzer from "./Analyzer";
import App from "./App";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";

const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`;

const Scrollable = styled.div`
    overflow: auto;
    flex: 1;
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
            <Scrollable>
                <Route exact path="/analyzer" component={Analyzer} />
                <Route exact path="/:id([\d-]*)" component={Spotify} />
                <Route exact path="/" component={App} />
            </Scrollable>
            <BottomNavigation>
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            </BottomNavigation>
        </AppWrapper>
    </Router>
);

export default RouteProvider;
