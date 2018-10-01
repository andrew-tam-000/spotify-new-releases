import { compose, withPropsOnChange, withProps } from "recompose";
import { reduce, set, get } from "lodash";
import { createStructuredSelector } from "reselect";
import { advancedSearchSetArtists } from "../../redux/actions";
import { artistDropdownSelector, advancedSearchArtistsSelector } from "../../selectors";
import { connect } from "react-redux";
import MultiSelect from "./MultiSelect";

export default compose(
    connect(
        createStructuredSelector({
            options: artistDropdownSelector,
            value: advancedSearchArtistsSelector
        }),
        dispatch => ({
            onChange: id => {
                dispatch(advancedSearchSetArtists(id));
            }
        })
    ),
    withPropsOnChange(["artistData"], ({ options }) => ({
        artistDataMap: reduce(options, (acc, artist) => set(acc, artist.id, artist), {})
    })),
    withProps({
        label: "Artists",
        labelGetter: (value, { artistDataMap }) => get(artistDataMap, [value, "name"])
    })
)(MultiSelect);
