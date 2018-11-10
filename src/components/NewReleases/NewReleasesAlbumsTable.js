import React, { Component } from "react";
import { defaultTableHeaderRowRenderer } from "react-virtualized";
import { compose } from "recompose";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
    newReleasesByAlbumTableDataWithFiltersSelector,
    topNewReleaseGenresSelector,
    queryParamsSelector,
    availableGenresSelector
} from "../../selectors";
import Autocomplete from "../Table/Autocomplete";
import Table from "../Table";
import { showSideBar } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import Tag from "../Table/Tag";
import { map, get, size, join, first, difference, filter, find, compact } from "lodash";
import SearchBar from "../Table/SearchBar";
import { encodedStringifiedToObj } from "../../utils";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";

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

const prefixColumnsProps = [
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album",
        width: 140,
        headerRenderer: () => <SearchBar />,
        disableSort: true
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
        rowHeight: 50,
        headerHeight: 32,
        headerRenderer: HeaderRowRenderer
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
                <TagsWithButton>
                    <Button mini variant="fab" color="primary" aria-label="Add">
                        <AddIcon />
                    </Button>
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
                </TagsWithButton>
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
