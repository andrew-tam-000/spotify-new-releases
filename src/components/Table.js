import React, { Component } from "react";
import styled from "styled-components";
import { compose, withPropsOnChange } from "recompose";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { queryParamsSelector } from "../selectors";
import { connect } from "react-redux";
import { Column, Table as _VirtualizedTable, SortIndicator } from "react-virtualized";
import createMultiSort from "./Analyzer/createMultiSort";
import { map, filter, get, mapKeys, orderBy, toLower, includes } from "lodash";
import TextField from "@material-ui/core/TextField";
import { push } from "react-router-redux";
import queryString from "query-string";

const VirtualizedTable = styled(_VirtualizedTable)`
    .ReactVirtualized__Table__rowColumn:first-child {
        overflow: initial !important;
    }
`;

const encodedStringifiedToObj = encodedStringified =>
    JSON.parse(encodedStringified ? decodeURI(encodedStringified) : "{}");

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

    updateSearch = e =>
        this.props.push({
            search:
                "?" +
                queryString.stringify({
                    ...this.props.queryParams,
                    search: e.target.value
                })
        });

    render() {
        const {
            tableData: { rows, config },
            queryParams: { search },
            prefixColumnsProps,
            suffixColumnsProps,
            virtualizedConfig
        } = this.props;
        return (
            <React.Fragment>
                <TextField value={search} onChange={this.updateSearch} />
                <VirtualizedTable
                    sortBy={undefined}
                    sortDirection={undefined}
                    sort={this.sortState.sort}
                    width={2000}
                    height={300}
                    headerHeight={20}
                    rowHeight={60}
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
        ({ queryParams: { search, sort }, tableData: { rows, ...tableData } }) => {
            const { sortBy, sortDirection } = encodedStringifiedToObj(sort);

            return {
                tableData: {
                    ...tableData,
                    rows: orderBy(
                        filter(
                            rows,
                            row =>
                                search
                                    ? includes(toLower(JSON.stringify(row)), toLower(search))
                                    : true
                        ),
                        sortBy,
                        map(sortBy, sort => toLower(sortDirection[sort]))
                    )
                }
            };
        }
    )
)(Table);
