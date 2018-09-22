import React, { Component } from "react";
import { compose, withPropsOnChange } from "recompose";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Column, Table, SortIndicator } from "react-virtualized";
import { songsWithDataByIdSelector } from "../../selectors";
import createMultiSort from "./createMultiSort";
import _ from "lodash";
import PlayButton from "./PlayButton";
import SearchButton from "./SearchButton";

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
        getter: () => "songDetails.track.popularity"
    },
    {
        label: "Genre",
        dataKey: "genre",
        getter: () => "artistDetails.genres.0"
    },
    {
        label: "Danceability",
        dataKey: "danceability",
        getter: () => "songAnalysis.danceability"
    },
    {
        label: "Energy",
        dataKey: "energy",
        getter: () => "songAnalysis.energy"
    },
    {
        label: "Loudness",
        dataKey: "loudness",
        getter: () => "songAnalysis.loudness"
    },
    {
        label: "Speechiness",
        dataKey: "speechiness",
        getter: () => "songAnalysis.speechiness"
    },
    {
        label: "Acousticness",
        dataKey: "acousticness",
        getter: () => "songAnalysis.acousticness"
    },
    {
        label: "Instrumentalness",
        dataKey: "instrumentalness",
        getter: () => "songAnalysis.instrumentalness"
    },
    {
        label: "Liveness",
        dataKey: "liveness",
        getter: () => "songAnalysis.liveness"
    },
    {
        label: "Valence",
        dataKey: "valence",
        getter: () => "songAnalysis.valence"
    },
    {
        label: "Tempo",
        dataKey: "tempo",
        getter: () => "songAnalysis.tempo"
    }
];

class SongTable extends Component {
    sortState = createMultiSort(
        ({ sortBy, sortDirection }) => {
            console.log(sortBy, _.map(sortBy, sort => sortDirection[sort]));
            const sortedList = _.orderBy(
                this.props.songsAsList,
                sortBy,
                _.map(sortBy, sort => _.toLower(sortDirection[sort]))
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
        return (
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
                {_.map(_.filter(tableConfig, config => !_.get(config, "hidden")), config => (
                    <Column
                        headerRenderer={this.headerRenderer}
                        key={config.dataKey}
                        width={300}
                        {...config}
                    />
                ))}
            </Table>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    songsWithDataById: songsWithDataByIdSelector
});

export default compose(
    connect(mapStateToProps),
    withPropsOnChange(["songsWithDataById"], ({ songsWithDataById }) => ({
        songsAsList: _.map(_.values(songsWithDataById), song =>
            _.reduce(
                tableConfig,
                (agg, { getter, dataKey, ...props }) => ({
                    ...agg,
                    ...props,
                    [dataKey]: _.get(song, getter())
                }),
                {}
            )
        )
    }))
)(SongTable);
