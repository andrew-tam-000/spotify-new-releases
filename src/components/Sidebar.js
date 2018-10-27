import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { showSideBarSelector } from "../selectors";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { hideSideBar } from "../redux/actions";

const Sidebar = styled(Paper)`
    width: 33%;
    overflow: auto;
    padding: 10px;
`;

const _Sidebar = ({ showSideBar, children, hideSideBar }) =>
    showSideBar ? (
        <Sidebar>
            <div onClick={hideSideBar}>Close</div>
            {children}
        </Sidebar>
    ) : null;

export default connect(
    createStructuredSelector({
        showSideBar: showSideBarSelector
    }),
    { hideSideBar }
)(_Sidebar);
