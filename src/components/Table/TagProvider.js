import { compose, withProps, withPropsOnChange, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { queryParamsSelector, queryParamsTagsSelector, genreColorsSelector } from "../../selectors";
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
            genreColors: genreColorsSelector
        }),
        { push }
    ),
    withPropsOnChange(
        ["queryParamsTags", "id", "genreColors"],
        ({ queryParamsTags, id, genreColors }) => ({
            active: includes(queryParamsTags, id),
            color: get(find(genreColors, ({ genre }) => genre === id), "color")
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
