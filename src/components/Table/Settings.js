import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import { compose, withPropsOnChange } from "recompact";
import TagList from "./TagList";
import { find, difference, flatMap, map, get, filter, slice } from "lodash";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors
} from "../../redux/actions";
import { connect } from "react-redux";
import styled from "styled-components";
import materialStyled from "../../materialStyled";
import _SettingsIcon from "@material-ui/icons/Settings";
import PlayAll from "../PlayAll";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import Switch from "@material-ui/core/Switch";
import {
    genreColorsSelector,
    queryParamsSelector,
    albumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector
} from "../../selectors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ItemTagList from "./ItemTagList";

const Tags = styled.div`
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
`;

const ActiveDivider = styled.div`
    min-width: 20px;
    max-width: 20px;
`;
const TagsWithButton = styled.div`
    display: flex;
    overflow: hidden;
    align-items: center;
`;

const SettingsIcon = materialStyled(_SettingsIcon)({
    cursor: "pointer",
    marginRight: "10px"
});

const SettingsMenu = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

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
            toggleNewReleaseColors,
            playAllUris,
            genreColors,
            queryParams
        } = this.props;

        const active = map(
            queryParams.tags,
            tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre) || {
                    genre: tagGenre
                }
        );
        const inactive = difference(genreColors, active);
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
                    <TagsWithButton>
                        <Tags>
                            <TagList
                                axis="x"
                                distance={10}
                                tags={active}
                                onSortEnd={this.handleQueryTagSort}
                            />
                            {active.length ? <ActiveDivider /> : null}
                            <TagList
                                axis="x"
                                disabled={true}
                                tags={inactive}
                                onSortEnd={this.handleTagSort}
                            />
                        </Tags>
                    </TagsWithButton>
                    <PlayAll uris={playAllUris} />
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
    genreColors: genreColorsSelector,
    queryParams: queryParamsSelector,
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
    ),
    withPropsOnChange(
        ["tableData", "newReleasesTableShowAllTracks", "albums"],
        ({ tableData: { rows }, newReleasesTableShowAllTracks, albums }) => ({
            // BUG - spotify doesn't accept arbitrarily large uri's
            playAllUris: slice(
                newReleasesTableShowAllTracks
                    ? map(rows, "uri")
                    : flatMap(filter(rows, ({ isTrack }) => !isTrack), ({ id }) =>
                          map(get(albums, `${id}.tracks.items`), "uri")
                      ),
                0,
                500
            )
        })
    )
)(Settings);
