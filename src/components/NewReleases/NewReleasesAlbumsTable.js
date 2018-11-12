import React, { Component } from "react";
import { compose, withPropsOnChange } from "recompact";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import NewReleasesAddTagModal from "./NewReleasesAddTagModal";
import {
    genreColorsSelector,
    queryParamsSelector,
    albumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector
} from "../../selectors";
import { newReleasesByAlbumTableDataWithFiltersSelector } from "../../selectors/tables";
import Table from "../Table";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors,
    openNewReleaseModal,
    reorderTags,
    reorderQueryTags
} from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import {
    noop,
    flatMap,
    map,
    get,
    size,
    join,
    first,
    difference,
    find,
    compact,
    filter,
    slice
} from "lodash";
import SearchBar from "../Table/SearchBar";
import { encodedStringifiedToObj } from "../../utils";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PlayAll from "../PlayAll";
import Switch from "@material-ui/core/Switch";
import TagList from "../Table/TagList";

const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
    background-color: #757575;
`;

const Tags = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    flex: 1;
`;

const TagsWithButton = styled.div`
    display: flex;
    overflow: hidden;
`;

const ActiveDivider = styled.div`
    min-width: 20px;
    max-width: 20px;
`;

const HeaderCell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const Settings = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const prefixColumnsProps = [
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album",
        width: 140,
        headerRenderer: () => <SearchBar />,
        disableSort: true,
        flexGrow: 5
    }
];

const ColumnCellRenderer = ({ cellData }) => <Typography>{cellData}</Typography>;
const HeaderCellRenderer = ({ label, dataKey, sortIndicator }) => (
    <HeaderCell>
        <Typography title={label}>{label}</Typography>
        <Typography>{sortIndicator && sortIndicator}</Typography>
    </HeaderCell>
);

class NewReleasesAlbumsTable extends Component {
    virtualizedConfig = {
        onRowClick: ({ event, index, rowData: { uri, id, isTrack } }) =>
            !isTrack ? this.props.toggleNewReleaseAlbum(id) : noop,
        rowStyle: ({ index }) => {
            const {
                tableData: { rows }
            } = this.props;
            const backgroundColors = get(rows, `${index}.meta.backgroundColors`);
            const linearGradientString = join(backgroundColors, ", ");
            return (
                size(backgroundColors) && {
                    background:
                        size(backgroundColors) > 1
                            ? `linear-gradient(90deg, ${linearGradientString})`
                            : first(backgroundColors)
                }
            );
        },
        rowHeight: 60,
        headerHeight: 32
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    openNewReleaseModal = () => this.props.openNewReleaseModal();
    toggleShowAllNewReleaseTracks = (e, val) => {
        if (val === "tracks") {
            this.props.showAllNewReleaseTracks();
        } else if (val === "albums") {
            this.props.hideAllNewReleaseTracks();
        }
    };
    handleQueryTagSort = ({ oldIndex, newIndex }) =>
        this.props.reorderQueryTags(oldIndex, newIndex);
    handleTagSort = ({ oldIndex, newIndex }) => this.props.reorderTags(oldIndex, newIndex);

    // TODO: Use html encode library, he to encode strings
    render() {
        const {
            tableData,
            genreColors,
            queryParams,
            newReleasesTableShowColors,
            newReleasesTableShowAllTracks,
            toggleNewReleaseColors,
            playAllUris
        } = this.props;
        const active = compact(
            map(encodedStringifiedToObj(queryParams.tags, []), tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre)
            )
        );
        const inactive = difference(genreColors, active);
        return (
            <NewReleasesAlbumsTableWrapper>
                <TagsWithButton>
                    <Button
                        mini
                        variant="fab"
                        color="primary"
                        aria-label="Add"
                        onClick={this.openNewReleaseModal}
                    >
                        <AddIcon />
                    </Button>
                    <NewReleasesAddTagModal />
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
                <Settings>
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
                </Settings>
                <Table
                    tableData={tableData}
                    prefixColumnsProps={prefixColumnsProps}
                    virtualizedConfig={this.virtualizedConfig}
                    columnConfig={this.columnConfig}
                />
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataWithFiltersSelector,
    genreColors: genreColorsSelector,
    queryParams: queryParamsSelector,
    newReleasesTableShowColors: newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracks: newReleasesTableShowAllTracksSelector,
    albums: albumsSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        {
            showSideBar,
            addGenreColors,
            toggleNewReleaseAlbum,
            showAllNewReleaseTracks,
            hideAllNewReleaseTracks,
            toggleNewReleaseColors,
            openNewReleaseModal,
            reorderTags,
            reorderQueryTags
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
)(NewReleasesAlbumsTable);
