import React, { Component } from "react";

import { noop } from "lodash";
import Slider from "@material-ui/lab/Slider";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { seekStart } from "../../redux/actions";
import { nowPlayingSongDurationSelector, nowPlayingSongProgressSelector } from "../../selectors";

class Seek extends Component {
    state = {
        dragging: false,
        value: this.props.nowPlayingSongProgress
    };

    handleDragStart = () => this.setState({ dragging: true });

    handleDragEnd = () => [
        this.setState({ dragging: false }),
        this.props.seekStart(this.state.value)
    ];

    getValue = () => (this.state.dragging ? this.state.value : this.props.nowPlayingSongProgress);

    handleChange = (e, val) =>
        this.state.dragging ? this.setState({ value: parseInt(val, 10) }) : noop;

    render() {
        const { nowPlayingSongDuration } = this.props;

        return (
            <Slider
                min={0}
                max={nowPlayingSongDuration}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                value={this.getValue()}
                onChange={this.handleChange}
            />
        );
    }
}

export default connect(
    createStructuredSelector({
        nowPlayingSongDuration: nowPlayingSongDurationSelector,
        nowPlayingSongProgress: nowPlayingSongProgressSelector
    }),
    { seekStart }
)(Seek);
