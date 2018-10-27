import React from "react";
import { compose, withProps } from "recompose";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { get, last, map, split } from "lodash";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import styled from "styled-components";
import PlayButton from "../Analyzer/PlayButton";
import { tracksForAlbumForIdSelector, showSideBarSelector } from "../../selectors";

const SmallListItemText = styled(ListItemText)`
    flex: 1 !important;
`;

const AlbumList = ({ tracksForAlbum: { album, hydratedTracks } }) => (
    <List>
        {map(hydratedTracks, ({ track, trackData }) => (
            <ListItem key={track.id}>
                <PlayButton uri={track.uri} />
                <SmallListItemText primary={track.name} secondary={get(track, "artists.0.name")} />
            </ListItem>
        ))}
    </List>
);
export default compose(
    connect(
        createStructuredSelector({
            tracksForAlbumForId: tracksForAlbumForIdSelector,
            showSideBar: showSideBarSelector
        })
    ),
    withProps(({ tracksForAlbumForId, showSideBar: { data } }) => ({
        tracksForAlbum: tracksForAlbumForId(last(split(data, ":")))
    }))
)(AlbumList);
