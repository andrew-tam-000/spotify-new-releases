import React from "react";
import { split, last } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";
import { nowPlayingSongIdSelector } from "../../selectors";

import { playSongStart, initializeOnPlaylist } from "../../redux/actions";

const PlayButton = ({ playSongStart, nowPlayingSongId, uri }) => (
    <Button onClick={playSongStart} mini variant="fab" color="primary" aria-label="Add">
        {last(split(uri, ":")) === nowPlayingSongId ? (
            <PauseCircleOutlineIcon />
        ) : (
            <PlayCircleOutlineIcon />
        )}
    </Button>
);

const mapDispatchToProps = (dispatch, { uri }) => ({
    playSongStart: () => dispatch(playSongStart(uri))
});

export default connect(
    createStructuredSelector({
        nowPlayingSongId: nowPlayingSongIdSelector
    }),
    mapDispatchToProps
)(PlayButton);
