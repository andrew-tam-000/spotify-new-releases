import React, { Component } from "react";
import { compose } from "recompose";
import styled from "styled-components";
import "react-virtualized/styles.css";
import materialStyled from "../../materialStyled";

import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
    newReleasesByAlbumTableDataWithFiltersSelector,
    topNewReleaseGenresSelector,
    queryParamsSelector,
    availableGenresSelector
} from "../../selectors";
import PlayButton from "../Analyzer/PlayButton";
import Autocomplete from "../Table/Autocomplete";
import AddToPlaylistButton from "../AddToPlaylistButton";
import AddToAdvancedSearchButton from "../Analyzer/AddToAdvancedSearchButton";
import StartTreeButton from "../Discover/StartTreeButton";
import Table from "../Table";
import { showSideBar } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import Tag from "../Table/Tag";
import {
    map,
    startCase,
    get,
    size,
    join,
    first,
    includes,
    reduce,
    difference,
    filter,
    find,
    compact
} from "lodash";
import SearchBar from "../Table/SearchBar";
import { encodedStringifiedToObj } from "../../utils";

// <AddToAdvancedSearchButton id={id} />
// <AddToPlaylistButton uri={uri} />
// <StartTreeButton uri={uri} />
const ButtonCellRenderer = ({ cellData, rowData: { uri, id } }) => (
    <React.Fragment>
        <PlayButton context_uri={uri} />
    </React.Fragment>
);

const AlbumImageCellRendererWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
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
    > * {
        flex: 1;
    }
`;

const ActiveDivider = styled.div`
    min-width: 20px;
    max-width: 20px;
`;

const AlbumImage = styled.img`
    height: 40px;
    margin-right: 5px;
`;

const AlbumTitle = materialStyled(Typography)({
    lineHeight: 1
});

const Description = styled.div`
    overflow: hidden;
`;

// TODO: Add a way to have custom tags
const AlbumImageCellRenderer = ({ cellData, rowData: { image, artist, type, album } }) => (
    <AlbumImageCellRendererWrapper>
        <AlbumImage alt="test" src={image} />
        <Description>
            <Typography noWrap={true}>{artist}</Typography>
            <AlbumTitle noWrap={true} variant="overline">
                {album}
            </AlbumTitle>
            <Typography noWrap={true} variant="caption">
                {type}
            </Typography>
        </Description>
    </AlbumImageCellRendererWrapper>
);

const HeaderCell = styled.div`
    display: flex;
`;

const prefixColumnsProps = [
    /*
    {
        cellRenderer: ButtonCellRenderer,
        key: "button",
        width: 50
    },
    */
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album"
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
        onRowClick: ({ event, index, rowData: { uri } }) => this.props.showSideBar("album", uri),
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
        rowHeight: 50
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    // TODO: Use html encode library, he to encode strings
    render() {
        const { tableData, topNewReleaseGenres, queryParams, availableGenres } = this.props;
        const active = compact(
            map(encodedStringifiedToObj(queryParams.tags, []), tagGenre =>
                find(topNewReleaseGenres, ({ genre }) => genre === tagGenre)
            )
        );
        const inactive = difference(topNewReleaseGenres, active);
        return (
            <NewReleasesAlbumsTableWrapper>
                <SearchBar />
                <Typography>Top Genres</Typography>
                <Tags>
                    {map(active, ({ genre, backgroundColor }) => (
                        <Tag id={genre} backgroundColor={backgroundColor}>
                            <Typography>{genre}</Typography>
                        </Tag>
                    ))}
                    {active.length ? <ActiveDivider /> : null}
                    {map(inactive, ({ genre, backgroundColor }) => (
                        <Tag id={genre} backgroundColor={backgroundColor}>
                            <Typography>{genre}</Typography>
                        </Tag>
                    ))}
                </Tags>
                <Typography>Custom Genres</Typography>
                <Autocomplete
                    options={map(
                        filter(
                            availableGenres,
                            availableGenre =>
                                !find(
                                    topNewReleaseGenres,
                                    topGenre => topGenre.genre === availableGenre.genre
                                )
                        ),
                        ({ genre }) => ({ value: genre, label: genre })
                    )}
                />
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
    topNewReleaseGenres: topNewReleaseGenresSelector,
    queryParams: queryParamsSelector,
    availableGenres: availableGenresSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar }
    )
)(NewReleasesAlbumsTable);
