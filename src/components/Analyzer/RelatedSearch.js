import { map } from "lodash";
import styled from "styled-components";
import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { advancedSearchTracksSelector } from "../../selectors";
import { advancedSearchGetResultsStart } from "../../redux/actions";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _RelatedSearchForm from "./RelatedSearchForm";

const RelatedSearchForm = styled(_RelatedSearchForm)`
    display: flex;
    position: absolute;
`;

const SmallListItemText = styled(ListItemText)`
    flex: none !important;
`;

class RelatedSearch extends Component {
    render() {
        const { advancedSearchTracks, advancedSearchGetResultsStart } = this.props;
        return (
            <React.Fragment>
                <Button onClick={advancedSearchGetResultsStart}>Submit</Button>
                <List>
                    {map(advancedSearchTracks, (track, index) => (
                        <ListItem key={index}>
                            <SmallListItemText primary={track.title} secondary={track.artist} />
                            <ListItemText
                                primary={<RelatedSearchForm index={index} track={track} />}
                            />
                        </ListItem>
                    ))}
                </List>
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    advancedSearchTracks: advancedSearchTracksSelector
});

const mapDispatchToProps = dispatch => ({
    advancedSearchGetResultsStart: () => dispatch(advancedSearchGetResultsStart())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RelatedSearch);
