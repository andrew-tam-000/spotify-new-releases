import React, { Component } from "react";
import { compose } from "recompose";
import styled from "styled-components";
import "react-virtualized/styles.css";

import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
    newReleasesByAlbumTableDataWithFiltersSelector,
    topNewReleaseGenresSelector
} from "../../selectors";
import PlayButton from "../Analyzer/PlayButton";
import AddToPlaylistButton from "../AddToPlaylistButton";
import AddToAdvancedSearchButton from "../Analyzer/AddToAdvancedSearchButton";
import StartTreeButton from "../Discover/StartTreeButton";
import Table from "../Table";
import { showSideBar } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import Tag from "../Table/Tag";
import { map, startCase, get, size, join, first } from "lodash";
import SearchBar from "../Table/SearchBar";

// <AddToAdvancedSearchButton id={id} />
// <AddToPlaylistButton uri={uri} />
// <StartTreeButton uri={uri} />
const ButtonCellRenderer = ({ cellData, rowData: { uri, id } }) => (
    <React.Fragment>
        <PlayButton context_uri={uri} />
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
    background-color: #757575;
`;

const Tags = styled.div`
    display: flex;
    flex-wrap: none;
    overflow: auto;
    > * {
        flex: 1;
    }
`;

const AlbumImageCellRenderer = ({ cellData, rowData: { image, artist, type, album } }) => (
    <AlbumImageCellRendererWrapper>
        <img alt="test" src={image} />
        <DescriptionContainer>
            <div>
                <Typography>{album}</Typography>
            </div>
            <div>
                <Typography>{artist}</Typography>
            </div>
            <div>
                <Typography>{type}</Typography>
            </div>
        </DescriptionContainer>
    </AlbumImageCellRendererWrapper>
);

const HeaderCell = styled.div`
    display: flex;
`;

const prefixColumnsProps = [
    {
        cellRenderer: ButtonCellRenderer,
        key: "button",
        width: 50
    },
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album"
    }
];

const ColumnCellRenderer = ({ cellData }) => <Typography>{cellData}</Typography>;
const HeaderCellRenderer = ({ label, dataKey, sortIndicator }) => (
    <HeaderCell>
        <Typography title={label}>{label}</Typography>
        <span>{sortIndicator && sortIndicator}</span>
    </HeaderCell>
);

class NewReleasesAlbumsTable extends Component {
    virtualizedConfig = {
        onRowClick: ({ event, index, rowData: { uri } }) => this.props.showSideBar("album", uri),
        rowStyle: ({ index }) => {
            const {
                tableData: { rows }
            } = this.props;
            const backgroundColors = get(rows, `${index}.meta.backgroundColors`);
            const linearGradientString = join(backgroundColors, ", ");
            return (
                size(backgroundColors) && {
                    background:
                        size(backgroundColors) > 1
                            ? `linear-gradient(90deg, ${linearGradientString})`
                            : first(backgroundColors)
                }
            );
        }
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    // TODO: Use html encode library, he to encode strings
    render() {
        const { tableData, topNewReleaseGenres } = this.props;
        return (
            <NewReleasesAlbumsTableWrapper>
                <SearchBar />
                <Tags>
                    {map(topNewReleaseGenres, ({ genre, backgroundColor }) => (
                        <Tag id={genre} backgroundColor={backgroundColor}>
                            {startCase(genre)}
                        </Tag>
                    ))}
                </Tags>
                <Table
                    tableData={tableData}
                    prefixColumnsProps={prefixColumnsProps}
                    virtualizedConfig={this.virtualizedConfig}
                    columnConfig={this.columnConfig}
                />
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataWithFiltersSelector,
    topNewReleaseGenres: topNewReleaseGenresSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar }
    )
)(NewReleasesAlbumsTable);
