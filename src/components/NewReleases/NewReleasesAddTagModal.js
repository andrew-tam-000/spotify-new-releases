import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import _Paper from "@material-ui/core/Paper";
import materialStyled from "../../materialStyled";
import Autocomplete from "../Table/Autocomplete";
import { get, map, filter, find } from "lodash";
import { ChromePicker } from "react-color";
import Button from "@material-ui/core/Button";
import {
    addGenreColors,
    closeNewReleaseModal,
    setNewReleaseModalColor,
    setNewReleaseModalGenre
} from "../../redux/actions";

import {
    newReleasesTableModalSelector,
    availableGenresSelector,
    genreColorsSelector,
    newReleasesTableModalGenreSelector,
    newReleasesTableModalColorSelector
} from "../../selectors";

const Paper = materialStyled(_Paper)({
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%"
});

class NewReleasesAddTagModal extends Component {
    state = {
        error: undefined
    };

    addGenreColors = () => {
        const color = this.props.newReleasesTableModalColor;
        const genre = this.props.newReleasesTableModalGenre;
        if (color && genre) {
            this.props.addGenreColors([{ color, genre }]);
            this.props.closeNewReleaseModal();
        } else {
            this.setState({ error: "Please select a genre and a color" });
        }
    };

    handleChangeColor = ({ hex }) => this.props.setNewReleaseModalColor(hex);
    handleSelectGenre = ({ value }) => this.props.setNewReleaseModalGenre(value);

    render() {
        const {
            availableGenres,
            genreColors,
            newReleasesTableModal,
            closeNewReleaseModal,
            newReleasesTableModalGenre,
            newReleasesTableModalColor
        } = this.props;
        return (
            <Modal open={newReleasesTableModal} onClose={closeNewReleaseModal}>
                <Paper>
                    {this.state.error && <Typography>{this.state.error}</Typography>}
                    <Autocomplete
                        onChange={this.handleSelectGenre}
                        value={
                            newReleasesTableModalGenre
                                ? {
                                      value: newReleasesTableModalGenre,
                                      label: newReleasesTableModalGenre
                                  }
                                : undefined
                        }
                        options={map(
                            filter(
                                availableGenres,
                                availableGenre =>
                                    !find(
                                        genreColors,
                                        topGenre => topGenre.genre === availableGenre.genre
                                    )
                            ),
                            ({ genre }) => ({ value: genre, label: genre })
                        )}
                    />
                    <Typography>Pick a color</Typography>
                    <ChromePicker
                        color={newReleasesTableModalColor}
                        onChangeComplete={this.handleChangeColor}
                    />
                    <Button variant="contained" color="primary" onClick={this.addGenreColors}>
                        Add genre
                    </Button>
                    <Button variant="contained" color="secondary" onClick={closeNewReleaseModal}>
                        Cancel
                    </Button>
                </Paper>
            </Modal>
        );
    }
}

export default connect(
    createStructuredSelector({
        newReleasesTableModalGenre: newReleasesTableModalGenreSelector,
        newReleasesTableModalColor: newReleasesTableModalColorSelector,
        newReleasesTableModal: newReleasesTableModalSelector,
        availableGenres: availableGenresSelector,
        genreColors: genreColorsSelector
    }),
    { addGenreColors, closeNewReleaseModal, setNewReleaseModalColor, setNewReleaseModalGenre }
)(NewReleasesAddTagModal);
