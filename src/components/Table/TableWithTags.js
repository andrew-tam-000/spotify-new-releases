import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import TagList from "./TagList";
import { compose } from "recompact";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stars from "@material-ui/icons/Stars";
import PersonIcon from "@material-ui/icons/Person";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import { AutoSizer } from "react-virtualized";
import {
    toggleNewReleaseAlbum,
    toggleNewReleaseSong,
    reorderTags,
    openNewReleaseModal,
    reorderQueryTags,
    setLocalStorage,
    getSongsStart,
    getNewReleasesStart,
    toggleSort,
    getTracksStart,
    playSongStart
} from "../../redux/actions";
import {
    filter,
    range,
    slice,
    get,
    size,
    join,
    first,
    map,
    findLastIndex,
    findIndex,
    findLast,
    find,
    includes,
    flatMap,
    noop
} from "lodash";
import SearchBar from "./SearchBar";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import ItemTagList from "./ItemTagList";
import Settings from "./Settings";
import NewReleasesAddTagModal from "../NewReleases/NewReleasesAddTagModal";
import {
    albumsSelector,
    genreColorsSelector,
    queryParamsTagsSelector,
    queryParamsSortSelector,
    routerPathnameSelector
} from "../../selectors";
import materialStyled from "../../materialStyled";
import _Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import { FixedSizeList } from "react-window";
import Date from "./Date";

const Button = materialStyled(_Button)({
    minWidth: 30
});

const buttonStyles = {
    color: "white",
    cursor: "pointer",
    marginRight: "10px"
};

const DateHeader = styled.div`
    display: flex;
    align-items: center;
`;

const PlayButton = materialStyled(PlayCircleOutlineIcon)(buttonStyles);

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

const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
`;

const SearchColumn = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Loader = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const Columns = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const PopularityCell = styled.div`
    flex: 1 1 35px;
`;

const InfoColumn = styled(AlbumImageCellRenderer)`
    flex: 10 1 160px;
`;

const PlainInfoColumn = styled.div`
    flex: 10 1 160px;
`;

const TableWrapper = styled.div`
    flex: 1;
`;

const _RowRenderer = connect(
    createStructuredSelector({
        genreColors: genreColorsSelector,
        routerPathname: routerPathnameSelector,
        queryParamsTags: queryParamsTagsSelector,
        albums: albumsSelector
    }),
    {
        toggleNewReleaseAlbum,
        toggleNewReleaseSong,
        reorderTags,
        reorderQueryTags,
        openNewReleaseModal,
        setLocalStorage,
        getSongsStart,
        getNewReleasesStart,
        getTracksStart
    }
)(
    class _RowRenderer extends Component {
        getItem = () => get(this.props.data, `rows.${this.props.index}`) || {};

        handleClick = () => {
            const {
                meta: { cellType },
                id
            } = this.getItem();
            return cellType === "album"
                ? [
                      this.props.toggleNewReleaseAlbum(id),
                      this.props.getTracksStart(
                          map(get(this.props.albums, `${id}.tracks.items`), "id")
                      )
                  ]
                : cellType === "track"
                    ? this.props.toggleNewReleaseSong(id)
                    : noop;
        };

        rowStyle = () => {
            const { style } = this.props;
            const backgroundColors = get(this.getItem(), "meta.backgroundColors");
            const linearGradientString = join(backgroundColors, ", ");

            return {
                ...style,
                ...(size(backgroundColors)
                    ? {
                          background:
                              size(backgroundColors) > 1
                                  ? `linear-gradient(90deg, ${linearGradientString})`
                                  : first(backgroundColors)
                      }
                    : {})
            };
        };

        render() {
            const { className, data, index } = this.props;
            const { albumPopularity, artistPopularity, meta: { genres } = {} } = this.getItem();

            return (
                <div onClick={this.handleClick} className={className} style={this.rowStyle()}>
                    <Columns>
                        <InfoColumn data={data} index={index} />
                        <PopularityCell>
                            <Typography variant="caption">{albumPopularity}</Typography>
                        </PopularityCell>
                        <PopularityCell>
                            <Typography variant="caption">{artistPopularity}</Typography>
                        </PopularityCell>
                    </Columns>
                    <ItemTagList genres={genres} />
                </div>
            );
        }
    }
);

const RowRenderer = styled(_RowRenderer)`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const SortColumn = connect(
    createStructuredSelector({
        queryParamsSort: queryParamsSortSelector
    }),
    {
        toggleSort
    }
)(function SortColumn({ toggleSort, queryParamsSort, className, children, name }) {
    return (
        <div className={className} onClick={() => toggleSort(name)}>
            {children}
            {get(queryParamsSort, `sortDirection.${name}`) === "DESC" ? (
                <ExpandMoreIcon fontSize="small" color="action" />
            ) : get(queryParamsSort, `sortDirection.${name}`) === "ASC" ? (
                <ExpandLessIcon fontSize="small" color="action" />
            ) : null}
        </div>
    );
});

const PopularityColumn = styled(SortColumn)`
    flex: 1 1 35px;
`;

class NewReleasesAlbumsTable extends Component {
    handleQueryTagSort = ({ oldIndex, newIndex }) =>
        this.props.reorderQueryTags(oldIndex, newIndex);

    refreshData = () => {
        const { setLocalStorage, routerPathname, getNewReleasesStart, getSongsStart } = this.props;
        const mode = includes(routerPathname, "new-release")
            ? "newRelease"
            : includes(routerPathname, "analyzer")
                ? "library"
                : null;

        if (mode) {
            if (mode === "newRelease") {
                setLocalStorage("newReleaseData", "", new Date().getTime() + 1000 * 60 * 60 * 24);
                getNewReleasesStart();
            } else if (mode === "library") {
                setLocalStorage("library", "", new Date().getTime() + 1000 * 60 * 60 * 24);
                getSongsStart();
            }
        }
    };

    handleItemsRendered = params => {
        const { visibleStartIndex } = params;
        const nextDate =
            findIndex(
                this.props.tableData.rows,
                ({ meta: { cellType } }) => cellType === "date",
                visibleStartIndex + 2
            ) || this.props.tableData.rows.length - 1;
        const previousDate =
            findLastIndex(
                this.props.tableData.rows,
                ({ meta: { cellType } }) => cellType === "date",
                visibleStartIndex + 1
            ) || 0;

        this.props.onItemsRendered && this.props.onItemsRendered(params);
        // Set the date, and also try to fetch data
        this.setState({
            currentDate: get(
                findLast(
                    this.props.tableData.rows,
                    ({ meta: { cellType } }) => cellType === "date",
                    visibleStartIndex + 1
                ),
                "releaseDate"
            ),
            rowsForDate: range(previousDate + 1, nextDate)
        });
    };

    state = {
        currentDate: null,
        rowsForDate: []
    };

    /*
    getItemSize = index =>
        // TODO: Fix bug where dropdown doeesn't work properly
        get(this.props.tableData.rows[index], "meta.cellType") === "date" ? 80 : 80;
        */

    getItemSize = 80;

    playSongsForDate = () => {
        const albumIds = map(
            filter(
                map(this.state.rowsForDate, rowIdx => this.props.tableData.rows[rowIdx]),
                rowData => get(rowData, "meta.cellType") === "album"
            ),
            "id"
        );

        this.props.playSongStart({
            uris: flatMap(albumIds, albumId =>
                map(get(this.props.albums, `${albumId}.tracks.items`), "uri")
            )
        });
    };

    render() {
        const {
            openNewReleaseModal,
            tableData,
            loading,
            genreColors,
            queryParamsTags
        } = this.props;

        const active = map(
            queryParamsTags,
            tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre) || {
                    genre: tagGenre
                }
        );
        return (
            <NewReleasesAlbumsTableWrapper>
                {loading ? (
                    <Loader>
                        <CircularProgress size={80} color="primary" />
                    </Loader>
                ) : (
                    <React.Fragment>
                        <NewReleasesAddTagModal />
                        <TagsWithButton>
                            <Button size="small" onClick={openNewReleaseModal}>
                                <AddIcon fontSize="small" color="action" />
                                {size(active) ? "" : "Add Genre"}
                            </Button>
                            <Tags>
                                <TagList
                                    axis="x"
                                    lockAxis="x"
                                    tags={active}
                                    onSortEnd={this.handleQueryTagSort}
                                    useDragHandle={true}
                                />
                            </Tags>
                            <IconButton onClick={this.refreshData}>
                                <RefreshIcon fontSize="small" color="action" />
                            </IconButton>
                        </TagsWithButton>
                        <Columns>
                            <PlainInfoColumn>
                                <SearchColumn>
                                    <Settings tableData={tableData} />
                                    <NewReleasesAddTagModal />
                                    <SearchBar />
                                </SearchColumn>
                            </PlainInfoColumn>
                            <PopularityColumn name="albumPopularity">
                                <Stars fontSize="small" color="action" />
                            </PopularityColumn>
                            <PopularityColumn name="artistPopularity">
                                <PersonIcon fontSize="small" color="action" />
                            </PopularityColumn>
                        </Columns>
                        {this.state.currentDate ? (
                            <DateHeader>
                                <PlayButton onClick={this.playSongsForDate} />
                                <Date date={this.state.currentDate} />{" "}
                            </DateHeader>
                        ) : null}
                        <TableWrapper>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <FixedSizeList
                                        onItemsRendered={this.handleItemsRendered}
                                        itemSize={this.getItemSize}
                                        itemData={{
                                            ...tableData,
                                            rows: slice(tableData.rows, 1)
                                        }}
                                        height={height}
                                        itemCount={size(slice(tableData.rows, 1))}
                                        width={width}
                                    >
                                        {RowRenderer}
                                    </FixedSizeList>
                                )}
                            </AutoSizer>
                        </TableWrapper>
                    </React.Fragment>
                )}
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

export default compose(
    connect(
        createStructuredSelector({
            genreColors: genreColorsSelector,
            routerPathname: routerPathnameSelector,
            queryParamsTags: queryParamsTagsSelector,
            albums: albumsSelector
        }),
        {
            toggleNewReleaseAlbum,
            toggleNewReleaseSong,
            reorderTags,
            reorderQueryTags,
            openNewReleaseModal,
            setLocalStorage,
            getSongsStart,
            getNewReleasesStart,
            playSongStart
        }
    )
)(NewReleasesAlbumsTable);
