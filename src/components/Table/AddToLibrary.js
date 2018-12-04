import React from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { createStructuredSelector } from "reselect";
import _AddIcon from "@material-ui/icons/Add";
import materialStyled from "../../materialStyled";
import { addToMySavedTracksStart } from "../../redux/actions";
import { accessTokenSelector } from "../../selectors";

const AddIcon = materialStyled(_AddIcon)({ cursor: "pointer" });
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
