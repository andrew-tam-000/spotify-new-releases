import { compose, withPropsOnChange, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
    queryParamsSelector,
    queryParamsTagsSelector,
    genreColorsMapSelector
} from "../../selectors";
import { includes } from "lodash";
import { toggleTagFromQuery } from "../../redux/actions";

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
        { toggleTagFromQuery }
    ),
    withPropsOnChange(
        ["queryParamsTags", "id", "genreColorsMap"],
        ({ queryParamsTags, id, genreColorsMap }) => ({
            active: includes(queryParamsTags, id),
            color: genreColorsMap[id]
        })
    ),
    withHandlers({
        onClick: ({ queryParams, id, active, toggleTagFromQuery }) => () => toggleTagFromQuery(id)
    })
)(TagProvider);
