import React, { Component } from "react";
import { compose, withPropsOnChange } from "recompose";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Column, Table, SortIndicator } from "react-virtualized";
import { songsWithDataByIdSelector, analyzerSearchTermSelector } from "../../selectors";
import { analyzerUpdateSearchTerm } from "../../redux/actions";
import createMultiSort from "./createMultiSort";
import { reduce, values, map, orderBy, toLower, filter, get } from "lodash";
import PlayButton from "./PlayButton";
import SearchButton from "./SearchButton";
import TextField from "@material-ui/core/TextField";

export const tableConfig = [
    {
        label: "Title",
        dataKey: "title",
        getter: () => "songDetails.track.name",
        cellRenderer: ({ cellData, rowData: { uri, id } }) => (
            <React.Fragment>
                <PlayButton uri={uri} />
                <SearchButton id={id} />
                {cellData}
            </React.Fragment>
        )
    },
    {
        dataKey: "uri",
        getter: () => "songDetails.track.uri",
        hidden: true
    },
    {
        dataKey: "id",
        getter: () => "songDetails.track.id",
        hidden: true
    },
    {
        label: "Artist",
        dataKey: "artist",
        getter: () => "songDetails.track.artists.0.name"
    },
    {
        label: "Popularity",
        dataKey: "popularity",
        getter: () => "songDetails.track.popularity",
        tunable: true,
        tolerance: 0,
        min: 0,
        max: 100
    },
    {
        label: "Genre",
        dataKey: "genre",
        getter: () => "artistDetails.genres.0"
    },
    {
        label: "Danceability",
        dataKey: "danceability",
        getter: () => "songAnalysis.danceability",
        tunable: true
    },
    {
        label: "Energy",
        dataKey: "energy",
        getter: () => "songAnalysis.energy",
        tunable: true
    },
    {
        label: "Loudness",
        dataKey: "loudness",
        getter: () => "songAnalysis.loudness",
        tunable: true,
        tolerance: 0,
        min: -60,
        max: 0
    },
    {
        label: "Speechiness",
        dataKey: "speechiness",
        getter: () => "songAnalysis.speechiness",
        tunable: true
    },
    {
        label: "Acousticness",
        dataKey: "acousticness",
        getter: () => "songAnalysis.acousticness",
        tunable: true
    },
    {
        label: "Instrumentalness",
        dataKey: "instrumentalness",
        getter: () => "songAnalysis.instrumentalness",
        tunable: true
    },
    {
        label: "Liveness",
        dataKey: "liveness",
        getter: () => "songAnalysis.liveness",
        tunable: true
    },
    {
        label: "Valence",
        dataKey: "valence",
        getter: () => "songAnalysis.valence",
        tunable: true
    },
    {
        label: "Tempo",
        dataKey: "tempo",
        getter: () => "songAnalysis.tempo",
        tunable: true,
        min: 0,
        max: 300
    }
];

class SongTable extends Component {
    sortState = createMultiSort(
        ({ sortBy, sortDirection }) => {
            console.log(sortBy, map(sortBy, sort => sortDirection[sort]));
            const sortedList = orderBy(
                this.props.songsAsList,
                sortBy,
                map(sortBy, sort => toLower(sortDirection[sort]))
            );
            this.setState({ sortedList });
        },
        {
            defaultSortBy: ["title", "artist"],
            defaultSortDirection: {
                artist: "ASC",
                title: "ASC"
            }
        }
    );

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
        const { analyzerSearchTerm, analyzerUpdateSearchTerm } = this.props;
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
                    rowHeight={30}
                    rowCount={this.state.sortedList.length}
                    rowGetter={({ index }) => this.state.sortedList[index]}
                >
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
    analyzerSearchTerm: analyzerSearchTermSelector
});

export default compose(
    connect(
        mapStateToProps,
        dispatch => ({
            analyzerUpdateSearchTerm: e => dispatch(analyzerUpdateSearchTerm(e.target.value))
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
