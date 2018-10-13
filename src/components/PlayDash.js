import React from "react";
import { first, last, split } from "lodash";
import { compose, mapProps } from "recompose";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import SkipToNextButton from "./PlayDash/SkipToNextButton";
import SkipToPreviousButton from "./PlayDash/SkipToPreviousButton";
import PlayButton from "./Analyzer/PlayButton";
import { nowPlayingSongUriSelector, songsSelector } from "../selectors";
import Typography from "@material-ui/core/Typography";
import StartTreeButton from "./Discover/StartTreeButton";
import Slider from "@material-ui/lab/Slider";
import styled from "styled-components";

const Title = styled(Typography)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;
const Artist = styled(Typography)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlayDash = ({ uri, track }) => (
    <React.Fragment>
        <div>
            <Title variant="headline">{track.name}</Title>
            <Artist variant="title">{first(track.artists).name}</Artist>
        </div>
        <Controls>
            <div>
                <StartTreeButton uri={uri} />
                <SkipToPreviousButton />
                <PlayButton uri={uri} />
                <SkipToNextButton />
            </div>
            <Slider />
        </Controls>
    </React.Fragment>
);

export default compose(
    connect(
        createStructuredSelector({
            uri: nowPlayingSongUriSelector,
            songs: songsSelector
        })
    ),
    mapProps(({ uri, songs }) => ({
        uri,
        track: songs[last(split(uri, ":"))] || { artists: [{}] }
    }))
)(PlayDash);
