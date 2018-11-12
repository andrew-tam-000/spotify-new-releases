import { addGenreColors, removeGenreColors, reorderTags } from "../actions/";
import { arrayMove } from "react-sortable-hoc";

import { filter, map, omit, find } from "lodash";
export default function genreColors(state = [], { type, payload }) {
    switch (type) {
        case addGenreColors().type:
            return [
                ...map(
                    state,
                    existingGenre =>
                        find(
                            payload.genreColors,
                            newGenre => newGenre.genre === existingGenre.genre
                        ) || existingGenre
                ),
                // Filter the newly added genres
                ...filter(
                    payload.genreColors,
                    newGenre =>
                        // If you can't find the new genre in the existing genre
                        // then we should filter it out
                        !find(state, existingGenre => existingGenre.genre === newGenre.genre)
                )
            ];
        case removeGenreColors().type:
            // TODO;
            return omit(state, payload);
        case reorderTags().type:
            return arrayMove(state, payload.oldIndex, payload.newIndex);
        default:
            return state;
    }
}
