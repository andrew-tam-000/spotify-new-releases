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
import Seek from "./PlayDash/Seek";
import styled from "styled-components";
import materialStyled from "../materialStyled";

const typographyStyles = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    lineHeight: 1
};
const Title = materialStyled(Typography)(typographyStyles);
const Artist = materialStyled(Typography)({ ...typographyStyles, marginTop: 5 });

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const PlayDashWrapper = styled.div`
    overflow: hidden;
    padding: 10px;
`;

const Buttons = styled.div`
    display: flex;
    margin-bottom: 5px;
    justify-content: space-between;
`;

const PlayDash = ({ uri, track }) => (
    <PlayDashWrapper>
        <div>
            <Title variant="h5">{track.name}</Title>
            <Artist variant="h6">{first(track.artists).name}</Artist>
        </div>
        <Controls>
            <Buttons>
                <StartTreeButton uri={uri} />
                <SkipToPreviousButton />
                <PlayButton uri={uri} />
                <SkipToNextButton />
            </Buttons>
            <Seek />
        </Controls>
    </PlayDashWrapper>
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
