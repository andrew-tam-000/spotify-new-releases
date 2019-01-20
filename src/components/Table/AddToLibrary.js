import React, { Component } from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { createStructuredSelector } from "reselect";
import _AddIcon from "@material-ui/icons/Add";
import materialStyled from "../../materialStyled";
import { addToMySavedTracksStart } from "../../redux/actions";
import { accessTokenSelector } from "../../selectors";
import Snackbar from "@material-ui/core/Snackbar";
import _SnackbarContent from "@material-ui/core/SnackbarContent";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const AddIcon = materialStyled(_AddIcon)({ cursor: "pointer" });

const SnackbarContent = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.dark
    }
}))(_SnackbarContent);

class AddToLibrary extends Component {
    state = { open: false };

    handleClick = e => {
        e.stopPropagation();
        this.setState({ open: true });
        //this.props.onClick();
    };

    handleClose = () => this.setState({ open: false });

    render() {
        const { accessToken, fontSize, color } = this.props;
        return (
            accessToken && (
                <React.Fragment>
                    <AddIcon fontSize={fontSize} color={color} onClick={this.handleClick} />
                    <Snackbar
                        open={this.state.open}
                        autoHideDuration={2000}
                        onClose={this.handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center"
                        }}
                    >
                        <SnackbarContent message={<Typography>Song added!</Typography>} />
                    </Snackbar>
                </React.Fragment>
            )
        );
    }
}

export default compose(
    connect(
        createStructuredSelector({
            accessToken: accessTokenSelector
        }),
        { addToMySavedTracksStart }
    ),
    withProps(({ addToMySavedTracksStart, id }) => ({
        onClick: () => addToMySavedTracksStart([id])
    }))
)(AddToLibrary);
