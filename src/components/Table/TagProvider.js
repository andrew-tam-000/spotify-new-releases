import { compose, withProps, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { queryParamsSelector } from "../../selectors";
import { encodedStringifiedToObj } from "../../utils";
import { thru, includes, concat, filter } from "lodash";

// Dependes on query strings!
const TagProvider = ({ children, onClick, active }) =>
    children({
        onClick,
        active
    });

export default compose(
    connect(
        createStructuredSelector({ queryParams: queryParamsSelector }),
        { push }
    ),
    withProps(({ queryParams: { tags }, id }) => ({
        active: includes(encodedStringifiedToObj(tags), id)
    })),
    withHandlers({
        onClick: ({ push, queryParams, id, active }) => () =>
            push({
                search:
                    "?" +
                    queryString.stringify({
                        ...queryParams,
                        tags: encodeURI(
                            JSON.stringify(
                                thru(
                                    encodedStringifiedToObj(queryParams.tags, []),
                                    // If we have the tag already, then remove it
                                    // Else, add it
                                    tags =>
                                        active ? filter(tags, tag => tag !== id) : concat(tags, id)
                                )
                            )
                        )
                    })
            })
    })
)(TagProvider);
