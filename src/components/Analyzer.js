import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { initializeOnAnalyzerStart, analyzerCloseSearchPanel } from "../redux/actions";
import { songsWithDataByIdSelector, analyzerOpenSearchPanelSelector } from "../selectors";
import SongTable from "./Analyzer/SongTable";
import RelatedSearch from "./Analyzer/RelatedSearch";
import _Drawer from "@material-ui/core/Drawer";
import OpenSearchButton from "./Analyzer/OpenSearchButton";

const Drawer = withStyles({
    paper: {
        width: "480px"
    }
})(_Drawer);

class Analyzer extends Component {
    componentDidMount() {
        this.props.initializeOnAnalyzerStart();
    }

    render() {
        const { analyzerOpenSearchPanel, analyzerCloseSearchPanel } = this.props;
        return (
            <React.Fragment>
                <SongTable />
                <OpenSearchButton />
                <Drawer
                    paperProps={{
                        style: {
                            width: "450px !important"
                        }
                    }}
                    onClose={analyzerCloseSearchPanel}
                    anchor="right"
                    open={analyzerOpenSearchPanel}
                >
                    <RelatedSearch />
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector,
    analyzerOpenSearchPanel: analyzerOpenSearchPanelSelector
});

const mapDispatchToProps = { initializeOnAnalyzerStart, analyzerCloseSearchPanel };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Analyzer);
