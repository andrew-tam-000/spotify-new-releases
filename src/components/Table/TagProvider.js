import { compose, withProps, withPropsOnChange, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import queryString from "query-string";
import {
    queryParamsSelector,
    queryParamsTagsSelector,
    genreColorsMapSelector
} from "../../selectors";
import { encodedStringifiedToObj } from "../../utils";
import { get, thru, includes, concat, filter, find } from "lodash";

// Dependes on query strings!
const TagProvider = ({ children, onClick, active, color }) =>
    children({
        onClick,
        active,
        color
    });

export default compose(
    connect(
        createStructuredSelector({
            queryParamsTags: queryParamsTagsSelector,
            queryParams: queryParamsSelector,
            genreColorsMap: genreColorsMapSelector
        }),
        { push }
    ),
    withPropsOnChange(
        ["queryParamsTags", "id", "genreColorsMap"],
        ({ queryParamsTags, id, genreColorsMap }) => ({
            active: includes(queryParamsTags, id),
            color: genreColorsMap[id]
        })
    ),
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
