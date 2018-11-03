import React, { Component } from "react";
import { compose } from "recompose";
import styled from "styled-components";
import "react-virtualized/styles.css";

import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByAlbumTableDataSelector, topNewReleaseGenresSelector } from "../../selectors";
import PlayButton from "../Analyzer/PlayButton";
import AddToPlaylistButton from "../AddToPlaylistButton";
import AddToAdvancedSearchButton from "../Analyzer/AddToAdvancedSearchButton";
import StartTreeButton from "../Discover/StartTreeButton";
import Table from "../Table";
import { showSideBar } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import Tag from "../Table/Tag";
import { map, startCase } from "lodash";
import SearchBar from "../Table/SearchBar";

const ButtonCellRenderer = ({ cellData, rowData: { uri, id } }) => (
    <React.Fragment>
        <PlayButton context_uri={uri} />
        <AddToAdvancedSearchButton id={id} />
        <AddToPlaylistButton uri={uri} />
        <StartTreeButton uri={uri} />
        {cellData}
    </React.Fragment>
);

const DescriptionContainer = styled.div`
    margin-left: 10px;
`;

const AlbumImageCellRendererWrapper = styled.div`
    display: flex;
`;

const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
`;

const AlbumImageCellRenderer = ({ cellData, rowData: { image, artist, type, album } }) => (
    <AlbumImageCellRendererWrapper>
        <img alt="test" src={image} />
        <DescriptionContainer>
            <div> {album}</div>
            <div>{artist}</div>
            <div>{type}</div>
        </DescriptionContainer>
    </AlbumImageCellRendererWrapper>
);

const prefixColumnsProps = [
    {
        cellRenderer: ButtonCellRenderer,
        key: "button",
        width: 150
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
        const { tableData, topNewReleaseGenres } = this.props;
        return (
            <NewReleasesAlbumsTableWrapper>
                <SearchBar />
                <div>
                    {map(topNewReleaseGenres, ({ genre }) => (
                        <Tag id={genre}>{startCase(genre)}</Tag>
                    ))}
                </div>
                <Table
                    tableData={tableData}
                    prefixColumnsProps={prefixColumnsProps}
                    virtualizedConfig={this.virtualizedConfig}
                />
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataSelector,
    topNewReleaseGenres: topNewReleaseGenresSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar }
    )
)(NewReleasesAlbumsTable);
