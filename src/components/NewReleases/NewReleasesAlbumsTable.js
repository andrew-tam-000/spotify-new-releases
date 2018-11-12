import { compose, withPropsOnChange } from "recompact";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByAlbumTableDataWithFiltersSelector } from "../../selectors/tables";
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
import { flatMap, map, get, filter, slice } from "lodash";

import TableWithTags from "../Table/TableWithTags";

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataWithFiltersSelector
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
    ),
    withPropsOnChange(
        ["tableData", "newReleasesTableShowAllTracks", "albums"],
        ({ tableData: { rows }, newReleasesTableShowAllTracks, albums }) => ({
            // BUG - spotify doesn't accept arbitrarily large uri's
            playAllUris: slice(
                newReleasesTableShowAllTracks
                    ? map(rows, "uri")
                    : flatMap(filter(rows, ({ isTrack }) => !isTrack), ({ id }) =>
                          map(get(albums, `${id}.tracks.items`), "uri")
                      ),
                0,
                500
            )
        })
    )
)(TableWithTags);
