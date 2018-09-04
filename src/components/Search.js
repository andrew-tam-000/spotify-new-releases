import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';

import { connect } from 'react-redux';
import { setSearchText, addTracksToPlaylist } from '../redux/actions';
import { searchTracksSelector, searchTextSelector } from '../selectors';

import spotifyApi from '../spotifyApi';

const Search = ({searchTracks, searchText, setSearchText, addTracksToPlaylist }) => {
    return (
        <div>
            <TextField
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
            />
            <List>
                {
                    _.map(
                        searchTracks,
                        track => (
                            <ListItem key={track.id} button onClick={() => addTracksToPlaylist([track.uri])}>
                                <ListItemText primary={track.name} secondary={track.artists.map(artist => artist.name).join(', ')}/>
                            </ListItem>
                        )
                    )
                }
            </List>
        </div>
    )
}

export default connect(
    createStructuredSelector({
        searchTracks: searchTracksSelector,
        searchText: searchTextSelector,
    }),
    { setSearchText, addTracksToPlaylist }
)(Search);
