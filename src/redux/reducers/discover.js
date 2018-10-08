import { setDiscover, toggleNode, nodeFetched, createNodes } from "../actions/";
import { merge, set, get, map } from "lodash";

export default (state = {}, { type, payload }) => {
    switch (type) {
        case setDiscover().type:
            return {
                ...state,
                root: payload.uri,
                nodes: {
                    [payload.uri]: {
                        data: {
                            id: payload.uri,
                            uri: payload.uri,
                            open: false,
                            name: payload.name
                        },
                        children: []
                    }
                }
            };
        case toggleNode().type:
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [payload]: merge(
                        {},
                        state.nodes[payload],
                        set({}, ["data", "open"], !get(state, ["nodes", payload, "data", "open"]))
                    )
                }
            };
        case nodeFetched().type:
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [payload]: merge({}, state.nodes[payload], set({}, ["data", "fetched"], true))
                }
            };

        case createNodes().type:
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    ...payload.nodes,
                    [payload.parentId]: {
                        ...state.nodes[payload.parentId],
                        children: map(payload.nodes, node => node.data.id)
                    }
                }
            };
        default:
            return state;
    }
};
