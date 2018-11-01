import React, { Component } from "react";
import { initializeOnNewReleasesStart } from "../redux/actions";
import { connect } from "react-redux";

export default function fetchNewReleases(ComponentToWrap) {
    class FetchNewReleases extends Component {
        componentDidMount() {
            this.props.initializeOnNewReleasesStart();
        }
        render() {
            return <ComponentToWrap {...this.props} />;
        }
    }

    return connect(
        null,
        { initializeOnNewReleasesStart }
    )(FetchNewReleases);
}
