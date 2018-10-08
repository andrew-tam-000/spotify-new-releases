import React from "react";
import { connect } from "react-redux";
import TerrainIcon from "@material-ui/icons/Terrain";
import Button from "@material-ui/core/Button";
import { setDiscover } from "../../redux/actions";

const StartTreeButton = ({ setDiscover }) => (
    <Button onClick={setDiscover} mini variant="fab" color="primary" aria-label="Add">
        <TerrainIcon />
    </Button>
);

const mapDispatchToProps = (dispatch, { uri }) => ({
    setDiscover: () => dispatch(setDiscover(uri))
});

export default connect(
    null,
    mapDispatchToProps
)(StartTreeButton);
