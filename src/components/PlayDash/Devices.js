import React, { Component } from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import { createStructuredSelector } from "reselect";
import Button from "@material-ui/core/Button";
import { transferPlaybackStart } from "../../redux/actions/";
import { spotifyDevicesSelector } from "../../selectors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

class Devices extends Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    render() {
        const { anchorEl } = this.state;
        const { spotifyDevices } = this.props;

        return (
            <React.Fragment>
                <Button
                    variant="primary"
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
                    onClose={() => this.setState({ anchorEl: null })}
                >
                    {map(spotifyDevices, spotifyDevice => (
                        <MenuItem
                            onClick={() => {
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
    { transferPlaybackStart }
)(Devices);
