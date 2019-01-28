import { createStructuredSelector } from "reselect";
import { compose, withPropsOnChange } from "recompact";
import { connect } from "react-redux";
import { findIndex, slice, flatMap, map, thru, get, compact } from "lodash";

import { playSongStart } from "../../redux/actions";
import { albumsSelector, songsSelector } from "../../selectors";

const PlayAllButton = ({ uris, children }) => children({ uris });

const mapDispatchToProps = (dispatch, { uris }) => ({
    playSongStart: () => dispatch(playSongStart({ uris }))
});

export default compose(
    connect(
        createStructuredSelector({
            albums: albumsSelector,
            songs: songsSelector
        }),
        mapDispatchToProps
    ),
    withPropsOnChange(["rows", "albums", "songs", "id"], ({ rows, albums, songs, id }) => {
        return {
            uris: compact(
                flatMap(slice(rows, findIndex(rows, { id })), row =>
                    thru(
                        get(row, "meta.cellType"),
                        type =>
                            type === "track"
                                ? row.uri
                                : type === "album"
                                    ? map(get(albums[row.id], "tracks.items"), "uri")
                                    : null
                    )
                )
            )
        };
    })
)(PlayAllButton);
