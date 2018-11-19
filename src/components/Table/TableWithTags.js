import React, { Component } from "react";
import { defaultTableRowRenderer } from "react-virtualized";
import { compose, withPropsOnChange } from "recompact";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import NewReleasesAddTagModal from "../NewReleases/NewReleasesAddTagModal";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import _SettingsIcon from "@material-ui/icons/Settings";
import materialStyled from "../../materialStyled";
import {
    genreColorsSelector,
    queryParamsSelector,
    albumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector
} from "../../selectors";
import Table from "../Table";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors,
    reorderTags,
    reorderQueryTags
} from "../../redux/actions";
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
import SearchBar from "./SearchBar";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PlayAll from "../PlayAll";
import Switch from "@material-ui/core/Switch";
import TagList from "./TagList";
import _ItemTagList from "./ItemTagList";

const SettingsIcon = materialStyled(_SettingsIcon)({
    width: 40,
    cursor: "pointer"
});

const ItemTagList = styled(_ItemTagList)`
    margin: 0 2px;
`;

const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
`;

const Tags = styled.div`
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
`;

const TagsWithButton = styled.div`
    display: flex;
    overflow: hidden;
    align-items: center;
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
        width: 160,
        headerRenderer: () => <SearchBar />,
        disableSort: true,
        flexGrow: 5
    }
];

const ColumnCellRenderer = ({ cellData }) => <Typography variant="caption">{cellData}</Typography>;
const HeaderCellRenderer = ({ label, dataKey, sortIndicator }) => (
    <HeaderCell>
        <Typography title={label}>{label}</Typography>
        <Typography>{sortIndicator && sortIndicator}</Typography>
    </HeaderCell>
);

const RowRenderer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const Loader = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;
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
        rowHeight: 80,
        headerHeight: 32,
        rowRenderer: ({ style, onRowClick, ...props }) => {
            const { index, rowData } = props;
            const {
                meta: { genres }
            } = rowData;
            return (
                <RowRenderer onClick={event => onRowClick({ event, index, rowData })} style={style}>
                    {defaultTableRowRenderer(props)}
                    <ItemTagList genres={genres} />
                </RowRenderer>
            );
        }
    };

    state = {
        showSettings: false
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

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

    showSettings = () => this.setState({ showSettings: true });
    hideSettings = () => this.setState({ showSettings: false });

    // TODO: Use html encode library, he to encode strings
    render() {
        const {
            tableData,
            genreColors,
            queryParams,
            newReleasesTableShowColors,
            newReleasesTableShowAllTracks,
            toggleNewReleaseColors,
            playAllUris,
            loading
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
            <NewReleasesAlbumsTableWrapper>
                <TagsWithButton>
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
                    <SettingsIcon
                        color="action"
                        onClick={this.state.showSettings ? this.hideSettings : this.showSettings}
                    />
                </TagsWithButton>
                {this.state.showSettings && (
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
                )}
                {loading ? (
                    <Loader>
                        <CircularProgress size={80} color="primary" />
                    </Loader>
                ) : (
                    <Table
                        itemRenderer={({ style, ...props }) => {
                            console.log(props);
                            return <div style={style}>"hi"</div>;
                        }}
                        tableData={tableData}
                        prefixColumnsProps={prefixColumnsProps}
                        virtualizedConfig={this.virtualizedConfig}
                        columnConfig={this.columnConfig}
                    />
                )}
            </NewReleasesAlbumsTableWrapper>
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
            toggleNewReleaseColors,
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
