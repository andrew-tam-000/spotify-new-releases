import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import _Paper from "@material-ui/core/Paper";
import materialStyled from "../../materialStyled";
import Autocomplete from "../Table/Autocomplete";
import { map, filter, includes } from "lodash";
import { ChromePicker as _ChromePicker } from "react-color";
import Button from "@material-ui/core/Button";
import {
    addGenreColors,
    closeNewReleaseModal,
    setNewReleaseModalColor,
    toggleTagFromQuery,
    setNewReleaseModalGenre
} from "../../redux/actions";

import {
    newReleasesTableModalSelector,
    availableGenresSelector,
    genreColorsMapSelector,
    newReleasesTableModalGenreSelector,
    newReleasesTableModalColorSelector,
    queryParamsTagsSelector
} from "../../selectors";

const ChromePicker = styled(_ChromePicker)`
    margin-top: 10px;
`;

const Paper = materialStyled(_Paper)({
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%"
});

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

class NewReleasesAddTagModal extends Component {
    state = {
        error: undefined
    };

    addGenreColors = () => {
        const color = this.props.newReleasesTableModalColor;
        const genre = this.props.newReleasesTableModalGenre;
        if (color && genre) {
            this.props.addGenreColors([{ color, genre }], true);
            this.props.closeNewReleaseModal();
        } else {
            this.setState({ error: "Please select a genre and a color" });
        }
    };

    updateGenreColors = () => {
        const color = this.props.newReleasesTableModalColor;
        const genre = this.props.newReleasesTableModalGenre;
        if (color && genre && this.props.genreColorsMap[genre]) {
            this.props.addGenreColors([{ color, genre }], false);
        }
    };

    handleChangeColor = ({ hex }) =>
        this.props.setNewReleaseModalColor(hex) && this.updateGenreColors();
    handleSelectGenre = ({ value }) => this.props.setNewReleaseModalGenre(value);

    removeTag = () => {
        this.props.toggleTagFromQuery(this.props.newReleasesTableModalGenre);
        this.props.closeNewReleaseModal();
    };

    render() {
        const {
            availableGenres,
            newReleasesTableModal,
            closeNewReleaseModal,
            newReleasesTableModalGenre,
            newReleasesTableModalColor,
            queryParamsTags
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
                        options={map(availableGenres, ({ genre }) => ({
                            value: genre,
                            label: genre
                        }))}
                    />
                    <ChromePicker
                        color={newReleasesTableModalColor}
                        onChangeComplete={this.handleChangeColor}
                    />
                    <Buttons>
                        {includes(queryParamsTags, newReleasesTableModalGenre) ? (
                            <Button variant="contained" color="primary" onClick={this.removeTag}>
                                Delete genre
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.addGenreColors}
                            >
                                Add genre
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={closeNewReleaseModal}
                        >
                            Cancel
                        </Button>
                    </Buttons>
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
        queryParamsTags: queryParamsTagsSelector,
        genreColorsMap: genreColorsMapSelector
    }),
    {
        toggleTagFromQuery,
        addGenreColors,
        closeNewReleaseModal,
        setNewReleaseModalColor,
        setNewReleaseModalGenre
    }
)(NewReleasesAddTagModal);
