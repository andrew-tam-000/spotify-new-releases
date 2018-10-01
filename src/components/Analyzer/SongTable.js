import React, { Component } from "react";
import styled from "styled-components";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Column, Table as _Table, SortIndicator } from "react-virtualized";
import { analyzerSortSelector, librarySongListSelector } from "../../selectors";
import { analyzerUpdateSort } from "../../redux/actions";
import createMultiSort from "./createMultiSort";
import { map, filter, get, mapKeys } from "lodash";
import tableConfig from "../../tableConfig";
import PlayButton from "./PlayButton";
import AddToPlaylistButton from "../AddToPlaylistButton";
import AddToAdvancedSearchButton from "./AddToAdvancedSearchButton";
import TextField from "@material-ui/core/TextField";
import { analyzerSearchTermSelector } from "../../selectors";
import { analyzerUpdateSearchTerm } from "../../redux/actions";

const Table = styled(_Table)`
    .ReactVirtualized__Table__rowColumn:first-child {
        overflow: initial !important;
    }
`;

const ButtonCellRenderer = ({ cellData, rowData: { uri, id } }) => (
    <React.Fragment>
        <PlayButton uri={uri} />
        <AddToAdvancedSearchButton id={id} />
        <AddToPlaylistButton uri={uri} />
        {cellData}
    </React.Fragment>
);

class SongTable extends Component {
    sortState = createMultiSort(
        sortParams => this.props.analyzerUpdateSort(sortParams),
        mapKeys(
            this.props.analyzerSort,
            (val, key) => (key === "sortBy" ? "defaultSortBy" : "defaultSortDirection")
        )
    );

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
        const { librarySongList, analyzerSearchTerm, analyzerUpdateSearchTerm } = this.props;
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
                    rowCount={librarySongList.length}
                    rowGetter={({ index }) => librarySongList[index]}
                >
                    <Column
                        headerRenderer={this.headerRenderer}
                        width={300}
                        cellRenderer={ButtonCellRenderer}
                        dataKey="noop"
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
    analyzerSort: analyzerSortSelector,
    librarySongList: librarySongListSelector,
    analyzerSearchTerm: analyzerSearchTermSelector
});

export default connect(
    mapStateToProps,
    dispatch => ({
        analyzerUpdateSort: sortParams => dispatch(analyzerUpdateSort(sortParams)),
        analyzerUpdateSearchTerm: e => dispatch(analyzerUpdateSearchTerm(e.target.value))
    })
)(SongTable);
