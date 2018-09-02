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
import { searchAsync, setSearchText, addTracksToPlaylistAsync  } from '../redux/actions';
import { searchTracksSelector, searchTextSelector } from '../selectors';

import spotifyApi from '../spotifyApi';



const Search = ({searchTracks, searchText, setSearchText, searchAsync, addTracksToPlaylistAsync }) => {
    return (
        <div>
            <TextField
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
            />
            <Button
                onClick={searchAsync}
                variant="contained"
                color="primary"
            >
                Submit
            </Button>
            <List>
                {
                    _.map(
                        searchTracks,
                        track => (
                            <ListItem button onClick={() => addTracksToPlaylistAsync([track.uri])}>
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
    { setSearchText, searchAsync, addTracksToPlaylistAsync }
)(Search);
