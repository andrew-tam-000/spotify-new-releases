import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import createHashHistory from "history/createHashHistory";
import styled from "styled-components";
import _AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Spotify from "./Spotify";
import Analyzer from "./Analyzer";
import App from "./App";
import SongDetails from "./SongDetails";
import Discover from "./Discover";
import Sidebar from "./Sidebar";
import AlbumList from "./NewReleases/AlbumList";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import SearchIcon from "@material-ui/icons/Search";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import PlayDash from "./PlayDash";
import Search from "./Search";
import NewReleases from "./NewReleases";
import NewReleasesAlbumsTable from "./NewReleases/NewReleasesAlbumsTable";
import _Drawer from "@material-ui/core/Drawer";
import {
    searchOpenPanel,
    searchClosePanel,
    analyzerOpenSearchPanel,
    initializeAppStart
} from "../redux/actions";
import { searchPanelSelector } from "../selectors";
import { createStructuredSelector } from "reselect";

const history = createHashHistory();

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

const MainContent = styled.div`
    display: flex;
    flex: 1;
`;

const AppBar = styled(_AppBar)`
    display: flex;
    flex-direction: row !important;
    justify-content: space-between;
    align-items: center;
`;

class RouteProvider extends Component {
    handleChange = (e, val) => {
        if (val === 0) {
            history.push({ pathname: "/analyzer", search: history.location.search });
        }
        if (val === 1) {
            history.push({ pathname: "/new-releases", search: history.location.search });
        }
        if (val === 2) {
            this.props.searchOpenPanel();
        }
        /*
        if (val === 3) {
            history.push("/discover");
                                <Route exact path="/discover" component={Discover} />
                        <BottomNavigationAction label="Discover" icon={<NewReleasesIcon />} />
                        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        }
        */
    };

    componentDidMount() {
        this.props.initializeAppStart();
    }

    render() {
        const { searchPanel, searchClosePanel } = this.props;
        //<SongDetails />
        return (
            <Router history={history}>
                <AppWrapper>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit">
                                Music
                            </Typography>
                        </Toolbar>
                        <PlayDash />
                    </AppBar>
                    <MainContent>
                        <Scrollable>
                            <Switch>
                                <Route
                                    exact
                                    path="/new-releases"
                                    component={NewReleasesAlbumsTable}
                                />
                                <Route exact path="/analyzer" component={Analyzer} />
                                <Route exact path="/" component={NewReleasesAlbumsTable} />
                            </Switch>
                        </Scrollable>
                        <Drawer anchor="right" open={searchPanel} onClose={searchClosePanel}>
                            <Search />
                        </Drawer>
                        <Sidebar>
                            <AlbumList />
                        </Sidebar>
                    </MainContent>
                    <BottomNavigation value="0" onChange={this.handleChange} showLabels>
                        <BottomNavigationAction label="Library" icon={<LibraryMusicIcon />} />
                        <BottomNavigationAction label="New Releases" icon={<NewReleasesIcon />} />
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
    { initializeAppStart, searchOpenPanel, searchClosePanel, analyzerOpenSearchPanel }
)(RouteProvider);
