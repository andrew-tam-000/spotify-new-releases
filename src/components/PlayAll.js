import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

import { playSongStart } from "../redux/actions";

const PlayAllButton = ({ playSongStart, uris }) => (
    <Button onClick={playSongStart} variant="contained" color="primary" aria-label="Add">
        Play All
    </Button>
);

const mapDispatchToProps = (dispatch, { uris }) => ({
    playSongStart: () => dispatch(playSongStart({ uris }))
});

export default connect(
    null,
    mapDispatchToProps
)(PlayAllButton);
