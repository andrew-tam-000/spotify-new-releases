import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import { compose, withPropsOnChange } from "recompact";
import { flatMap, map, get, filter, slice, size, thru } from "lodash";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors
} from "../../redux/actions";
import { connect } from "react-redux";
import materialStyled from "../../materialStyled";
import _SettingsIcon from "@material-ui/icons/Settings";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import Switch from "@material-ui/core/Switch";
import {
    albumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector
} from "../../selectors";
import Menu from "@material-ui/core/Menu";

const SettingsIcon = materialStyled(_SettingsIcon)({
    cursor: "pointer",
    marginRight: "10px"
});

class Settings extends Component {
    state = {
        anchorEl: null
    };

    openMenu = event => this.setState({ anchorEl: event.currentTarget });

    closeMenu = () => this.setState({ anchorEl: null });

    toggleShowAllNewReleaseTracks = (e, val) => {
        if (val === "tracks") {
            this.props.showAllNewReleaseTracks();
        } else if (val === "albums") {
            this.props.hideAllNewReleaseTracks();
        }
    };

    render() {
        const {
            newReleasesTableShowColors,
            newReleasesTableShowAllTracks,
            toggleNewReleaseColors
        } = this.props;

        return (
            <React.Fragment>
                <SettingsIcon
                    color="action"
                    onClick={this.state.anchorEl ? this.closeMenu : this.openMenu}
                />
                <Menu
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.closeMenu}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newReleasesTableShowColors}
                                onChange={toggleNewReleaseColors}
                            />
                        }
                        label="Colors?"
                    />
                    <div>
                        <ToggleButtonGroup
                            exclusive={true}
                            onChange={this.toggleShowAllNewReleaseTracks}
                            value={newReleasesTableShowAllTracks ? "tracks" : "albums"}
                        >
                            <ToggleButton value="tracks">
                                <AudiotrackIcon />
                            </ToggleButton>
                            <ToggleButton value="albums">
                                <LibraryMusicIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </Menu>
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    newReleasesTableShowColors: newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracks: newReleasesTableShowAllTracksSelector,
    albums: albumsSelector
});
export default compose(
    connect(
        mapStateToProps,
        {
            showSideBar,
            addGenreColors,
            toggleNewReleaseAlbum,
            showAllNewReleaseTracks,
            hideAllNewReleaseTracks,
            toggleNewReleaseColors
        }
    )
)(Settings);
