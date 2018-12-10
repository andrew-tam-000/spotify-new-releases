import { compose } from "recompact";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByAlbumTableDataWithFiltersSelector } from "../../selectors/tables";
import { loadingNewReleasesTableSelector } from "../../selectors/";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors,
    openNewReleaseModal,
    reorderTags,
    reorderQueryTags
} from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";

import TableWithTags from "../Table/TableWithTags";

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataWithFiltersSelector,
    loading: loadingNewReleasesTableSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        {
            showSideBar,
            addGenreColors,
            toggleNewReleaseAlbum,
            showAllNewReleaseTracks,
            hideAllNewReleaseTracks,
            toggleNewReleaseColors,
            openNewReleaseModal,
            reorderTags,
            reorderQueryTags
        }
    )
)(TableWithTags);
