import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
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
import SearchIcon from "@material-ui/icons/Search";
import Search from "./Search";
import _Drawer from "@material-ui/core/Drawer";
import { searchOpenPanel, searchClosePanel } from "../redux/actions";
import { searchPanelSelector } from "../selectors";
import { createStructuredSelector } from "reselect";

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

const Drawer = withStyles({
    paper: {
        width: "480px"
    }
})(_Drawer);

class RouteProvider extends Component {
    handleChange = (e, val) => {
        if (val === 2) {
            this.props.searchOpenPanel();
        }
    };

    render() {
        const { searchPanel, searchClosePanel } = this.props;
        return (
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
                    <Drawer anchor="right" open={searchPanel} onClose={searchClosePanel}>
                        <Search />
                    </Drawer>
                    <BottomNavigation value="Recents" onChange={this.handleChange} showLabels>
                        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
                    </BottomNavigation>
                </AppWrapper>
            </Router>
        );
    }
}

export default connect(
    createStructuredSelector({
        searchPanel: searchPanelSelector
    }),
    { searchOpenPanel, searchClosePanel }
)(RouteProvider);
