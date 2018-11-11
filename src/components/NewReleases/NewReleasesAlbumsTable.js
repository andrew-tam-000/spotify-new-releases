import React, { Component } from "react";
import { defaultTableHeaderRowRenderer } from "react-virtualized";
import { compose } from "recompose";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import NewReleasesAddTagModal from "./NewReleasesAddTagModal";
import {
    newReleasesByAlbumTableDataWithFiltersSelector,
    genreColorsSelector,
    queryParamsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector
} from "../../selectors";
import Table from "../Table";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    toggleShowAllNewReleaseTracks,
    toggleNewReleaseColors,
    openNewReleaseModal,
    closeNewReleaseModal
} from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import TagProvider from "../Table/TagProvider";
import { noop, map, get, size, join, first, difference, find, compact } from "lodash";
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
import Switch from "@material-ui/core/Switch";

const Tag = styled.span.attrs({
    fontWeight: props => (props.active ? 600 : 400)
})`
    background-color: ${props => props.backgroundColor};
    padding: 10px;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
`;

const HeaderRowRenderer = styled(defaultTableHeaderRowRenderer)`
    display: flex;
`;
const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
    background-color: #757575;
`;

const Tags = styled.div`
    display: flex;
    flex-wrap: none;
    overflow: auto;
    flex: 1;
    > * {
        flex: 1;
    }
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
        headerHeight: 32,
        headerRenderer: HeaderRowRenderer
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    openNewReleaseModal = () => this.props.openNewReleaseModal();

    // TODO: Use html encode library, he to encode strings
    render() {
        const {
            tableData,
            genreColors,
            queryParams,
            newReleasesTableShowColors,
            newReleasesTableShowAllTracks,
            toggleShowAllNewReleaseTracks,
            toggleNewReleaseColors,
            closeNewReleaseModal
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
                        {map(active, ({ genre, color }) => (
                            <TagProvider id={genre} backgroundColor={color}>
                                {({ active, onClick }) => (
                                    <Tag onClick={onClick} active={active} backgroundColor={color}>
                                        <Typography>{genre}</Typography>
                                    </Tag>
                                )}
                            </TagProvider>
                        ))}
                        {active.length ? <ActiveDivider /> : null}
                        {map(inactive, ({ genre, color }) => (
                            <TagProvider id={genre}>
                                {({ active, onClick }) => (
                                    <Tag onClick={onClick} active={active} backgroundColor={color}>
                                        <Typography>{genre}</Typography>
                                    </Tag>
                                )}
                            </TagProvider>
                        ))}
                    </Tags>
                </TagsWithButton>
                <Settings>
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
                            onChange={toggleShowAllNewReleaseTracks}
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
    newReleasesTableShowAllTracks: newReleasesTableShowAllTracksSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        {
            showSideBar,
            addGenreColors,
            toggleNewReleaseAlbum,
            toggleShowAllNewReleaseTracks,
            toggleNewReleaseColors,
            openNewReleaseModal,
            closeNewReleaseModal
        }
    )
)(NewReleasesAlbumsTable);
