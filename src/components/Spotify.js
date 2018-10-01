import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { mapProps } from "recompose";
import Search from "./Search";
import { map, get, join, split, last } from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";

import { playlistSelector, playStatusSelector, songWithDataByIdSelector } from "../selectors";

import { playSongStart, initializeOnPlaylist } from "../redux/actions";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import PlayButton from "./Analyzer/PlayButton";

import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";

const styles = theme => ({
    searchButton: {
        position: "absolute",
        bottom: "10px",
        right: "10px",
        zIndex: theme.zIndex.modal + 1
    },
    drawerPaper: {
        width: "90%"
    }
});

class Spotify extends Component {
    state = {
        searchPanelIsOpen: false
    };

    toggleDrawer = () =>
        this.setState({
            searchPanelIsOpen: !this.state.searchPanelIsOpen
        });

    closeDrawer = () =>
        this.setState({
            searchPanelIsOpen: false
        });
    componentDidMount() {
        this.props.initializeOnPlaylist(this.props.match.params.id);
    }

    render() {
        const { playlist, playStatus } = this.props;
        return (
            <div>
                <Drawer
                    anchor="right"
                    open={this.state.searchPanelIsOpen}
                    onClose={this.closeDrawer}
                    classes={{
                        paper: this.props.classes.drawerPaper
                    }}
                >
                    <Search />
                </Drawer>
                <List>
                    {map(playlist, (track, idx) => (
                        <ListItem button key={idx}>
                            {get(track, "uri") === playStatus ? (
                                <PauseCircleOutlineIcon color="secondary" />
                            ) : (
                                <PlayButton uri={get(track, "songDetails.uri")} />
                            )}
                            <ListItemText
                                primary={get(track, "songDetails.name")}
                                secondary={join(
                                    map(get(track, "songDetails.artists"), artist =>
                                        get(artist, "name")
                                    ),
                                    ", "
                                )}
                            />
                        </ListItem>
                    ))}
                </List>
                <Button
                    className={this.props.classes.searchButton}
                    variant="fab"
                    color="secondary"
                    onClick={this.toggleDrawer}
                >
                    {this.state.searchPanelIsOpen ? <CloseIcon /> : <SearchIcon />}
                </Button>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connect(
        createStructuredSelector({
            songWithDataById: songWithDataByIdSelector,
            playlist: playlistSelector,
            playStatus: playStatusSelector
        }),
        { playSongStart, initializeOnPlaylist }
    ),
    mapProps(({ songWithDataById, playlist, ...props }) => ({
        ...props,
        playlist: map(playlist, uri => songWithDataById(last(split(uri, ":"))))
    }))
)(Spotify);
