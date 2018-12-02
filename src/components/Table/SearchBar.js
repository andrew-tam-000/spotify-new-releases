import React from "react";
import { compose, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import qs from "qs";
import { queryParamsSelector } from "../../selectors";
import TextField from "@material-ui/core/TextField";

// Dependes on query strings!
const Search = ({ queryParams: { search }, onChange, ...props }) => (
    <TextField placeholder="Search..." value={search} onChange={onChange} />
);

export default compose(
    connect(
        createStructuredSelector({ queryParams: queryParamsSelector }),
        { push }
    ),
    withHandlers({
        onChange: ({ queryParams, push }) => e =>
            push({
                search:
                    "?" +
                    qs.stringify({
                        ...queryParams,
                        search: e.target.value
                    })
            })
    })
)(Search);
