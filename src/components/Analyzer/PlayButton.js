import React from "react";
import { isUndefined, split, last, omitBy } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";
import { nowPlayingSongUriSelector } from "../../selectors";

import { playSongStart, pauseSongStart } from "../../redux/actions";

const PlayButton = ({ playSongStart, pauseSongStart, nowPlayingSongUri, uri, ...props }) => {
    const isPlaying = uri === nowPlayingSongUri;
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
        nowPlayingSongUri: nowPlayingSongUriSelector
    }),
    mapDispatchToProps
)(PlayButton);
