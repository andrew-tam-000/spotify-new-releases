import React from "react";
import { last, split } from "lodash";
import { compose, mapProps } from "recompose";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import SkipToNextButton from "./PlayDash/SkipToNextButton";
import SkipToPreviousButton from "./PlayDash/SkipToPreviousButton";
import PlayButton from "./Analyzer/PlayButton";
import { nowPlayingSongUriSelector, songsSelector } from "../selectors";
import Typography from "@material-ui/core/Typography";
import StartTreeButton from "./Discover/StartTreeButton";
import styled from "styled-components";

const Title = styled(Typography)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const Buttons = styled.div`
    display: flex;
`;

const PlayDash = ({ uri, track }) => (
    <React.Fragment>
        <Title variant="headline">{track.name}</Title>
        <Buttons>
            <StartTreeButton uri={uri} />
            <SkipToPreviousButton />
            <PlayButton uri={uri} />
            <SkipToNextButton />
        </Buttons>
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
        track: songs[last(split(uri, ":"))] || {}
    }))
)(PlayDash);
