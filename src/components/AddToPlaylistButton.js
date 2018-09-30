import React from "react";
import { connect } from "react-redux";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Button from "@material-ui/core/Button";

import { addTracksToPlaylistStart } from "../redux/actions";

const AddToPlaylistButton = ({ addTracksToPlaylistStart }) => (
    <Button onClick={addTracksToPlaylistStart} mini variant="fab" color="primary" aria-label="Add">
        <PlaylistAdd />
    </Button>
);

const mapDispatchToProps = (dispatch, { uri }) => ({
    addTracksToPlaylistStart: () => dispatch(addTracksToPlaylistStart([uri]))
});

export default connect(
    null,
    mapDispatchToProps
)(AddToPlaylistButton);
