import React from "react";
import { get, map } from "lodash";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import AddToLibrary from "./AddToLibrary";

import Date from "./Date";
import materialStyled from "../../materialStyled";
import PlayButtonProvider from "../core/PlayButtonProvider";

const AlbumImageCellRendererWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
`;

const TrackBlurbCellRendererWrapper = styled(AlbumImageCellRendererWrapper)``;

const AlbumImage = styled.img`
    min-width: 40px;
    width: 40px;
    display: block;
`;

const AlbumTitle = materialStyled(Typography)({
    lineHeight: 1.2
});

const Description = styled.div`
    overflow: hidden;
    margin-left: 5px;
`;

const AlbumWrapper = styled.div`
    position: relative;
`;

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

const TitleWithAdd = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
`;

const buttonStyles = {
    color: "white",
    cursor: "pointer"
};
const PauseButton = materialStyled(PauseCircleOutlineIcon)(buttonStyles);
const PlayButton = materialStyled(PlayCircleOutlineIcon)(buttonStyles);
const NewReleasesAlbumPlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) => (
            <ButtonWrapper onClick={isPlaying ? pauseSongStart : playSongStart}>
                {isPlaying ? <PauseButton fontSize="small" /> : <PlayButton fontSize="small" />}
            </ButtonWrapper>
        )}
    </PlayButtonProvider>
);

const NewReleasesTrackPlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) =>
            isPlaying ? (
                <PauseButton fontSize="small" onClick={pauseSongStart} />
            ) : (
                <PlayButton fontSize="small" onClick={playSongStart} />
            )
        }
    </PlayButtonProvider>
);

// <AddToAdvancedSearchButton id={id} />
// <AddToPlaylistButton uri={uri} />
// <StartTreeButton uri={uri} />
const AlbumImageCellRenderer = ({ className, data = [], index }) => {
    const {
        uri,
        image,
        artist,
        track,
        releaseDate,
        album,
        meta: { parents, cellType },
        id
    } = get(data, `rows.${index}`) || {};

    return cellType === "track" ? (
        <TrackBlurbCellRendererWrapper className={className}>
            {map(parents, (parent, idx) => (
                <ChevronRightIcon
                    style={{ marginLeft: idx ? -15 : undefined }}
                    fontSize="small"
                    color="action"
                    key={parent}
                />
            ))}
            <NewReleasesTrackPlayButton uri={uri} />
            <Description>
                <TitleWithAdd>
                    <AlbumTitle noWrap={true} variant="body2">
                        {track}
                    </AlbumTitle>
                    <AddToLibrary id={id} fontSize="small" color="action" />
                </TitleWithAdd>
                <Typography noWrap={true} variant="body1">
                    {artist}
                </Typography>
            </Description>
        </TrackBlurbCellRendererWrapper>
    ) : cellType === "album" ? (
        <AlbumImageCellRendererWrapper className={className}>
            <AlbumWrapper>
                <NewReleasesAlbumPlayButton context_uri={uri} />
                <AlbumImage alt="test" src={image} />
            </AlbumWrapper>
            <Description>
                <AlbumTitle noWrap={true} variant="body2">
                    {album}
                </AlbumTitle>
                <AlbumTitle noWrap={true} variant="body1">
                    {artist}
                </AlbumTitle>
            </Description>
        </AlbumImageCellRendererWrapper>
    ) : cellType === "date" ? (
        <Date date={releaseDate} />
    ) : null;
};

export default AlbumImageCellRenderer;
