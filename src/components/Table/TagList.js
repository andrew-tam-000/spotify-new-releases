import React from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import { map } from "lodash";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import Typography from "@material-ui/core/Typography";

const DragHandle = SortableHandle(() => <DragIndicatorIcon color='action' fontSize='small'/>); // This can be any component you want

const StyledTag = styled.span.attrs({
    fontWeight: props => (props.active ? 600 : 400)
})`
    background-color: ${props => props.backgroundColor};
    padding: 5px;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    display: flex;
`;

const Tag = ({...props, children}) => (
    <StyledTag {...props} >
        <DragHandle />
        {children}
    </StyledTag>
);

const SortableTag = SortableElement(Tag);

const TagListWrapper = styled.div`
    display: flex;
    overflow: scroll;
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
