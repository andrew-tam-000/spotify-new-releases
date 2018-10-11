import React from "react";
import { connect } from "react-redux";
import { compose, mapProps } from "recompose";
import TerrainIcon from "@material-ui/icons/Terrain";
import Button from "@material-ui/core/Button";
import { setDiscover } from "../../redux/actions";
import { songsSelector, artistDataSelector } from "../../selectors";
import { createStructuredSelector } from "reselect";
import { split } from "lodash";
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
            artistData: artistDataSelector
        }),
        { setDiscover }
    ),
    mapProps(({ songs, artistData, uri, setDiscover }) => {
        const [, type, id] = split(uri, ":");
        const name = ((type === "track" ? songs[id] : artistData[id]) || {}).name;
        return {
            setDiscover: () =>
                setDiscover(
                    new Node({
                        id: uri,
                        uri,
                        open: false,
                        renderKey: uri,
                        name
                    })
                )
        };
    })
)(StartTreeButton);
