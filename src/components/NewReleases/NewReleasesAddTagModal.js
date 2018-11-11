import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import _Paper from "@material-ui/core/Paper";
import materialStyled from "../../materialStyled";
import Autocomplete from "../Table/Autocomplete";
import { map, filter, find } from "lodash";
import { ChromePicker } from "react-color";
import Button from "@material-ui/core/Button";

import { availableGenresSelector, genreColorsSelector } from "../../selectors";

const Paper = materialStyled(_Paper)({
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%"
});

const NewReleasesAddTagModal = ({
    open,
    onClose,
    error,
    onChangeGenre,
    onChangeColor,
    genreValue,
    availableGenres,
    colorValue,
    genreColors,
    onSubmit
}) => (
    <Modal open={open} onClose={onClose}>
        <Paper>
            {error && <Typography>{error}</Typography>}
            <Autocomplete
                onChange={onChangeGenre}
                value={genreValue}
                options={map(
                    filter(
                        availableGenres,
                        availableGenre =>
                            !find(genreColors, topGenre => topGenre.genre === availableGenre.genre)
                    ),
                    ({ genre }) => ({ value: genre, label: genre })
                )}
            />
            <Typography>Pick a color</Typography>
            <ChromePicker color={colorValue} onChangeComplete={onChangeColor} />
            <Button variant="contained" color="primary" onClick={onSubmit}>
                Add genre
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
            </Button>
        </Paper>
    </Modal>
);

export default connect(
    createStructuredSelector({
        availableGenres: availableGenresSelector,
        genreColors: genreColorsSelector
    })
)(NewReleasesAddTagModal);
