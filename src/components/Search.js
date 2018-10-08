import React, { Component } from "react";
import styled from "styled-components";
import { createStructuredSelector } from "reselect";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import ListItemText from "@material-ui/core/ListItemText";
import { map } from "lodash";
import Typography from "@material-ui/core/Typography";
import StartTreeButton from "./Discover/StartTreeButton";

import { connect } from "react-redux";
import { setSearchText, addTracksToPlaylistStart } from "../redux/actions";
import {
    searchTracksSelector,
    searchAlbumsSelector,
    searchArtistsSelector,
    searchTextSelector
} from "../selectors";
import { withStyles } from "@material-ui/core/styles";
import PlayButton from "./Analyzer/PlayButton";
import AddToAdvancedSearchButton from "./Analyzer/AddToAdvancedSearchButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

class Search extends Component {
    state = {
        active: 0
    };

    handleChange = (e, val) => this.setState({ active: val });

    render() {
        const {
            searchTracks,
            searchArtists,
            searchAlbums,
            searchText,
            setSearchText,
            addTracksToPlaylistStart,
            ...props
        } = this.props;

        return (
            <StyledSearch {...props}>
                <SearchTextField value={searchText} onChange={e => setSearchText(e.target.value)} />
                <Tabs value={this.state.active} onChange={this.handleChange}>
                    <Tab label="Tracks" />
                    <Tab label="Artists" />
                    <Tab label="Albums" />
                </Tabs>
                <SearchResultsList>
                    {this.state.active === 0 &&
                        map(searchTracks, track => (
                            <ListItem key={track.id} button>
                                <PlayButton uri={track.uri} />
                                <StartTreeButton uri={track.uri} />
                                <AddToAdvancedSearchButton id={track.id} />
                                <ListItemText
                                    primary={track.name}
                                    secondary={track.artists.map(artist => artist.name).join(", ")}
                                />
                            </ListItem>
                        ))}
                    {this.state.active === 1 &&
                        map(searchArtists, artist => (
                            <ListItem key={artist.id} button>
                                <PlayButton context_uri={artist.uri} />
                                <StartTreeButton uri={artist.uri} />
                                <ListItemText primary={artist.name} />
                            </ListItem>
                        ))}
                    {this.state.active === 2 &&
                        map(searchAlbums, track => (
                            <ListItem key={track.id} button>
                                <PlayButton context_uri={track.uri} />
                                <ListItemText
                                    primary={track.name}
                                    secondary={track.artists.map(artist => artist.name).join(", ")}
                                />
                            </ListItem>
                        ))}
                </SearchResultsList>
            </StyledSearch>
        );
    }
}

export default connect(
    createStructuredSelector({
        searchTracks: searchTracksSelector,
        searchAlbums: searchAlbumsSelector,
        searchArtists: searchArtistsSelector,
        searchText: searchTextSelector
    }),
    { setSearchText, addTracksToPlaylistStart }
)(Search);
