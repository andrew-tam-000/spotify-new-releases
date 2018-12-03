import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { loadingAnalyzerTableSelector, nowPlayingTrackIdSelector } from "../selectors/";
import { nowPlayingTableForIdSelector } from "../selectors/tables";
import { getRelatedTracksStart } from "../redux/actions";

import TableWithTags from "./Table/TableWithTags";

class NowPlaying extends Component {
    state = {
        nowPlayingId: null,
        intervalId: null
    };

    clearInterval = () => clearInterval(this.state.intervalId);

    setupRelated = () => {
        const { nowPlayingTrackId } = this.props;
        this.props.getRelatedTracksStart(nowPlayingTrackId);
        this.setState({
            nowPlayingId: nowPlayingTrackId
        });
    };

    componentDidMount() {
        const intervalId = setInterval(() => {
            const { nowPlayingTrackId } = this.props;
            if (nowPlayingTrackId) {
                this.clearInterval();
                this.setupRelated();
            }
        }, 500);

        this.setState({
            intervalId
        });
    }

    componentWillUnmount() {
        this.clearInterval();
    }

    render() {
        const { tableData } = this.props;
        const { nowPlayingId } = this.state;
        return nowPlayingId ? <TableWithTags tableData={tableData(nowPlayingId)} /> : null;
    }
}

const mapStateToProps = createStructuredSelector({
    tableData: nowPlayingTableForIdSelector,
    nowPlayingTrackId: nowPlayingTrackIdSelector
});

export default connect(
    mapStateToProps,
    { getRelatedTracksStart }
)(NowPlaying);
