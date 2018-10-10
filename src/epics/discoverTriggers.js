import { ofType } from "redux-observable";
import { mergeMap, catchError, take } from "rxjs/operators";
import { keyBy, map, split } from "lodash";
import { merge } from "rxjs/observable/merge";
import { EMPTY, of, concat } from "rxjs";
import { discoverNodesSelector } from "../selectors";
import uuidv1 from "uuid/v1";
import {
    toggleNode,
    nodeFetched,
    getRelatedArtistsStart,
    getRelatedArtistsSuccess,
    getArtistTopTracksStart,
    getArtistTopTracksSuccess,
    createNodes,
    showSideBar,
    updateNodeUri,
    getRecommendationsStart,
    getRecommendationsSuccess
} from "../redux/actions";
import Node from "../Node";

const streamForAddingTracks = (action$, state$, node, trackId) => {
    const nodeId = node.data.id;
    return concat(
        of(nodeFetched(nodeId)),
        of(getRecommendationsStart({ seed_tracks: [trackId] })),
        action$.pipe(
            ofType(getRecommendationsSuccess().type),
            mergeMap(action =>
                of(
                    createNodes(
                        nodeId,
                        keyBy(
                            map(
                                action.payload.tracks,
                                track =>
                                    new Node({
                                        id: uuidv1(),
                                        uri: track.uri,
                                        name: track.name,
                                        renderKey: uuidv1()
                                    })
                            ),
                            "data.id"
                        )
                    )
                )
            ),
            take(1)
        )
    );
};

const streamForAddingArtists = (action$, state$, node, artistId) => {
    const nodeId = node.data.id;
    return concat(
        of(nodeFetched(nodeId)),
        of(getRelatedArtistsStart(artistId)),
        action$.pipe(
            ofType(getRelatedArtistsSuccess().type),
            mergeMap(action =>
                of(
                    createNodes(
                        nodeId,
                        keyBy(
                            map(
                                action.payload.relatedArtists,
                                relatedArtist =>
                                    new Node({
                                        id: uuidv1(),
                                        uri: relatedArtist.uri,
                                        name: relatedArtist.name,
                                        renderKey: uuidv1()
                                    })
                            ),
                            "data.id"
                        )
                    )
                )
            ),
            take(1)
        ),
        of(getArtistTopTracksStart(artistId))
    );
};

// TODO: This should also add a new node to the tree
const onUpdateNodeUri = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(updateNodeUri().type),
        mergeMap(action => {
            const { nodeId, uri } = action.payload;
            const node = discoverNodesSelector(state$.value)[nodeId];
            const [, type, id] = split(uri, ":");
            const streamToRun = type === "artist" ? streamForAddingArtists : streamForAddingTracks;
            return concat(
                of(showSideBar("node", nodeId)),
                !node.data.fetched ? streamToRun(action$, state$, node, id) : EMPTY
            );
        })
    );

const onToggleNode = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(toggleNode().type),
        mergeMap(action => {
            const nodeId = action.payload;
            const node = discoverNodesSelector(state$.value)[nodeId];
            const [, type, id] = split(node.data.uri, ":");
            const streamToRun = type === "artist" ? streamForAddingArtists : streamForAddingTracks;
            return concat(
                of(showSideBar("node", nodeId)),
                !node.data.fetched ? streamToRun(action$, state$, node, id) : EMPTY
            );
        })
    );

export default (...args) =>
    merge(onUpdateNodeUri(...args), onToggleNode(...args)).pipe(catchError(e => console.error(e)));
