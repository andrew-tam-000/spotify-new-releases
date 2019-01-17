import { compose, withHandlers } from "recompact";
import { get, flatMap, map, slice, compact, debounce } from "lodash";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { newReleasesByAlbumTableDataWithFiltersSelector } from "../../selectors/tables";
import {
    loadingNewReleasesTableSelector,
    artistDataSelector,
    albumsSelector
} from "../../selectors/";
import {
    toggleNewReleaseAlbum,
    showSideBar,
    addGenreColors,
    hideAllNewReleaseTracks,
    showAllNewReleaseTracks,
    toggleNewReleaseColors,
    openNewReleaseModal,
    reorderTags,
    reorderQueryTags,
    getAlbumsStart,
    getArtistsStart,
    getTracksStart
} from "../../redux/actions";
import fetchNewReleases from "../../hoc/fetchNewReleases";

import TableWithTags from "../Table/TableWithTags";

const mapStateToProps = createStructuredSelector({
    tableData: newReleasesByAlbumTableDataWithFiltersSelector,
    loading: loadingNewReleasesTableSelector,
    artistData: artistDataSelector,
    albums: albumsSelector
});

export default compose(
    fetchNewReleases,
    connect(
        mapStateToProps,
        {
            getAlbumsStart,
            getArtistsStart,
            showSideBar,
            addGenreColors,
            toggleNewReleaseAlbum,
            showAllNewReleaseTracks,
            hideAllNewReleaseTracks,
            toggleNewReleaseColors,
            openNewReleaseModal,
            reorderTags,
            reorderQueryTags,
            getTracksStart
        }
    ),
    withHandlers({
        // Only handled for album view right now
        onItemsRendered: ({
            tableData,
            getAlbumsStart,
            getArtistsStart,
            artistData,
            albums,
            getTracksStart
        }) =>
            debounce(({ overscanStartIndex, overscanStopIndex }) => {
                getTracksStart(
                    flatMap(
                        // List of album ids
                        compact(
                            map(slice(tableData.rows, overscanStartIndex, overscanStopIndex), "id")
                        ),
                        id => map(get(albums, `${id}.tracks.items`), "id")
                    )
                );
            }, 100)
    })
)(TableWithTags);
