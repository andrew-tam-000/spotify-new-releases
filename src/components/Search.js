import React, { Component } from "react";
import styled from "styled-components";
import { createStructuredSelector } from "reselect";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";

import { connect } from "react-redux";
import { setSearchText, addTracksToPlaylistStart } from "../redux/actions";
import { searchTracksSelector, searchTextSelector } from "../selectors";
import { withStyles } from "@material-ui/core/styles";
import PlayButton from "./Analyzer/PlayButton";
import AddToAdvancedSearchButton from "./Analyzer/AddToAdvancedSearchButton";

import spotifyApi from "../spotifyApi";

const StyledSearch = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const SearchTextField = withStyles({
    root: {
        padding: "10px",
        display: "block"
    }
})(TextField);

const SearchResultsList = withStyles({
    root: {
        overflow: "auto"
    }
})(List);

const Search = ({
    searchTracks,
    searchText,
    setSearchText,
    addTracksToPlaylistStart,
    ...props
}) => {
    return (
        <StyledSearch {...props}>
            <SearchTextField value={searchText} onChange={e => setSearchText(e.target.value)} />
            <SearchResultsList>
                {_.map(searchTracks, track => (
                    <ListItem
                        key={track.id}
                        button
                        onClick={() => addTracksToPlaylistStart([track.uri])}
                    >
                        <PlayButton uri={track.uri} />
                        <AddToAdvancedSearchButton uri={track.uri} />
                        <ListItemText
                            primary={track.name}
                            secondary={track.artists.map(artist => artist.name).join(", ")}
                        />
                    </ListItem>
                ))}
            </SearchResultsList>
        </StyledSearch>
    );
};

export default connect(
    createStructuredSelector({
        searchTracks: searchTracksSelector,
        searchText: searchTextSelector
    }),
    { setSearchText, addTracksToPlaylistStart }
)(Search);
