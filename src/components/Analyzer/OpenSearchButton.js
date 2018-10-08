import React from "react";
import { connect } from "react-redux";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Button from "@material-ui/core/Button";

import { analyzerOpenSearchPanel } from "../../redux/actions";

const OpenSearchButton = ({ analyzerOpenSearchPanel }) => (
    <Button onClick={analyzerOpenSearchPanel} mini variant="fab" color="primary" aria-label="Add">
        <PlayCircleOutlineIcon />
    </Button>
);

const mapDispatchToProps = (dispatch, { uri }) => ({
    analyzerOpenSearchPanel: () => dispatch(analyzerOpenSearchPanel())
});

export default connect(
    null,
    mapDispatchToProps
)(OpenSearchButton);
