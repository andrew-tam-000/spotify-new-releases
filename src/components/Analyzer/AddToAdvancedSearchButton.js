import React from "react";
import { connect } from "react-redux";
import { compose, mapProps } from "recompose";
import Button from "@material-ui/core/Button";
import { advancedSearchAddTrack } from "../../redux/actions";
import NoteAdd from "@material-ui/icons/NoteAdd";

const AddToAdvancedSearchButton = ({ advancedSearchAddTrack, trackDetails }) => (
    <Button
        onClick={() => advancedSearchAddTrack(trackDetails)}
        mini
        variant="fab"
        color="primary"
        aria-label="Add"
    >
        <NoteAdd />
    </Button>
);

const mapDispatchToProps = { advancedSearchAddTrack };

export default compose(
    connect(
        null,
        mapDispatchToProps
    ),
    mapProps(({ id, ...props }) => ({
        trackDetails: id,
        ...props
    }))
)(AddToAdvancedSearchButton);
