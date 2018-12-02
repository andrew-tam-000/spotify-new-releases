import React from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { createStructuredSelector } from "reselect";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { addToMySavedTracksStart } from "../../redux/actions";
import { accessTokenSelector } from "../../selectors";

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

const AddToLibrary = compose(
    connect(
        createStructuredSelector({
            accessToken: accessTokenSelector
        }),
        { addToMySavedTracksStart }
    ),
    withProps(({ addToMySavedTracksStart, id }) => ({
        onClick: () => addToMySavedTracksStart([id])
    }))
)(function _AddIcon({ accessToken, ...props }) {
    return accessToken && <AddIcon {...props} />;
});

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
        meta: { genres, parents },
        id
    },
    modalOpen,
    setModalOpen
}) =>
    isTrack ? (
        <TrackBlurbCellRendererWrapper>
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
                    <Typography noWrap={true}>{track}</Typography>
                    <AddToLibrary id={id} fontSize="small" color="action" />
                </TitleWithAdd>
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
            </Description>
        </AlbumImageCellRendererWrapper>
    );

export default AlbumImageCellRenderer;
