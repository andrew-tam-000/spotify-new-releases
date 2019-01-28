import React from "react";
import { connect } from "react-redux";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import _Button from "@material-ui/core/Button";
import { skipToPreviousStart } from "../../redux/actions";
import materialStyled from "../../materialStyled";

const Button = materialStyled(_Button)({ flexShrink: 0 });

const SkipPreviousButton = ({ skipToPreviousStart }) => (
    <Button onClick={skipToPreviousStart} mini variant="fab" color="primary" aria-label="Add">
        <SkipPreviousIcon />
    </Button>
);

export default connect(
    null,
    { skipToPreviousStart }
)(SkipPreviousButton);
