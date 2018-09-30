import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Search from "./Search";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";

import { playlistSelector, playStatusSelector } from "../selectors";

import { playSongStart, initializeOnPlaylist } from "../redux/actions";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";

import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
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
                    {_.map(this.props.playlist, (track, idx) => (
                        <ListItem
                            button
                            onClick={() => this.props.playSongStart(_.get(track, "track.uri"))}
                            key={idx}
                        >
                            {_.get(track, "track.uri") === this.props.playStatus ? (
                                <PauseCircleOutlineIcon color="secondary" />
                            ) : (
                                <PlayCircleOutlineIcon />
                            )}
                            <ListItemText
                                primary={_.get(track, "track.name")}
                                secondary={_.join(
                                    _.map(_.get(track, "track.artists"), artist =>
                                        _.get(artist, "name")
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
            playlist: playlistSelector,
            playStatus: playStatusSelector
        }),
        { playSongStart, initializeOnPlaylist }
    )
)(Spotify);
