import React, { Component } from 'react';
import spotifyApi from '../spotifyApi';
import Search from './Search';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { playlistTracksSelector } from '../selectors';

import { play } from '../redux/actions';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

class Spotify extends Component {
    state = {
        playlistId: null,
        playlist: {},
    }

    componentDidMount() {
        if (!spotifyApi.getAccessToken()) {
            //this.props.history.push('/');
        }
        /*
        window.addEventListener("beforeunload", function(e){
            alert('CLOSING');
            spotifyApi.unfollowPlaylist(playlist.id);
            return;
        });
        */
    }

    render() {
        return (
            <div>
                <List>
                    {
                        _.map(
                            this.props.playlistTracks,
                            (track, idx) => (
                                <ListItem
                                    button
                                    onClick={() => this.props.play(_.get(track, 'track.uri'))}
                                >
                                    <ListItemText
                                        primary={_.get(track, 'track.name')}
                                        secondary={ _.map(_.get(track, 'track.artists'), artist => _.get(artist, 'name')) }
                                    />
                                </ListItem>
                            )
                        )
                    }
                </List>
                <Search/>
            </div>
        )
    }
}

export default connect(
    createStructuredSelector({
        playlistTracks: playlistTracksSelector
    }),
    { play }
)(Spotify);
