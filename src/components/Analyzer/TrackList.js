import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { get, map } from "lodash";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import styled from "styled-components";
import { advancedSearchTracksSelector, librarySongsWithDataSelector } from "../../selectors";
import _DeleteButton from "./DeleteButton";
import PopulateButton from "./PopulateButton";
const DeleteButton = styled(_DeleteButton)`
    margin-left: 10px !important;
`;

const SmallListItemText = styled(ListItemText)`
    flex: none !important;
`;

const TrackList = ({ advancedSearchTracks, librarySongsWithData }) => (
    <List>
        {map(advancedSearchTracks, (id, index) => (
            <ListItem key={index}>
                <DeleteButton index={index} />
                <PopulateButton songData={librarySongsWithData[id]} />
                <SmallListItemText
                    primary={get(librarySongsWithData[id], "songDetails.track.name")}
                    secondary={get(librarySongsWithData[id], "songDetails.track.artists.0.name")}
                />
            </ListItem>
        ))}
    </List>
);

export default connect(
    createStructuredSelector({
        librarySongsWithData: librarySongsWithDataSelector,
        advancedSearchTracks: advancedSearchTracksSelector
    })
)(TrackList);
