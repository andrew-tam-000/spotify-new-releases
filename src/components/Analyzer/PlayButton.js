import React from "react";
import { connect } from "react-redux";
import { playlistTracksSelector, playStatusSelector } from "../../selectors";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Button from "@material-ui/core/Button";

import { playSongStart, initializeOnPlaylist } from "../../redux/actions";

const PlayButton = ({ playSongStart }) => (
    <Button onClick={playSongStart} mini variant="fab" color="primary" aria-label="Add">
        <PlayCircleOutlineIcon />
    </Button>
);

const mapDispatchToProps = (dispatch, { uri }) => ({
    playSongStart: () => dispatch(playSongStart(uri))
});

export default connect(
    null,
    mapDispatchToProps
)(PlayButton);
