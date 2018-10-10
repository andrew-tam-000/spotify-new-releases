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
import PlayAll from "./PlayAll";
import styled from "styled-components";
import UpdateNodeUriButton from "./UpdateNodeUriButton";

const ListItemText = styled(_ListItemText)`
    flex: 1 !important;
`;

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
            <PlayAll uris={map(topTracks, track => track.uri)} />
            <List>
                {map(topTracks, track => (
                    <ListItem key={track.id}>
                        <div>
                            <PlayButton uri={track.uri} />
                            <UpdateNodeUriButton uri={track.uri} nodeId={nodeId} />
                        </div>
                        <ListItemText
                            primary={track.name}
                            secondary={join(map(track.artists, artist => artist.name), ", ")}
                        />
                    </ListItem>
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
            <Typography variant="display1" gutterBottom>
                {songData.name}
            </Typography>
            <PlayButton uri={songData.uri} />
            <UpdateNodeUriButton uri={songData.uri} nodeId={nodeId} />
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
            <PlayAll uris={map(relatedTracks, track => track.uri)} />
            <List>
                {map(relatedTracks, track => (
                    <ListItem key={track.id}>
                        <div>
                            <PlayButton uri={track.uri} />
                            <UpdateNodeUriButton uri={track.uri} nodeId={nodeId} />
                        </div>
                        <ListItemText
                            primary={track.name}
                            secondary={join(map(track.artists, artist => artist.name), ", ")}
                        />
                    </ListItem>
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
