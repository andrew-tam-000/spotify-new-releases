import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import { filter, forEach, last, keys, split, map, pickBy, values, set, merge } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { showSideBarSelector, discoverNodesSelector, discoverRootNodeSelector } from "../selectors";
import styled from "styled-components";
import {
    initializeOnDiscoverStart,
    getRelatedArtistsStart,
    getArtistTopTracksStart,
    toggleNode,
    showSideBar
} from "../redux/actions";
import * as d3 from "d3";
import store from "../redux/";

window.d3 = d3;

const View = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
`;

const diagonal = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

const zoom = d3.zoom().on("zoom", zoomed);

const svg = d3
    .create("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("font", "14px sans-serif")
    .style("user-select", "none")
    .call(zoom)
    .on("dblclick.zoom", null);

const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

const gNode = svg.append("g").attr("cursor", "pointer");

// Size between nodes
const tree = d3.tree().nodeSize([80, 200]);

function zoomed() {
    const dimensions = svg.node().getBoundingClientRect();
    const newCoordinates = d3.event.transform.translate(
        dimensions.width / 2,
        dimensions.height / 2
    );
    gLink.attr("transform", d3.event.transform);
    gNode.attr("transform", d3.event.transform);
}

function center() {
    const dimensions = svg.node().getBoundingClientRect();
    svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(dimensions.width / 2, dimensions.height / 2)
    );
}
class Discover extends Component {
    buildTreeData() {
        const rawTree = addChildren(
            this.props.discoverNodes,
            this.props.discoverNodes[this.props.discoverRootNode] || {}
        );

        const d3Tree = d3.hierarchy(rawTree);
        d3Tree.x0 = 100 / 2;
        d3Tree.y0 = 0;
        d3Tree.eachAfter(d => set(d, "id", d.data.renderKey));

        return d3Tree;

        function addChildren(nodes, { data = {}, children }) {
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
                this.props.toggleNode(d.data.id);
            });

        nodeEnter
            .append("circle")
            .attr("r", 5)
            .attr("fill", d => (d._children ? "#555" : "#999"))
            .on("click", d => {
                d3.event.stopPropagation();
                this.props.showSideBar("node", d.data.id);
            });

        nodeEnter
            .append("image")
            .attr("xlink:href", d => d.data.image)
            .attr("x", "-30px")
            .attr("y", "-30px")
            .attr("width", "60px")
            .attr("height", "60px")
            .on("click", d => {
                d3.event.stopPropagation();
                this.props.showSideBar("node", d.data.id);
            });

        nodeEnter
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => 35)
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
    }

    componentDidMount() {
        this.props.initializeOnDiscoverStart();
        this.createTree();
    }

    componentDidUpdate(prevProps) {
        // If the root changed, lets recenter
        if (this.props.discoverRootNode !== prevProps.discoverRootNode) {
            center();
        }
    }

    render() {
        this.props.discoverRootNode && this.updateTree(this.buildTreeData());
        return <View innerRef={tree => (this.tree = tree)} />;
    }
}

export default connect(
    createStructuredSelector({
        discoverNodes: discoverNodesSelector,
        discoverRootNode: discoverRootNodeSelector
    }),
    {
        toggleNode,
        initializeOnDiscoverStart,
        getRelatedArtistsStart,
        getArtistTopTracksStart,
        showSideBar
    }
)(Discover);
