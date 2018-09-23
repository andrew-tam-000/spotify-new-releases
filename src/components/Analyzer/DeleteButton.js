import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Delete from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { songsWithDataByIdSelector } from "../../selectors";
import { advancedSearchRemoveTrack } from "../../redux/actions";

const DeleteButton = ({ advancedSearchRemoveTrack, ...props }) => (
    <Button
        {...props}
        onClick={advancedSearchRemoveTrack}
        mini
        variant="fab"
        color="primary"
        aria-label="Add"
    >
        <Delete />
    </Button>
);

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector
});

const mapDispatchToProps = (dispatch, { index }) => ({
    advancedSearchRemoveTrack: () => dispatch(advancedSearchRemoveTrack(index))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteButton);
