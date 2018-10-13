import React from "react";
import { merge, get, split, last } from "lodash";
import { connect } from "react-redux";
import UpdateIcon from "@material-ui/icons/Update";
import Button from "@material-ui/core/Button";
import { updateNodeUri, searchClosePanel } from "../redux/actions";
import { createStructuredSelector } from "reselect";
import {
    songsSelector,
    artistDataSelector,
    discoverNodesSelector,
    artistImageForTrackIdSelector,
    artistImageForArtistIdSelector
} from "../selectors";
import { compose, mapProps } from "recompose";
import uuidv1 from "uuid/v1";
import Node from "../Node";

const UpdateNodeUriButton = ({ updateNodeUri }) => (
    <Button onClick={updateNodeUri} mini variant="fab" color="primary" aria-label="Add">
        <UpdateIcon />
    </Button>
);

export default compose(
    connect(
        createStructuredSelector({
            artistData: artistDataSelector,
            songs: songsSelector,
            discoverNodes: discoverNodesSelector,
            artistImageForTrackId: artistImageForTrackIdSelector,
            artistImageForArtistId: artistImageForArtistIdSelector
        }),
        { updateNodeUri, searchClosePanel }
    ),
    mapProps(
        ({
            artistImageForTrackId,
            artistImageForArtistId,
            discoverNodes,
            searchClosePanel,
            updateNodeUri,
            nodeId,
            uri,
            songs,
            artistData
        }) => {
            const [, type, id] = split(uri, ":");
            return {
                updateNodeUri: () =>
                    updateNodeUri(
                        new Node(
                            merge({}, discoverNodes[nodeId].data, {
                                renderKey: uuidv1(),
                                uri,
                                fetched: false,
                                name:
                                    type === "track"
                                        ? get(songs, [id, "name"])
                                        : get(artistData, [id, "name"]),
                                image:
                                    type === "track"
                                        ? artistImageForTrackId(id)
                                        : artistImageForArtistId(id)
                            })
                        )
                    ) && searchClosePanel()
            };
        }
    )
)(UpdateNodeUriButton);

// TODO: Create a node object
