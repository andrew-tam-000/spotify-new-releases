import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import {
    filter,
    forEach,
    size,
    flatten,
    last,
    keyBy,
    join,
    reduce,
    keys,
    split,
    map,
    get,
    pickBy,
    first,
    values,
    set,
    merge
} from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { showSideBarSelector, hydratedRelatedArtistsSelector } from "../selectors";
import styled from "styled-components";
import {
    showSideBar,
    initializeOnDiscoverStart,
    getRelatedArtistsStart,
    getArtistTopTracksStart
} from "../redux/actions";
import * as d3 from "d3";
import store from "../redux/";

const View = styled.div`
    display: flex;
    flex: 1;
    height: 100%;

    .node circle {
        fill: #999;
    }

    .node text {
        font: 10px sans-serif;
    }

    .node--internal circle {
        fill: #555;
    }

    .node--internal text {
        text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
        fill: none;
        stroke: #555;
        stroke-opacity: 0.4;
        stroke-width: 1.5px;
    }
`;

const diagonal = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

const svg = d3
    .create("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("font", "10px sans-serif")
    .style("user-select", "none")
    .call(
        d3
            .zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed)
    )
    .on("dblclick.zoom", null);

const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

const gNode = svg.append("g").attr("cursor", "pointer");

const tree = d3.tree().nodeSize([50, 100]);

function zoomed() {
    gLink.attr("transform", d3.event.transform);
    gNode.attr("transform", d3.event.transform);
}

class Discover extends Component {
    state = {
        nodesToPopulate: {},
        nodes: {
            root: {
                data: {
                    id: "root",
                    uri: "spotify:artist:0A0FS04o6zMoto8OKPsDwY",
                    open: false,
                    name: "wow",
                    populated: false
                },
                children: []
            }
        }
    };

    buildTreeData() {
        const rawTree = addChildren(this.state.nodes);

        const d3Tree = d3.hierarchy(rawTree);
        d3Tree.x0 = 100 / 2;
        d3Tree.y0 = 0;
        d3Tree.eachAfter(d => {
            // TODO: Set the ids
            //console.log(d);
            return set(d, "id", d.data.id);
        });

        return d3Tree;

        function addChildren(nodes, node) {
            const { data, children } = !node ? nodes["root"] : node;
            const updatedNode = {
                ...data,
                children: data.open
                    ? map(children, childId => addChildren(nodes, nodes[childId]))
                    : []
            };

            return updatedNode;
        }
    }

    updateTree(source) {
        const root = this.buildTreeData();
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        console.log(root);

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const transition = svg
            .transition()
            .duration(duration)
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g").data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
            .enter()
            .append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", d => {
                const [, type, id] = split(d.data.uri, ":");

                this.props.getRelatedArtistsStart(id);
                this.props.getArtistTopTracksStart(id);
                this.props.showSideBar(d.data.uri);

                const newNode = merge({}, this.state.nodes[d.id], {
                    data: {
                        open: !this.state.nodes[d.id].data.open
                    }
                });

                this.setState(
                    {
                        nodes: merge({}, this.state.nodes, { [d.id]: newNode }),
                        nodesToPopulate: { ...this.state.nodesToPopulate, [d.id]: true }
                    },
                    () => {
                        this.updateTree(d);
                    }
                );
            });

        nodeEnter
            .append("circle")
            .attr("r", 2.5)
            .attr("fill", d => (d._children ? "#555" : "#999"));

        nodeEnter
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => (d._children ? -6 : 6))
            .attr("text-anchor", d => (d._children ? "end" : "start"))
            .text(d => d.data.name)
            .clone(true)
            .lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

        // Transition nodes to their new position.
        node.merge(nodeEnter)
            .transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        node.exit()
            .transition(transition)
            .remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path").data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link
            .enter()
            .append("path")
            .attr("d", d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.merge(linkEnter)
            .transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit()
            .transition(transition)
            .remove()
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    createTree() {
        this.tree.appendChild(svg.node());
        this.updateTree(this.buildTreeData());
    }

    componentDidMount() {
        this.props.initializeOnDiscoverStart();
        this.createTree();
    }

    render() {
        this.updateTree(this.buildTreeData());
        return <View innerRef={tree => (this.tree = tree)} />;
    }
}

Discover.getDerivedStateFromProps = function({ hydratedRelatedArtists }, state) {
    const nodesToPopulate = map(
        keys(pickBy(state.nodesToPopulate, node => node)),
        nodeId => state.nodes[nodeId]
    );

    console.log({ nodesToPopulate });
    forEach(filter(values(nodesToPopulate), node => !node.data.populated), node => {
        console.log(node);
        const nodeId = node.data.id;
        const id = last(split(node.data.uri, ":"));

        const relatedArtistsForNode = hydratedRelatedArtists[id];

        const childNodes = map(relatedArtistsForNode, relatedArtist => {
            console.log(state.nodes, nodeId);
            const newNodeId = uuidv1();
            // Add the child node to the array
            state.nodes[nodeId].children.push(newNodeId);

            // Add the new node to state
            set(state, ["nodes", newNodeId], {
                children: [],
                data: {
                    id: newNodeId,
                    uri: relatedArtist.uri,
                    name: relatedArtist.name
                }
            });
        });

        // Don't repopulate node now;
        relatedArtistsForNode && set(state, ["nodes", nodeId, "data", "populated"], true);
    });

    return state;
};

export default connect(
    createStructuredSelector({
        hydratedRelatedArtists: hydratedRelatedArtistsSelector
    }),
    { initializeOnDiscoverStart, getRelatedArtistsStart, getArtistTopTracksStart, showSideBar }
)(Discover);
