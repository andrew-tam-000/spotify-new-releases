import React, { Component } from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import { createStructuredSelector } from "reselect";
import Button from "@material-ui/core/Button";
import { transferPlaybackStart, getDevicesStart } from "../../redux/actions/";
import { spotifyDevicesSelector } from "../../selectors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

class Devices extends Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.props.getDevicesStart();
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => this.setState({ anchorEl: null });

    render() {
        const { anchorEl } = this.state;
        const { spotifyDevices } = this.props;

        return (
            <React.Fragment>
                <Button
                    color="primary"
                    aria-owns={anchorEl ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Devices
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {map(spotifyDevices, spotifyDevice => (
                        <MenuItem
                            onClick={() => {
                                this.handleClose();
                                this.props.transferPlaybackStart(spotifyDevice.id);
                            }}
                        >
                            {`${spotifyDevice.name} | ${spotifyDevice.type}`}
                        </MenuItem>
                    ))}
                </Menu>
            </React.Fragment>
        );
    }
}

export default connect(
    createStructuredSelector({
        spotifyDevices: spotifyDevicesSelector
    }),
    { getDevicesStart, transferPlaybackStart }
)(Devices);
