import React from "react";
import { first, last, split } from "lodash";
import { compose, mapProps } from "recompose";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PlayButton from "./Analyzer/PlayButton";
import { accessTokenSelector, nowPlayingSongUriSelector, songsSelector } from "../selectors";
import Login from "./Login";
import Typography from "@material-ui/core/Typography";
import Seek from "./PlayDash/Seek";
import styled from "styled-components";
import materialStyled from "../materialStyled";
import PlayDashMenu from "./PlayDash/PlayDashMenu";

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
    flex: 1;
`;

const PlaySection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Summary = styled.div`
    margin-left: 10px;
    overflow: hidden;
`;

const SummaryWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
`;

const PlayDash = ({ uri, track }) => (
    <PlayDashWrapper>
        <PlaySection>
            <SummaryWrapper>
                <PlayButton />
                <Summary>
                    <Title variant="body1">{track.name}</Title>
                    <Artist variant="caption">{first(track.artists).name}</Artist>
                </Summary>
            </SummaryWrapper>
            <PlayDashMenu />
        </PlaySection>
        <Controls>
            <Seek />
        </Controls>
    </PlayDashWrapper>
);

const PlayDashWithData = compose(
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

const PlayDashOrLogin = ({ accessToken }) => (accessToken ? <PlayDashWithData /> : <Login />);

export default connect(
    createStructuredSelector({
        accessToken: accessTokenSelector
    })
)(PlayDashOrLogin);
