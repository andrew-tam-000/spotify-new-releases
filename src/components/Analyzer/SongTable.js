import React, { Component } from "react";
import styled from "styled-components";
import { compose, withPropsOnChange } from "recompose";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Column, Table as _Table, SortIndicator } from "react-virtualized";
import {
    songsWithDataByIdSelector,
    analyzerSearchTermSelector,
    songListSelector
} from "../../selectors";
import { analyzerUpdateSearchTerm, analyzerUpdateSort } from "../../redux/actions";
import createMultiSort from "./createMultiSort";
import { reduce, values, map, orderBy, toLower, filter, get } from "lodash";
import TextField from "@material-ui/core/TextField";
import tableConfig from "../../tableConfig";
import PlayButton from "./PlayButton";
import SearchButton from "./SearchButton";

const Table = styled(_Table)`
    .ReactVirtualized__Table__rowColumn:first-child {
        overflow: initial !important;
    }
`;

class SongTable extends Component {
    sortState = createMultiSort(sortParams => this.props.analyzerUpdateSort(sortParams), {
        defaultSortBy: ["title", "artist"],
        defaultSortDirection: {
            artist: "ASC",
            title: "ASC"
        }
    });

    state = {
        sortedList: this.props.songsAsList
    };

    headerRenderer = ({ dataKey, label }) => {
        const showSortIndicator = this.sortState.sortBy.includes(dataKey);
        return (
            <React.Fragment>
                <span title={label}>{label}</span>
                {showSortIndicator && (
                    <SortIndicator sortDirection={this.sortState.sortDirection[dataKey]} />
                )}
            </React.Fragment>
        );
    };

    render() {
        const { analyzerSearchTerm, analyzerUpdateSearchTerm, songList } = this.props;
        return (
            <React.Fragment>
                <TextField value={analyzerSearchTerm} onChange={analyzerUpdateSearchTerm} />
                <Table
                    sortBy={undefined}
                    sortDirection={undefined}
                    sort={this.sortState.sort}
                    width={2000}
                    height={300}
                    headerHeight={20}
                    rowHeight={60}
                    rowCount={songList.length}
                    rowGetter={({ index }) => songList[index]}
                >
                    <Column
                        headerRenderer={this.headerRenderer}
                        width={200}
                        cellRenderer={({ cellData, rowData: { uri, id } }) => (
                            <React.Fragment>
                                <PlayButton uri={uri} />
                                <SearchButton id={id} />
                                {cellData}
                            </React.Fragment>
                        )}
                    />
                    {map(filter(tableConfig, config => !get(config, "hidden")), config => (
                        <Column
                            headerRenderer={this.headerRenderer}
                            key={config.dataKey}
                            width={300}
                            {...config}
                        />
                    ))}
                </Table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector,
    analyzerSearchTerm: analyzerSearchTermSelector,
    songList: songListSelector
});

export default compose(
    connect(
        mapStateToProps,
        dispatch => ({
            analyzerUpdateSearchTerm: e => dispatch(analyzerUpdateSearchTerm(e.target.value)),
            analyzerUpdateSort: sortParams => dispatch(analyzerUpdateSort(sortParams))
        })
    ),
    withPropsOnChange(["songsWithDataById"], ({ songsWithDataById }) => ({
        songsAsList: map(values(songsWithDataById), song =>
            reduce(
                tableConfig,
                (agg, { getter, dataKey, ...props }) => ({
                    ...agg,
                    ...props,
                    [dataKey]: get(song, getter())
                }),
                {}
            )
        )
    }))
)(SongTable);
