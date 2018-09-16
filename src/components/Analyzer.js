import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { initializeOnAnalyzerStart } from "../redux/actions";
import { songsWithDataByIdSelector } from "../selectors";
import SongTable from "./Analyzer/SongTable";

class Analyzer extends Component {
    componentDidMount() {
        this.props.initializeOnAnalyzerStart();
    }

    render() {
        return <SongTable />;
    }
}

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector
});

const mapDispatchToProps = { initializeOnAnalyzerStart };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Analyzer);
