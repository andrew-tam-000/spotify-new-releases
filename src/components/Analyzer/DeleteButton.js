import React from "react";
import { connect } from "react-redux";
import Delete from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
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

const mapDispatchToProps = (dispatch, { index }) => ({
    advancedSearchRemoveTrack: () => dispatch(advancedSearchRemoveTrack(index))
});

export default connect(
    null,
    mapDispatchToProps
)(DeleteButton);
