import React, { Component } from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import Search from './Search';
import _, { get } from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';

import { playlistTracksSelector } from '../selectors';

import { playSongStart, initializeOnPlaylist } from '../redux/actions';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    searchButton: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        zIndex: theme.zIndex.modal + 1,
    },
    drawerPaper: {
        width: '90%'
    }
});

class Spotify extends Component {

    state = {
        searchPanelIsOpen: false
    }

    searchInputRef = React.createRef()

    toggleDrawer = () => (
        this.setState({
            searchPanelIsOpen: !this.state.searchPanelIsOpen
        })
    )

    closeDrawer = () => (
        this.setState({
            searchPanelIsOpen: false
        })
    )
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
                    <Search searchInputRef={this.searchInputRef}/>
                </Drawer>
                <List>
                    {
                        _.map(
                            this.props.playlistTracks,
                            (track, idx) => (
                                <ListItem
                                    button
                                    onClick={() => this.props.playSongStart(_.get(track, 'track.uri'))}
                                    key={idx}
                                >
                                    <ListItemText
                                        primary={_.get(track, 'track.name')}
                                        secondary={ _.join(
                                            _.map(
                                                _.get(track, 'track.artists'),
                                                artist => _.get(artist, 'name')
                                            ),
                                            ', '
                                        )}
                                    />
                                </ListItem>
                            )
                        )
                    }
                </List>
                <Button
                    className={this.props.classes.searchButton}
                    variant="fab"
                    color="secondary"
                    onClick={this.toggleDrawer}
                >
                    {this.state.searchPanelIsOpen ? <CloseIcon/> : <SearchIcon/>}
                </Button>
            </div>
        )
    }
}

export default compose(
    withStyles(styles),
    connect(
        createStructuredSelector({
            playlistTracks: playlistTracksSelector
        }),
        { playSongStart, initializeOnPlaylist }
    )
)
(Spotify);
