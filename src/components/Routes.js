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
import NewReleasesTracksTable from "./NewReleases/NewReleasesTracksTable";
import NewReleasesAlbumsTable from "./NewReleases/NewReleasesAlbumsTable";
import _Drawer from "@material-ui/core/Drawer";
import { searchOpenPanel, searchClosePanel, analyzerOpenSearchPanel } from "../redux/actions";
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
            history.push("/analyzer");
        }
        if (val === 1) {
            history.push("/123");
        }
        if (val === 2) {
            history.push("/discover");
        }
        if (val === 3) {
            history.push("/new-releases");
        }
        if (val === 4) {
            this.props.analyzerOpenSearchPanel();
        }
        if (val === 5) {
            this.props.searchOpenPanel();
        }
    };

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
                                <Route
                                    exact
                                    path="/new-releases/albums"
                                    component={NewReleasesAlbumsTable}
                                />
                                <Route
                                    exact
                                    path="/new-releases/tracks"
                                    component={NewReleasesTracksTable}
                                />
                                <Route exact path="/discover" component={Discover} />
                                <Route exact path="/analyzer" component={Analyzer} />
                                <Route exact path="/:id([\d-]*)" component={Spotify} />
                                <Route exact path="/" component={App} />
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
                        <BottomNavigationAction label="Playlist" icon={<QueueMusicIcon />} />
                        <BottomNavigationAction label="Discover" icon={<NewReleasesIcon />} />
                        <BottomNavigationAction label="New Releases" icon={<NewReleasesIcon />} />
                        <BottomNavigationAction label="SimilarSongs" icon={<ImageSearchIcon />} />
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
    { searchOpenPanel, searchClosePanel, analyzerOpenSearchPanel }
)(RouteProvider);
