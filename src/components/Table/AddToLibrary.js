import React from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { createStructuredSelector } from "reselect";
import AddIcon from "@material-ui/icons/Add";
import { addToMySavedTracksStart } from "../../redux/actions";
import { accessTokenSelector } from "../../selectors";

const AddToLibrary = compose(
    connect(
        createStructuredSelector({
            accessToken: accessTokenSelector
        }),
        { addToMySavedTracksStart }
    ),
    withProps(({ addToMySavedTracksStart, id }) => ({
        onClick: () => addToMySavedTracksStart([id])
    }))
)(function _AddIcon({ accessToken, ...props }) {
    return accessToken && <AddIcon {...props} />;
});

export default AddToLibrary;
