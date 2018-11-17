import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { map } from "lodash";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { openNewReleaseModal, setNewReleaseModalGenre } from "../../redux/actions";

const Tag = styled.span`
    background-color: ${props => props.color};
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-right: 2px;
    cursor: pointer;
    opacity: ${props => (props.color ? 1 : ".4")};
    white-space: nowrap;
`;

const Genres = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
`;

const withOpenModal = compose(
    connect(
        null,
        { openNewReleaseModal, setNewReleaseModalGenre }
    ),
    withProps(({ openNewReleaseModal, genre, setNewReleaseModalGenre }) => ({
        onClick: e => {
            e.stopPropagation();
            openNewReleaseModal();
            setNewReleaseModalGenre(genre);
        }
    }))
);

const TagWithOpenModal = withOpenModal(Tag);

const ItemTagList = ({ className, genres }) => (
    <Genres className={className}>
        {map(genres, genre => (
            <TagProvider id={genre}>
                {({ active, onClick, color }) => (
                    <TagWithOpenModal genre={genre} color={active ? color || "transparent" : undefined}>
                        <Typography variant="caption">
                            {genre}
                        </Typography>
                    </TagWithOpenModal>
                )}
            </TagProvider>
        ))}
    </Genres>
);

export default ItemTagList;
