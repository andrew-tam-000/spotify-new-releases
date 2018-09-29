import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { initializeOnAnalyzerStart } from "../redux/actions";
import { songsWithDataByIdSelector } from "../selectors";
import SongTable from "./Analyzer/SongTable";
import RelatedSearch from "./Analyzer/RelatedSearch";
import Drawer from "@material-ui/core/Drawer";

class Analyzer extends Component {
    componentDidMount() {
        this.props.initializeOnAnalyzerStart();
    }

    render() {
        return (
            <React.Fragment>
                <SongTable />
                <Drawer>
                    <RelatedSearch />
                </Drawer>
            </React.Fragment>
        );
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
