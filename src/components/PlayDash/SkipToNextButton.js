import React from "react";
import { connect } from "react-redux";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Button from "@material-ui/core/Button";
import { skipToNextStart } from "../../redux/actions";

const SkipNextButton = ({ skipToNextStart }) => (
    <Button onClick={skipToNextStart} mini variant="fab" color="primary" aria-label="Add">
        <SkipNextIcon />
    </Button>
);

export default connect(
    null,
    { skipToNextStart }
)(SkipNextButton);
