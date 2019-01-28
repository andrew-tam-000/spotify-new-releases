import React from "react";
import { compact, join, get, split, map, last } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    songsSelector,
    showSideBarSelector,
    artistTopTracksSelector,
    artistDataSelector,
    discoverNodesSelector
} from "../selectors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import _ListItemText from "@material-ui/core/ListItemText";
import { compose, mapProps } from "recompose";
import Typography from "@material-ui/core/Typography";
import PlayButton from "./Analyzer/PlayButton";
import styled from "styled-components";
import UpdateNodeUriButton from "./UpdateNodeUriButton";
import StarsIcon from "@material-ui/icons/Stars";

const ListItemText = styled(_ListItemText)`
    flex: 1 !important;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
`;

const Buttons = styled.div`
    display: flex;
    margin-right: 12px;
`;

const TextIcon = styled.div`
    display: flex;
    align-items: center;
`;

const TrackRow = ({ track, nodeId }) => (
    <ListItem>
        <div>
            <PlayButton uri={track.uri} />
            <UpdateNodeUriButton uri={track.uri} nodeId={nodeId} />
        </div>
        <ListItemText
            primary={track.name}
            secondary={[
                <span>{join(map(track.artists, artist => artist.name), ", ")}</span>,
                <br />,
                <TextIcon>
                    <StarsIcon />
                    <div>{track.popularity}</div>
                </TextIcon>
            ]}
        />
    </ListItem>
);

// Potentially supports nodes and alos regular tables
const ArtistPanel = compose(
    connect(
        createStructuredSelector({
            artistTopTracks: artistTopTracksSelector,
            songs: songsSelector,
            artistData: artistDataSelector
        })
    ),
    mapProps(({ artistData, artistTopTracks, songs, nodeId, spotifyId }) => {
        return {
            nodeId,
            topTracks: map(artistTopTracks[spotifyId], trackId => songs[trackId]),
            artistData: artistData[spotifyId] || {}
        };
    })
)(function _ArtistPanel({ topTracks, artistData, nodeId }) {
    return (
        <React.Fragment>
            <Typography variant="display1" gutterBottom>
                {artistData.name}
            </Typography>
            <List>
                {map(topTracks, track => (
                    <TrackRow key={track.id} track={track} nodeId={nodeId} />
                ))}
            </List>
        </React.Fragment>
    );
});

// Potentially supports nodes and alos regular tables
const TrackPanel = compose(
    connect(
        createStructuredSelector({
            songs: songsSelector,
            discoverNodes: discoverNodesSelector
        })
    ),
    mapProps(({ nodeId, songs, spotifyId, discoverNodes }) => {
        return {
            nodeId,
            songData: songs[spotifyId] || {},
            relatedTracks: compact(
                map(
                    get(discoverNodes, `${nodeId}.children`),
                    nodeId => songs[last(split(get(discoverNodes, `${nodeId}.data.uri`), ":"))]
                )
            )
        };
    })
)(function _TrackPanel({ songData, nodeId, relatedTracks }) {
    return (
        <React.Fragment>
            <Header>
                <Buttons>
                    <PlayButton uri={songData.uri} />
                    <UpdateNodeUriButton uri={songData.uri} nodeId={nodeId} />
                </Buttons>
                <Typography variant="display1" gutterBottom>
                    {songData.name}
                </Typography>
            </Header>
            <List>
                {map(songData.artists, artist => (
                    <ListItem key={artist.id}>
                        <div>
                            <UpdateNodeUriButton uri={artist.uri} nodeId={nodeId} />
                        </div>
                        <ListItemText primary={artist.name} />
                    </ListItem>
                ))}
            </List>
            <List>
                {map(relatedTracks, track => (
                    <TrackRow key={track.id} track={track} nodeId={nodeId} />
                ))}
            </List>
        </React.Fragment>
    );
});

const SongDetails = ({ showSideBar, discoverNodes }) => {
    const { data } = showSideBar;
    const node = discoverNodes[data];
    const nodeId = get(node, "data.id");
    const uri = get(node, "data.uri");
    const [, type, spotifyId] = split(uri, ":");
    const props = {
        nodeId,
        uri,
        spotifyId
    };
    return type === "artist" ? <ArtistPanel {...props} /> : <TrackPanel {...props} />;
};

export default connect(
    createStructuredSelector({
        showSideBar: showSideBarSelector,
        discoverNodes: discoverNodesSelector
    })
)(SongDetails);
