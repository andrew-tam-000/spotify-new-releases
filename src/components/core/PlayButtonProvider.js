import { compose, withPropsOnChange } from "recompact";
import { isUndefined, omitBy } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    nowPlayingContextUriSelector,
    nowPlayingSongUriSelector,
    nowPlayingIsPlayingSelector
} from "../../selectors";

import { playSongStart, pauseSongStart } from "../../redux/actions";

const PlayButtonProvider = ({ children, isPlaying, playSongStart, pauseSongStart }) =>
    children({ isPlaying, pauseSongStart, playSongStart });

const mapDispatchToProps = (dispatch, { uris, uri, context_uri, offset }) => ({
    pauseSongStart: e => {
        e.stopPropagation();
        dispatch(pauseSongStart());
    },
    playSongStart: e => {
        e.stopPropagation();
        dispatch(
            playSongStart(
                omitBy({ uris: uris ? uris : uri ? [uri] : undefined, context_uri }, val =>
                    isUndefined(val)
                )
            )
        );
    }
});

export default compose(
    connect(
        createStructuredSelector({
            nowPlayingSongUri: nowPlayingSongUriSelector,
            nowPlayingContextUri: nowPlayingContextUriSelector,
            nowPlayingIsPlaying: nowPlayingIsPlayingSelector
        }),
        mapDispatchToProps
    ),
    withPropsOnChange(
        ["uri", "nowPlayingSongUri", "context_uri", "nowPlayingContextUri", "nowPlayingIsPlaying"],
        ({ uri, nowPlayingSongUri, context_uri, nowPlayingContextUri, nowPlayingIsPlaying }) => ({
            isPlaying:
                // If id is supplied then check against the supplied id
                // Otherwise, just pause and play
                uri || context_uri
                    ? nowPlayingIsPlaying &&
                      ((uri && uri === nowPlayingSongUri) ||
                          (context_uri && context_uri === nowPlayingContextUri))
                    : nowPlayingIsPlaying
        })
    )
)(PlayButtonProvider);
