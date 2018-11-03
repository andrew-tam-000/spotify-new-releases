import React, { Component } from "react";
import styled from "styled-components";
import { compose, withPropsOnChange } from "recompact";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { queryParamsSelector } from "../selectors";
import { connect } from "react-redux";
import { AutoSizer, Column, Table as _VirtualizedTable, SortIndicator } from "react-virtualized";
import createMultiSort from "./Analyzer/createMultiSort";
import {
    thru,
    intersection,
    size,
    map,
    filter,
    get,
    mapKeys,
    orderBy,
    toLower,
    includes
} from "lodash";
import { push } from "react-router-redux";
import queryString from "query-string";
import { encodedStringifiedToObj } from "../utils";

const VirtualizedTable = styled(_VirtualizedTable)`
    .ReactVirtualized__Table__rowColumn:first-child {
        overflow: initial !important;
    }
`;

class Table extends Component {
    sortState = createMultiSort(
        sortParams =>
            this.props.push({
                search:
                    "?" +
                    queryString.stringify({
                        ...this.props.queryParams,
                        sort: encodeURI(JSON.stringify(sortParams))
                    })
            }),
        mapKeys(
            encodedStringifiedToObj(this.props.queryParams.sort),
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
        const {
            tableData: { rows, config },
            prefixColumnsProps,
            suffixColumnsProps,
            virtualizedConfig
        } = this.props;
        return (
            <React.Fragment>
                <AutoSizer>
                    {({ height }) => (
                        <VirtualizedTable
                            sortBy={undefined}
                            sortDirection={undefined}
                            sort={this.sortState.sort}
                            width={2000}
                            height={height}
                            headerHeight={20}
                            rowHeight={70}
                            rowCount={rows.length}
                            rowGetter={({ index }) => rows[index]}
                            {...virtualizedConfig}
                        >
                            {map(prefixColumnsProps, ({ key, ...prefixColumnProps }) => (
                                <Column
                                    key={key}
                                    headerRenderer={this.headerRenderer}
                                    width={300}
                                    dataKey="noop"
                                    {...prefixColumnProps}
                                />
                            ))}

                            {map(filter(config, column => !get(column, "hidden")), column => (
                                <Column
                                    headerRenderer={this.headerRenderer}
                                    key={column.dataKey}
                                    width={300}
                                    {...column}
                                />
                            ))}

                            {map(suffixColumnsProps, ({ key, ...suffixColumnProps }) => (
                                <Column
                                    key={key}
                                    headerRenderer={this.headerRenderer}
                                    width={300}
                                    dataKey="noop"
                                    {...suffixColumnProps}
                                />
                            ))}
                        </VirtualizedTable>
                    )}
                </AutoSizer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    queryParams: queryParamsSelector
});

export default compose(
    connect(
        mapStateToProps,
        { push }
    ),
    withPropsOnChange(
        ["queryParams", "tableData"],
        ({ queryParams: { search, sort, tags }, tableData: { rows, ...tableData } }) =>
            thru(
                [encodedStringifiedToObj(tags), encodedStringifiedToObj(sort)],
                ([tags, { sortBy, sortDirection }]) => ({
                    tableData: {
                        ...tableData,
                        rows: orderBy(
                            // tags
                            filter(
                                // Search bar
                                filter(
                                    rows,
                                    row =>
                                        search
                                            ? includes(
                                                  toLower(JSON.stringify(row)),
                                                  toLower(search)
                                              )
                                            : true
                                ),
                                row => (size(tags) ? size(intersection(row.genres, tags)) : true)
                            ),
                            sortBy,
                            map(sortBy, sort => toLower(sortDirection[sort]))
                        )
                    }
                })
            )
    )
)(Table);
