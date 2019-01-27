import React, { Component } from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import { createStructuredSelector } from "reselect";
import Typography from "@material-ui/core/Typography";
import { transferPlaybackStart, getDevicesStart } from "../../redux/actions/";
import { spotifyDevicesSelector, nowPlayingDeviceIdSelector } from "../../selectors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";

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
        const { spotifyDevices, nowPlayingDeviceId } = this.props;

        return (
            <React.Fragment>
                <IconButton color="action">
                    <MoreVertIcon
                        color="action"
                        aria-owns={anchorEl ? "simple-menu" : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        fontSize="small"
                    />
                </IconButton>
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
                            <Typography
                                color={
                                    nowPlayingDeviceId === spotifyDevice.id
                                        ? "secondary"
                                        : undefined
                                }
                            >
                                {`${spotifyDevice.name} | ${spotifyDevice.type}`}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </React.Fragment>
        );
    }
}

export default connect(
    createStructuredSelector({
        spotifyDevices: spotifyDevicesSelector,
        nowPlayingDeviceId: nowPlayingDeviceIdSelector
    }),
    { getDevicesStart, transferPlaybackStart }
)(Devices);
