import React from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { advancedSearchResultsSelector } from "../../selectors";
import PlayButton from "./PlayButton";

const Results = ({ advancedSearchResults: { tracks } = {} }) => (
    <List>
        {map(tracks, track => (
            <ListItem key={track.id}>
                <PlayButton uri={track.uri} />
                <ListItemText primary={track.name} secondary={track.artists[0].name} />
            </ListItem>
        ))}
    </List>
);

export default connect(
    createStructuredSelector({ advancedSearchResults: advancedSearchResultsSelector })
)(Results);
