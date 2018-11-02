import React, { Component } from "react";
import { compose } from "recompose";
import styled from "styled-components";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByTrackTableDataSelector } from "../../selectors";
import PlayButton from "../Analyzer/PlayButton";
import AddToPlaylistButton from "../AddToPlaylistButton";
import AddToAdvancedSearchButton from "../Analyzer/AddToAdvancedSearchButton";
import StartTreeButton from "../Discover/StartTreeButton";
import Table from "../Table";
import { showSideBar } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";

const ButtonCellRenderer = ({ cellData, rowData: { uri, id } }) => (
    <React.Fragment>
        <PlayButton context_uri={uri} />
    </React.Fragment>
);

const DescriptionContainer = styled.div``;

const AlbumImageCellRenderer = ({ cellData, rowData: { image, artist, type, album } }) => (
    <div>
        <img alt="test" src={image} />;
        <DescriptionContainer>
            {album}
            {artist}
            {type}
        </DescriptionContainer>
    </div>
);

const prefixColumnsProps = [
    {
        cellRenderer: ButtonCellRenderer,
        key: "button"
    },
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album"
    }
];

class NewReleasesTracksTable extends Component {
    virtualizedConfig = {
        onRowClick: ({ event, index, rowData: { uri } }) => this.props.showSideBar("album", uri)
    };

    render() {
        const { tableData } = this.props;
        return (
            <Table
                tableData={tableData}
                prefixColumnsProps={prefixColumnsProps}
                virtualizedConfig={this.virtualizedConfig}
            />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByTrackTableDataSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar }
    )
)(NewReleasesTracksTable);
