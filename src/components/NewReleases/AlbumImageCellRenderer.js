import React from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { openNewReleaseModal } from "../../redux/actions";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import { map } from "lodash";

import materialStyled from "../../materialStyled";
import PlayButtonProvider from "../core/PlayButtonProvider";

const AlbumImageCellRendererWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
`;

const TrackBlurbCellRendererWrapper = styled(AlbumImageCellRendererWrapper)``;

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

const buttonStyles = {
    fontSize: 20,
    color: "white",
    cursor: "pointer"
};
const PauseButton = materialStyled(PauseCircleOutlineIcon)(buttonStyles);
const PlayButton = materialStyled(PlayCircleOutlineIcon)(buttonStyles);
const NewReleasesAlbumPlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) => (
            <ButtonWrapper onClick={isPlaying ? pauseSongStart : playSongStart}>
                {isPlaying ? <PauseButton /> : <PlayButton />}
            </ButtonWrapper>
        )}
    </PlayButtonProvider>
);

const NewReleasesTrackPlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) =>
            isPlaying ? (
                <PauseButton onClick={pauseSongStart} />
            ) : (
                <PlayButton onClick={playSongStart} />
            )
        }
    </PlayButtonProvider>
);

const Genres = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    margin-top: 2px;
`;

const Tag = styled.span`
    background-color: ${props => props.color};
    padding: 0 2px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    margin-right: 2px;
    cursor: pointer;
`;

const withOpenModal = compose(
    connect(
        null,
        { openNewReleaseModal }
    ),
    withProps(({ openNewReleaseModal, genre }) => ({
        onClick: e => {
            e.stopPropagation();
            openNewReleaseModal(genre);
        }
    }))
);

const TypographyWithOpenModal = withOpenModal(Typography);

// <AddToAdvancedSearchButton id={id} />
// <AddToPlaylistButton uri={uri} />
// <StartTreeButton uri={uri} />
const AlbumImageCellRenderer = ({
    cellData,
    rowData: {
        uri,
        image,
        artist,
        track,
        type,
        album,
        isTrack,
        meta: { genres }
    },
    modalOpen,
    setModalOpen
}) =>
    isTrack ? (
        <TrackBlurbCellRendererWrapper>
            <NewReleasesTrackPlayButton uri={uri} />
            <Description>
                <Typography noWrap={true}>{track}</Typography>
                <Typography noWrap={true} variant="caption">
                    {artist}
                </Typography>
            </Description>
        </TrackBlurbCellRendererWrapper>
    ) : (
        <AlbumImageCellRendererWrapper>
            <AlbumWrapper>
                <NewReleasesAlbumPlayButton context_uri={uri} />
                <AlbumImage alt="test" src={image} />
            </AlbumWrapper>
            <Description>
                <Typography noWrap={true}>{album}</Typography>
                <AlbumTitle noWrap={true} variant="caption">
                    {artist}
                </AlbumTitle>
                <Genres>
                    {map(genres, genre => (
                        <TagProvider id={genre}>
                            {({ active, onClick, color }) => (
                                <Tag color={color}>
                                    <TypographyWithOpenModal genre={genre} variant="caption">
                                        {genre}
                                    </TypographyWithOpenModal>
                                </Tag>
                            )}
                        </TagProvider>
                    ))}
                </Genres>
            </Description>
        </AlbumImageCellRendererWrapper>
    );

export default AlbumImageCellRenderer;
