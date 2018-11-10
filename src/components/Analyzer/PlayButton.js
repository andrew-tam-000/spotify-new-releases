import React from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";
import PlayButtonProvider from "../../components/core/PlayButtonProvider";

const PlayButton = props => (
    <PlayButtonProvider {...props}>
        {({ isPlaying, pauseSongStart, playSongStart }) => (
            <Button
                onClick={isPlaying ? pauseSongStart : playSongStart}
                mini
                variant="fab"
                color="primary"
                aria-label="Add"
            >
                {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
            </Button>
        )}
    </PlayButtonProvider>
);

export default PlayButton;
