import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { compose, mapProps } from "recompose";
import Search from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import { songsWithDataByIdSelector } from "../../selectors";
import { advancedSearchAddTrack } from "../../redux/actions";

const SearchButton = ({ advancedSearchAddTrack, trackDetails }) => (
    <Button
        onClick={() => advancedSearchAddTrack(trackDetails)}
        mini
        variant="fab"
        color="primary"
        aria-label="Add"
    >
        <Search />
    </Button>
);

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector
});

const mapDispatchToProps = { advancedSearchAddTrack };

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    mapProps(({ songsWithDataById, id, ...props }) => ({
        trackDetails: id,
        ...props
    }))
)(SearchButton);
