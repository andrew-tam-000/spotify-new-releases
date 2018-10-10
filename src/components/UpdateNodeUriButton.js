import React from "react";
import { get, split, last } from "lodash";
import { connect } from "react-redux";
import UpdateIcon from "@material-ui/icons/Update";
import Button from "@material-ui/core/Button";
import { updateNodeUri, searchClosePanel } from "../redux/actions";
import { createStructuredSelector } from "reselect";
import { songsSelector, artistDataSelector } from "../selectors";
import { compose, mapProps } from "recompose";
import uuidv1 from "uuid/v1";

const UpdateNodeUriButton = ({ updateNodeUri }) => (
    <Button onClick={updateNodeUri} mini variant="fab" color="primary" aria-label="Add">
        <UpdateIcon />
    </Button>
);

export default compose(
    connect(
        createStructuredSelector({
            artistData: artistDataSelector,
            songs: songsSelector
        }),
        { updateNodeUri, searchClosePanel }
    ),
    mapProps(({ searchClosePanel, updateNodeUri, nodeId, uri, songs, artistData }) => {
        const id = last(split(uri, ":"));
        return {
            updateNodeUri: () =>
                updateNodeUri({
                    nodeId,
                    renderKey: uuidv1(),
                    uri,
                    name: get(songs, [id, "name"]) || get(artistData, [id, "name"])
                }) && searchClosePanel()
        };
    })
)(UpdateNodeUriButton);

// TODO: Create a node object
