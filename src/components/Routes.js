import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import createHashHistory from "history/createHashHistory";
import styled from "styled-components";
import _AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Analyzer from "./Analyzer";
import Sidebar from "./Sidebar";
import AlbumList from "./NewReleases/AlbumList";
import NowPlaying from "./NowPlaying";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
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
import { analyzerOpenSearchPanel, initializeAppStart } from "../redux/actions";
import { searchPanelSelector } from "../selectors";
import { createStructuredSelector } from "reselect";

const history = createHashHistory();

const AppWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Scrollable = styled.div`
    overflow: auto;
    position: absolute;
    width: 100%;
    height: 100%;
`;

const Drawer = withStyles({
    paper: {
        width: "480px"
    }
})(_Drawer);

const MainContent = styled.div`
    display: flex;
    flex: 1;
    position: relative;
`;

const AppBar = styled(_AppBar)`
    display: flex;
    flex-direction: row !important;
    justify-content: space-between;
    align-items: center;
`;

class RouteProvider extends Component {
    state = {
        value: null
    };
    handleChange = (e, val) => {
        this.setState({
            value: val
        });
        if (val === 0) {
            history.push({ pathname: "/analyzer", search: history.location.search });
        }
        if (val === 1) {
            history.push({ pathname: "/new-releases", search: history.location.search });
        }
        if (val === 2) {
            history.push({ pathname: "/now-playing", search: history.location.search });
        }
        if (val === 3) {
            history.push({ pathname: "/search", search: history.location.search });
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
        const { searchPanel } = this.props;
        //<SongDetails />
        return (
            <Router history={history}>
                <AppWrapper>
                    <AppBar position="static" color="default">
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
                                <Route exact path="/search" component={Search} />
                                <Route exact path="/analyzer" component={Analyzer} />
                                <Route exact path="/now-playing" component={NowPlaying} />
                                <Route exact path="/" component={NewReleasesAlbumsTable} />
                            </Switch>
                        </Scrollable>
                        <Sidebar>
                            <AlbumList />
                        </Sidebar>
                    </MainContent>
                    <BottomNavigation
                        value={this.state.value}
                        onChange={this.handleChange}
                        showLabels
                    >
                        <BottomNavigationAction label="Library" icon={<LibraryMusicIcon />} />
                        <BottomNavigationAction label="New Releases" icon={<NewReleasesIcon />} />
                        <BottomNavigationAction label="Now Playing" icon={<PlayArrowIcon />} />
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
    { initializeAppStart, analyzerOpenSearchPanel }
)(RouteProvider);
