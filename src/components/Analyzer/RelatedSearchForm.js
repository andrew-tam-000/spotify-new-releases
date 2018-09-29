import React from "react";
import { set, map, reduce, filter } from "lodash";
import { createStructuredSelector } from "reselect";
import tableConfig from "../../tableConfig";
import { advancedSearchUpdateAttributes, advancedSearchSetGenres } from "../../redux/actions";
import { advancedSearchAttributesSelector, advancedSearchGenresSelector } from "../../selectors";
import { connect } from "react-redux";
import styled from "styled-components";
import _CustomSlider from "./CustomSlider";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import ArtistSelect from "./ArtistSelect";

const genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
];

const CustomSlider = styled(_CustomSlider)`
    box-sizing: border-box;
    padding: 10px;
    width: 33%;
`;

const GenreFormControl = styled(FormControl)`
    display: block !important;
    min-width: 100px;
`;

// TODO: Each slider should be connceted directly;
const RelatedSearchForm = ({
    advancedSearchUpdateAttributes,
    advancedSearchAttributes,
    advancedSearchGenres,
    advancedSearchSetGenres,
    clearAttributes,
    ...props
}) => (
    <React.Fragment>
        <GenreFormControl>
            <InputLabel>Genres</InputLabel>
            <Select
                multiple
                value={advancedSearchGenres}
                onChange={advancedSearchSetGenres}
                input={<Input />}
                renderValue={selected => (
                    <div>
                        {selected.map(value => (
                            <Chip key={value} label={value} />
                        ))}
                    </div>
                )}
            >
                {genres.map(name => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </GenreFormControl>

        <ArtistSelect />

        <Button onClick={clearAttributes}>Clear Filters</Button>
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
        advancedSearchAttributes: advancedSearchAttributesSelector,
        advancedSearchGenres: advancedSearchGenresSelector
    }),
    dispatch => ({
        advancedSearchSetGenres: e => dispatch(advancedSearchSetGenres(e.target.value)),
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
