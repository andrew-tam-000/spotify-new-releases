import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { showSideBarSelector } from "../selectors";
import styled from "styled-components";

const Sidebar = styled.div`
    width: 33%;
    overflow: auto;
`;

const _Sidebar = ({ showSideBar, children }) =>
    showSideBar ? <Sidebar>{children}</Sidebar> : null;

export default connect(
    createStructuredSelector({
        showSideBar: showSideBarSelector
    })
)(_Sidebar);
