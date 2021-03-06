// TODO: Don't need to store 'nodeFEtched' becasue we store this in the redux state

import { ofType } from "redux-observable";
import { mergeMap, catchError, take } from "rxjs/operators";
import { get, last, keyBy, map, split } from "lodash";
import { merge } from "rxjs/observable/merge";
import { EMPTY, of, concat } from "rxjs";
import {
    discoverNodesSelector,
    artistImageForTrackIdSelector,
    artistForTrackIdSelector,
    artistImageForArtistIdSelector
} from "../selectors";
import uuidv1 from "uuid/v1";
import {
    toggleNode,
    nodeFetched,
    getRelatedArtistsStart,
    getRelatedArtistsSuccess,
    getArtistTopTracksStart,
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
                                        image: artistImageForTrackIdSelector(state$.value)(
                                            track.id
                                        ),
                                        artist: artistForTrackIdSelector(state$.value)(track.id)
                                            .name,
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
                                        image: artistImageForArtistIdSelector(state$.value)(
                                            relatedArtist.id
                                        ),
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

const onShowSideBar = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(showSideBar().type),
        mergeMap(action => {
            if (action.payload.type === "node") {
                const nodeId = action.payload.data;
                const node = discoverNodesSelector(state$.value)[nodeId];
                const uri = node.data.uri;
                const [, type, id] = split(uri, ":");
                const streamToRun =
                    type === "artist" ? streamForAddingArtists : streamForAddingTracks;
                return !node.data.fetched ? streamToRun(action$, state$, node, id) : EMPTY;
            } else {
                return EMPTY;
            }
        })
    );

const onUpdateNodeUri = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(updateNodeUri().type),
        mergeMap(action => {
            const {
                data: { id: nodeId }
            } = action.payload;
            return of(showSideBar("node", nodeId));
        })
    );

const onToggleNode = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(toggleNode().type),
        mergeMap(action => {
            const nodeId = action.payload;
            return of(showSideBar("node", nodeId));
        })
    );

export default (...args) =>
    merge(onShowSideBar(...args), onUpdateNodeUri(...args), onToggleNode(...args)).pipe(
        catchError(e => console.error(e))
    );
