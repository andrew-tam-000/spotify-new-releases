import React, { Component } from "react";
import { compose } from "recompose";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByAlbumTableDataSelector } from "../../selectors";
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
        <AddToAdvancedSearchButton id={id} />
        <AddToPlaylistButton uri={uri} />
        <StartTreeButton uri={uri} />
        {cellData}
    </React.Fragment>
);

const AlbumImageCellRenderer = ({ cellData, rowData: { image } }) => <img alt="test" src={image} />;

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

class NewReleasesAlbumsTable extends Component {
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
    tableData: newReleasesByAlbumTableDataSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar }
    )
)(NewReleasesAlbumsTable);
