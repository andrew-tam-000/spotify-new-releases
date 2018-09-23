import styled from "styled-components";
import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import _RelatedSearchForm from "./RelatedSearchForm";
import Results from "./Results";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { advancedSearchActiveTabSelector } from "../../selectors";
import { advancedSearchGetResultsStart, advancedSearchChangeTab } from "../../redux/actions";
import TrackList from "./TrackList";

const RelatedSearchForm = styled(_RelatedSearchForm)`
    display: flex;
    flex-wrap: wrap;
`;

const TabContainer = ({ children, ...props }) => <div {...props}>{children}</div>;

class RelatedSearch extends Component {
    render() {
        const {
            advancedSearchGetResultsStart,
            advancedSearchActiveTab,
            advancedSearchChangeTab
        } = this.props;
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Tabs value={advancedSearchActiveTab} onChange={advancedSearchChangeTab}>
                        <Tab label="Tracks" />
                        <Tab label="Tunables" />
                        <Tab label="Results" />
                    </Tabs>
                </AppBar>
                <Button variant="contained" color="primary" onClick={advancedSearchGetResultsStart}>
                    Submit
                </Button>
                {advancedSearchActiveTab === 0 && (
                    <TabContainer>
                        <TrackList />
                    </TabContainer>
                )}
                {advancedSearchActiveTab === 1 && (
                    <TabContainer>
                        <RelatedSearchForm />
                    </TabContainer>
                )}
                {advancedSearchActiveTab === 2 && (
                    <TabContainer>
                        <Results />
                    </TabContainer>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    advancedSearchActiveTab: advancedSearchActiveTabSelector
});

const mapDispatchToProps = dispatch => ({
    advancedSearchChangeTab: (e, index) => dispatch(advancedSearchChangeTab(index)),
    advancedSearchGetResultsStart: () => dispatch(advancedSearchGetResultsStart())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RelatedSearch);
