import React from "react";
import Slider from "@material-ui/lab/Slider";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { seekStart } from "../../redux/actions";
import { nowPlayingSongDurationSelector, nowPlayingSongProgressSelector } from "../../selectors";

const Seek = ({ seekStart, nowPlayingSongDuration, nowPlayingSongProgress }) => (
    <Slider
        min={0}
        max={nowPlayingSongDuration}
        value={nowPlayingSongProgress}
        onChange={(e, val) => seekStart(parseInt(val, 10))}
    />
);

export default connect(
    createStructuredSelector({
        nowPlayingSongDuration: nowPlayingSongDurationSelector,
        nowPlayingSongProgress: nowPlayingSongProgressSelector
    }),
    { seekStart }
)(Seek);
