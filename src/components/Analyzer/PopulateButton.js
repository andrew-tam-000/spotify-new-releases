import React from "react";
import { reduce, set, get, filter } from "lodash";
import { connect } from "react-redux";
import { compose, mapProps } from "recompose";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Button from "@material-ui/core/Button";
import { advancedSearchUpdateAttributes } from "../../redux/actions";
import tableConfig from "../../tableConfig";

const PopulateButton = ({ advancedSearchUpdateAttributes, trackDetails }) => (
    <Button
        onClick={() => advancedSearchUpdateAttributes(trackDetails)}
        mini
        variant="fab"
        color="primary"
        aria-label="Add"
    >
        <PlaylistAdd />
    </Button>
);

const mapDispatchToProps = (dispatch, { songData }) => ({
    advancedSearchUpdateAttributes: () =>
        dispatch(
            advancedSearchUpdateAttributes(
                reduce(
                    filter(tableConfig, "tunable"),
                    (acc, { dataKey, getter }) =>
                        set(acc, `min_${dataKey}`, get(songData, getter())) &&
                        set(acc, `max_${dataKey}`, get(songData, getter())),
                    {}
                )
            )
        )
});

export default compose(
    connect(
        null,
        mapDispatchToProps
    ),
    mapProps(({ id, ...props }) => ({
        trackDetails: id,
        ...props
    }))
)(PopulateButton);
