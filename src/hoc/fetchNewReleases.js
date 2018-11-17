import React, { Component } from "react";
import { getNewReleasesStart } from "../redux/actions";
import { connect } from "react-redux";

export default function fetchNewReleases(ComponentToWrap) {
    class FetchNewReleases extends Component {
        componentDidMount() {
            this.props.getNewReleasesStart();
        }
        render() {
            return <ComponentToWrap {...this.props} />;
        }
    }

    return connect(
        null,
        { getNewReleasesStart }
    )(FetchNewReleases);
}
