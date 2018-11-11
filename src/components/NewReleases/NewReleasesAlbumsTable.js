import React, { Component, createRef } from "react";
import { defaultTableHeaderRowRenderer } from "react-virtualized";
import { compose } from "recompose";
import materialStyled from "../../materialStyled";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";
import _Menu from "@material-ui/core/Menu";
import {
    newReleasesByAlbumTableDataWithFiltersSelector,
    genreColorsSelector,
    queryParamsSelector,
    availableGenresSelector
} from "../../selectors";
import Autocomplete from "../Table/Autocomplete";
import Table from "../Table";
import { showSideBar, addGenreColors } from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";
import Tag from "../Table/Tag";
import { map, get, size, join, first, difference, filter, find, compact } from "lodash";
import SearchBar from "../Table/SearchBar";
import { encodedStringifiedToObj } from "../../utils";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import RootRef from "@material-ui/core/RootRef";

const HeaderRowRenderer = styled(defaultTableHeaderRowRenderer)`
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
    flex: 1;
    > * {
        flex: 1;
    }
`;

const TagsWithButton = styled.div`
    display: flex;
    overflow: hidden;
`;

const ActiveDivider = styled.div`
    min-width: 20px;
    max-width: 20px;
`;

const HeaderCell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const Menu = materialStyled(_Menu)({
    padding: 20
});

const prefixColumnsProps = [
    {
        cellRenderer: AlbumImageCellRenderer,
        key: "album",
        width: 140,
        headerRenderer: () => <SearchBar />,
        disableSort: true
    }
];

const ColumnCellRenderer = ({ cellData }) => <Typography>{cellData}</Typography>;
const HeaderCellRenderer = ({ label, dataKey, sortIndicator }) => (
    <HeaderCell>
        <Typography title={label}>{label}</Typography>
        <Typography>{sortIndicator && sortIndicator}</Typography>
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
        },
        rowHeight: 50,
        headerHeight: 32,
        headerRenderer: HeaderRowRenderer
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    state = {
        addMenuOpen: false,
        genre: undefined,
        color: "#FFFFFF"
    };

    constructor(props) {
        super(props);
        this.addButton = createRef();
    }

    closeAddMenu = () =>
        this.setState({
            addMenuOpen: false
        });

    openAddMenu = () =>
        this.setState({
            addMenuOpen: true
        });

    handleChangeColor = color => this.setState({ color });
    handleSelectGenre = genre => this.setState({ genre });
    addGenreColors = () =>
        this.props.addGenreColors([
            { color: get(this.state, "color.hex"), genre: get(this.state, "genre.value") }
        ]) && this.setState({ genre: undefined, color: "#FFFFFF", addMenuOpen: false });

    // TODO: Use html encode library, he to encode strings
    render() {
        const { tableData, genreColors, queryParams, availableGenres } = this.props;
        const active = compact(
            map(encodedStringifiedToObj(queryParams.tags, []), tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre)
            )
        );
        const inactive = difference(genreColors, active);
        return (
            <NewReleasesAlbumsTableWrapper>
                <TagsWithButton>
                    <RootRef rootRef={this.addButton}>
                        <Button
                            mini
                            variant="fab"
                            color="primary"
                            aria-label="Add"
                            onClick={this.openAddMenu}
                        >
                            <AddIcon />
                        </Button>
                    </RootRef>
                    <Menu
                        anchorEl={this.addButton.current}
                        open={this.state.addMenuOpen}
                        onClose={this.closeAddMenu}
                    >
                        <Autocomplete
                            onChange={this.handleSelectGenre}
                            value={this.state.genre}
                            options={map(
                                filter(
                                    availableGenres,
                                    availableGenre =>
                                        !find(
                                            genreColors,
                                            topGenre => topGenre.genre === availableGenre.genre
                                        )
                                ),
                                ({ genre }) => ({ value: genre, label: genre })
                            )}
                        />
                        <Typography>Pick a color</Typography>
                        <ChromePicker
                            color={this.state.color}
                            onChangeComplete={this.handleChangeColor}
                        />
                        <Button variant="contained" color="primary" onClick={this.addGenreColors}>
                            Add genre
                        </Button>
                    </Menu>
                    <Tags>
                        {map(active, ({ genre, color }) => (
                            <Tag id={genre} backgroundColor={color}>
                                <Typography>{genre}</Typography>
                            </Tag>
                        ))}
                        {active.length ? <ActiveDivider /> : null}
                        {map(inactive, ({ genre, color }) => (
                            <Tag id={genre} backgroundColor={color}>
                                <Typography>{genre}</Typography>
                            </Tag>
                        ))}
                    </Tags>
                </TagsWithButton>
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
    genreColors: genreColorsSelector,
    queryParams: queryParamsSelector,
    availableGenres: availableGenresSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        { showSideBar, addGenreColors }
    )
)(NewReleasesAlbumsTable);
