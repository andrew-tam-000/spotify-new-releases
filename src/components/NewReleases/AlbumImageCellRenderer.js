import React from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

import materialStyled from "../../materialStyled";
import PlayButtonProvider from "../core/PlayButtonProvider";

const AlbumImageCellRendererWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
`;

const AlbumImage = styled.img`
    height: 40px;
    display: block;
`;

const AlbumTitle = materialStyled(Typography)({
    lineHeight: 1
});

const Description = styled.div`
    overflow: hidden;
    margin-left: 5px;
`;

const AlbumWrapper = styled.div`
    position: relative;
`;

const buttonStyles = {
    fontSize: 20,
    color: "white"
};
const ButtonWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PauseButton = materialStyled(PauseCircleOutlineIcon)(buttonStyles);
const PlayButton = materialStyled(PlayCircleOutlineIcon)(buttonStyles);
const NewReleasesPlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) => (
            <ButtonWrapper onClick={isPlaying ? pauseSongStart : playSongStart}>
                {isPlaying ? <PauseButton /> : <PlayButton />}
            </ButtonWrapper>
        )}
    </PlayButtonProvider>
);

// <AddToAdvancedSearchButton id={id} />
// <AddToPlaylistButton uri={uri} />
// <StartTreeButton uri={uri} />
const AlbumImageCellRenderer = ({ cellData, rowData: { uri, image, artist, type, album } }) => (
    <AlbumImageCellRendererWrapper>
        <AlbumWrapper>
            <NewReleasesPlayButton context_uri={uri} />
            <AlbumImage alt="test" src={image} />
        </AlbumWrapper>
        <Description>
            <Typography noWrap={true}>{artist}</Typography>
            <AlbumTitle noWrap={true} variant="overline">
                {album}
            </AlbumTitle>
            <Typography noWrap={true} variant="caption">
                {type}
            </Typography>
        </Description>
    </AlbumImageCellRendererWrapper>
);

export default AlbumImageCellRenderer;
