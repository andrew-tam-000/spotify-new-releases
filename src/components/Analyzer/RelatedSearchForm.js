import React from "react";
import { set, map, reduce, filter } from "lodash";
import { createStructuredSelector } from "reselect";
import tableConfig from "../../tableConfig";
import { advancedSearchUpdateAttributes } from "../../redux/actions";
import { advancedSearchAttributesSelector } from "../../selectors";
import { connect } from "react-redux";
import styled from "styled-components";
import _CustomSlider from "./CustomSlider";
import Button from "@material-ui/core/Button";

const CustomSlider = styled(_CustomSlider)`
    box-sizing: border-box;
    padding: 10px;
    width: 33%;
`;

// TODO: Each slider should be connceted directly;
const RelatedSearchForm = ({
    advancedSearchUpdateAttributes,
    advancedSearchAttributes,
    ...props
}) => (
    <React.Fragment>
        <Button onClick={advancedSearchUpdateAttributes}>Clear Filters</Button>
        <form {...props}>
            {map(filter(tableConfig, "tunable"), ({ dataKey, label, min, max, tolerance }) => (
                <CustomSlider
                    min={min || 0}
                    max={max || 1}
                    key={label}
                    dataKey={dataKey}
                    handleChange={advancedSearchUpdateAttributes}
                    label={label}
                    tolerance={tolerance}
                    minValue={advancedSearchAttributes[`min_${dataKey}`]}
                    maxValue={advancedSearchAttributes[`max_${dataKey}`]}
                />
            ))}
        </form>
    </React.Fragment>
);

export default connect(
    createStructuredSelector({
        advancedSearchAttributes: advancedSearchAttributesSelector
    }),
    dispatch => ({
        advancedSearchUpdateAttributes: val => dispatch(advancedSearchUpdateAttributes(val)),
        clearAttributes: () =>
            dispatch(
                advancedSearchUpdateAttributes(
                    reduce(
                        filter(tableConfig, "tunable"),
                        (acc, { dataKey }) =>
                            set(acc, `min_${dataKey}`, undefined) &&
                            set(acc, `max_${dataKey}`, undefined),
                        {}
                    )
                )
            )
    })
)(RelatedSearchForm);
