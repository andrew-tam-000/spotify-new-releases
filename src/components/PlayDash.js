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
const Header = materialStyled(Typography)(typographyStyles);

const Controls = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlayDashWrapper = styled.div``;

const PlayDash = ({ uri, track }) => (
    <PlayDashWrapper>
        <div>
            <Header variant="body1">{track.name}</Header>
            <Header variant="body2">{first(track.artists).name}</Header>
        </div>
        <Controls>
            <div>
                <StartTreeButton uri={uri} />
                <SkipToPreviousButton />
                <PlayButton uri={uri} />
                <SkipToNextButton />
            </div>
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
