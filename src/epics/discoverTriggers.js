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
    showSideBar
} from "../redux/actions";

const onToggleNode = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(toggleNode().type),
        mergeMap(action => {
            const nodeId = action.payload;
            const node = discoverNodesSelector(state$.value)[nodeId];
            const [, type, id] = split(node.data.uri, ":");
            return !node.data.fetched
                ? concat(
                      of(nodeFetched(nodeId)),
                      of(getRelatedArtistsStart(id)),
                      action$.pipe(
                          ofType(getRelatedArtistsSuccess().type),
                          mergeMap(action =>
                              of(
                                  createNodes(
                                      nodeId,
                                      keyBy(
                                          map(action.payload.relatedArtists, relatedArtist => ({
                                              data: {
                                                  id: uuidv1(),
                                                  uri: relatedArtist.uri,
                                                  name: relatedArtist.name
                                              }
                                          })),
                                          "data.id"
                                      )
                                  )
                              )
                          ),
                          take(1)
                      ),
                      of(getArtistTopTracksStart(id)),
                      of(showSideBar(node.data.uri))
                  )
                : EMPTY;
        })
    );

export default (...args) => merge(onToggleNode(...args)).pipe(catchError(e => console.error(e)));
