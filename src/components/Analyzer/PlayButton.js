import React from "react";
import { isUndefined, split, last, omitBy } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";
import { nowPlayingSongIdSelector } from "../../selectors";

import { playSongStart, pauseSongStart } from "../../redux/actions";

const PlayButton = ({ playSongStart, pauseSongStart, nowPlayingSongId, uri, ...props }) => {
    const isPlaying = last(split(uri, ":")) === nowPlayingSongId;
    return (
        <Button
            onClick={isPlaying ? pauseSongStart : playSongStart}
            mini
            variant="fab"
            color="primary"
            aria-label="Add"
            {...props}
        >
            {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
        </Button>
    );
};

const mapDispatchToProps = (dispatch, { uris, uri, context_uri, offset }) => ({
    pauseSongStart: () => dispatch(pauseSongStart()),
    playSongStart: () =>
        dispatch(
            playSongStart(
                omitBy({ uris: uris ? uris : uri ? [uri] : undefined, context_uri }, val =>
                    isUndefined(val)
                )
            )
        )
});

export default connect(
    createStructuredSelector({
        nowPlayingSongId: nowPlayingSongIdSelector
    }),
    mapDispatchToProps
)(PlayButton);
