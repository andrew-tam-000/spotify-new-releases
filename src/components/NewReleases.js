import React, { Component } from "react";
import { getNewReleasesStart } from "../redux/actions";
import { connect } from "react-redux";

class NewReleases extends Component {
    componentDidMount() {
        this.props.getNewReleasesStart();
    }
    render() {
        return <div>hi</div>;
    }
}

export default connect(
    null,
    { getNewReleasesStart }
)(NewReleases);
