import React, { Component } from "react";
import { initializeOnNewReleasesStart } from "../redux/actions";
import { connect } from "react-redux";
import Table from "./NewReleases/NewReleasesAlbumsTable";
//import Table from "./NewReleases/NewReleasesTracksTable";

class NewReleases extends Component {
    componentDidMount() {
        this.props.initializeOnNewReleasesStart();
    }
    render() {
        return <Table />;
    }
}

export default connect(
    null,
    { initializeOnNewReleasesStart }
)(NewReleases);
