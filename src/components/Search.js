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
    searchPlaylistsSelector,
    searchTracksSelector,
    searchAlbumsSelector,
    searchArtistsSelector,
    searchTextSelector
} from "../selectors";
import { searchTableDataSelector } from "../selectors/tables";
import { withStyles } from "@material-ui/core/styles";
import PlayButton from "./Analyzer/PlayButton";
import AddToAdvancedSearchButton from "./Analyzer/AddToAdvancedSearchButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import TableWithTags from "./Table/TableWithTags";

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

const SearchResultsList = styled.div`
    flex: 1;
`;

class Search extends Component {
    state = {
        active: 0
    };

    handleChange = (e, val) => this.setState({ active: val });

    render() {
        const {
            searchText,
            setSearchText,
            addTracksToPlaylistStart,
            searchTableData,
            ...props
        } = this.props;
        const { searchPlaylists, searchTracks, searchArtists, searchAlbums } = searchTableData;
        const tableData =
            this.state.active === 0
                ? searchTracks
                : this.state.active === 1
                    ? searchArtists
                    : this.state.active === 2
                        ? searchAlbums
                        : searchPlaylists;

        return (
            <StyledSearch {...props}>
                <SearchTextField value={searchText} onChange={e => setSearchText(e.target.value)} />
                <Tabs textColor="active" value={this.state.active} onChange={this.handleChange}>
                    <Tab label="Tracks" />
                    <Tab label="Artists" />
                    <Tab label="Albums" />
                    <Tab label="Playlists" />
                </Tabs>
                <SearchResultsList>
                    <TableWithTags tableData={tableData} />
                </SearchResultsList>
            </StyledSearch>
        );
    }
}

export default connect(
    createStructuredSelector({
        searchPlaylists: searchPlaylistsSelector,
        searchTracks: searchTracksSelector,
        searchAlbums: searchAlbumsSelector,
        searchArtists: searchArtistsSelector,
        searchText: searchTextSelector,
        searchTableData: searchTableDataSelector
    }),
    { setSearchText, addTracksToPlaylistStart }
)(Search);
