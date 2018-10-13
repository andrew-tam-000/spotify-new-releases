import React from "react";
import { connect } from "react-redux";
import { compose, mapProps } from "recompose";
import TerrainIcon from "@material-ui/icons/Terrain";
import Button from "@material-ui/core/Button";
import { setDiscover } from "../../redux/actions";
import {
    songsSelector,
    artistDataSelector,
    artistImageForTrackIdSelector,
    artistImageForArtistIdSelector
} from "../../selectors";
import { createStructuredSelector } from "reselect";
import { split, get, last } from "lodash";
import Node from "../../Node";

const StartTreeButton = ({ setDiscover }) => (
    <Button onClick={setDiscover} mini variant="fab" color="primary" aria-label="Add">
        <TerrainIcon />
    </Button>
);

export default compose(
    connect(
        createStructuredSelector({
            songs: songsSelector,
            artistData: artistDataSelector,
            artistImageForTrackId: artistImageForTrackIdSelector,
            artistImageForArtistId: artistImageForArtistIdSelector
        }),
        { setDiscover }
    ),
    mapProps(
        ({
            songs,
            artistData,
            uri,
            setDiscover,
            artistImageForTrackId,
            artistImageForArtistId
        }) => {
            const [, type, id] = split(uri, ":");
            const name = ((type === "track" ? songs[id] : artistData[id]) || {}).name;
            const image = type === "track" ? artistImageForTrackId(id) : artistImageForArtistId(id);
            return {
                setDiscover: () =>
                    setDiscover(
                        new Node({
                            id: uri,
                            uri,
                            open: false,
                            renderKey: uri,
                            image,
                            name
                        })
                    )
            };
        }
    )
)(StartTreeButton);
