import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { map, keys } from "lodash";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { openNewReleaseModal, setNewReleaseModalGenre } from "../../redux/actions";
import _ChevronLeft from "@material-ui/icons/ChevronLeft";
import _ChevronRight from "@material-ui/icons/ChevronRight";

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
    margin-left: 20px;
    margin-right: 20px;
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
const ChevronRight = styled(_ChevronRight)`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
`;

const ChevronLeft = styled(_ChevronLeft)`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
`;

const ItemTagListWrapper = styled.div`
    position: relative;
`;

class GenresWithScroll extends Component {
    scrollLeft = e => {
        e.stopPropagation();
        const currentTarget = e.currentTarget;
        const parent = currentTarget.parentElement.firstElementChild;
        const scroll = parent.scrollLeft;
        parent.scrollLeft -= 200;
    };

    scrollRight = e => {
        e.stopPropagation();
        const currentTarget = e.currentTarget;
        const parent = currentTarget.parentElement.firstElementChild;
        const scroll = parent.scrollLeft;
        parent.scrollLeft += 200;
    };

    render() {
        const { genres } = this.props;
        return (
            <React.Fragment>
                <Genres>
                    {map(genres, genre => (
                        <TagProvider id={genre}>
                            {({ active, onClick, color }) => (
                                <TagWithOpenModal
                                    genre={genre}
                                    color={active ? color || "transparent" : undefined}
                                >
                                    <Typography variant="caption">{genre}</Typography>
                                </TagWithOpenModal>
                            )}
                        </TagProvider>
                    ))}
                </Genres>
                {genres.length ? (
                    <React.Fragment>
                        <ChevronLeft color="action" onClick={this.scrollLeft} />
                        <ChevronRight color="action" onClick={this.scrollRight} />
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        );
    }
}

const ItemTagList = ({ className, genres }) => (
    <ItemTagListWrapper className={className}>
        <GenresWithScroll genres={genres} />
    </ItemTagListWrapper>
);

export default ItemTagList;
