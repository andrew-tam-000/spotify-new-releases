import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import { map } from "lodash";

import Typography from "@material-ui/core/Typography";

const Tag = styled.span.attrs({
    fontWeight: props => (props.active ? 600 : 400)
})`
    background-color: ${props => props.backgroundColor};
    padding: 10px;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
`;
const SortableTag = SortableElement(Tag);

const TagListWrapper = styled.div`
    display: flex;
`;
const TagList = SortableContainer(({ tags, onClick, disabled }) => (
    <TagListWrapper>
        {map(tags, ({ genre, color }, index) => (
            <TagProvider key={genre} id={genre} backgroundColor={color}>
                {({ active, onClick }) => (
                    <SortableTag
                        disabled={disabled}
                        index={index}
                        onClick={onClick}
                        active={active}
                        backgroundColor={color}
                    >
                        <Typography>{genre}</Typography>
                    </SortableTag>
                )}
            </TagProvider>
        ))}
    </TagListWrapper>
));

export default TagList;
