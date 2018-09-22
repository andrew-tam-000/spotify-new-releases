import React from "react";
import { map, filter } from "lodash";
import { tableConfig } from "./SongTable";
import { advancedSearchUpdateTrack } from "../../redux/actions";
import { connect } from "react-redux";
import styled from "styled-components";
import _CustomSlider from "./CustomSlider";

const CustomSlider = styled(_CustomSlider)`
    padding: 10px;
`;

// TODO: Each slider should be connceted directly;
const RelatedSearchForm = ({ track, value, advancedSearchUpdateTrack, index, ...props }) => (
    <form {...props}>
        {map(filter(tableConfig, "tunable"), ({ dataKey, label, min, max }) => (
            <CustomSlider
                min={min}
                max={max}
                key={label}
                dataKey={dataKey}
                index={index}
                handleChange={advancedSearchUpdateTrack}
                label={label}
                minValue={track[`min_${dataKey}`]}
                maxValue={track[`max_${dataKey}`]}
            />
        ))}
    </form>
);

export default connect(
    null,
    { advancedSearchUpdateTrack }
)(RelatedSearchForm);
