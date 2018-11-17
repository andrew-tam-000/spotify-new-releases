import React, { Component } from "react";
import styled from "styled-components";
import { compose } from "recompact";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { AutoSizer, Column, Table as _VirtualizedTable, SortIndicator } from "react-virtualized";
import { map, filter, get, mapKeys } from "lodash";
import { push } from "react-router-redux";
import qs from "qs";

import "react-virtualized/styles.css";

import createMultiSort from "./Analyzer/createMultiSort";
import { queryParamsSelector } from "../selectors";
import { encodedStringifiedToObj } from "../utils";

const VirtualizedTable = styled(_VirtualizedTable)`
    .ReactVirtualized__Table__rowColumn:first-child {
        overflow: initial !important;
    }
    .ReactVirtualized__Table__headerRow {
        text-transform: inherit !important;
        font-weight: inherit !important;
    }
`;

const TableWrapper = styled.div`
    flex: 1;
`;

class Table extends Component {
    sortState = createMultiSort(
        // Don't do anything if we have a noop
        sortParams =>
            this.props.push({
                search:
                    "?" +
                    qs.stringify({
                        ...this.props.queryParams,
                        sort: encodeURI(JSON.stringify(sortParams))
                    })
            }),
        mapKeys(
            encodedStringifiedToObj(this.props.queryParams.sort),
            (val, key) => (key === "sortBy" ? "defaultSortBy" : "defaultSortDirection")
        )
    );

    headerRenderer = data => {
        const { dataKey, label } = data;
        const headerRenderer = get(this.props, "columnConfig.headerRenderer");
        const showSortIndicator = this.sortState.sortBy.includes(dataKey);
        //TODO: Don't use this - because the sort is kept in state
        const sortIndicator = showSortIndicator && (
            <SortIndicator sortDirection={this.sortState.sortDirection[dataKey]} />
        );
        return headerRenderer ? headerRenderer({ ...data, sortIndicator }) : <span>{label}</span>;
    };

    render() {
        const {
            tableData: { rows, config },
            prefixColumnsProps,
            suffixColumnsProps,
            columnConfig,
            virtualizedConfig
        } = this.props;
        return (
            <TableWrapper>
                <AutoSizer>
                    {({ height, width }) => (
                        <VirtualizedTable
                            sortBy={undefined}
                            sortDirection={undefined}
                            sort={this.sortState.sort}
                            width={width}
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
                                    width={300}
                                    dataKey="noop"
                                    flexGrow={1}
                                    {...columnConfig}
                                    headerRenderer={this.headerRenderer}
                                    {...prefixColumnProps}
                                />
                            ))}

                            {map(filter(config, column => !get(column, "hidden")), column => (
                                <Column
                                    key={column.dataKey}
                                    width={300}
                                    flexGrow={1}
                                    {...columnConfig}
                                    headerRenderer={this.headerRenderer}
                                    {...column}
                                />
                            ))}

                            {map(suffixColumnsProps, ({ key, ...suffixColumnProps }) => (
                                <Column
                                    key={key}
                                    width={300}
                                    dataKey="noop"
                                    flexGrow={1}
                                    {...columnConfig}
                                    headerRenderer={this.headerRenderer}
                                    {...suffixColumnProps}
                                />
                            ))}
                        </VirtualizedTable>
                    )}
                </AutoSizer>
            </TableWrapper>
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
    )
)(Table);
