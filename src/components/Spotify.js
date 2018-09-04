import React, { Component } from 'react';
import spotifyApi from '../spotifyApi';
import Search from './Search';
import _, { get } from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { playlistTracksSelector } from '../selectors';

import { play, fetchUserData } from '../redux/actions';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


class Spotify extends Component {
    componentDidMount() {
        this.props.fetchUserData(get(this.props, 'match.params.id'))
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
    { play, fetchUserData }
)(Spotify);
