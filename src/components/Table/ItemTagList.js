import styled from "styled-components";
import TagProvider from "../Table/TagProvider";
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { map } from "lodash";
import { connect } from "react-redux";
import { compose, withProps } from "recompact";
import { openNewReleaseModal, setNewReleaseModalGenre } from "../../redux/actions";
import Scrollbar from "smooth-scrollbar";

const Tag = styled.span`
    background-color: ${props => props.color};
    padding: 2px 4px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-right: 2px;
    cursor: pointer;
    opacity: ${props => (props.color ? 1 : ".4")};
    white-space: nowrap;
`;

const Genres = styled.div`
    display: flex;
    flex-wrap: nowrap;
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
const ItemTagListWrapper = styled.div`
    position: relative;
    & .scrollbar-track {
        display: none !important;
    }
`;

class ReactScrollbar extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
    }
    componentDidMount() {
        this.scrollbar = Scrollbar.init(this.wrapper.current);
    }
    render() {
        return <div ref={this.wrapper}>{this.props.children}</div>;
    }
    componentWillUnmount() {
        this.scrollbar.destroy();
    }
}

const ItemTagList = ({ className, genres }) => (
    <ItemTagListWrapper className={className}>
        <ReactScrollbar>
            <Genres>
                {map(genres, genre => (
                    <TagProvider key={genre} id={genre}>
                        {({ active, onClick, color }) => (
                            <TagWithOpenModal
                                genre={genre}
                                color={active ? color || "transparent" : undefined}
                            >
                                <Typography>{genre}</Typography>
                            </TagWithOpenModal>
                        )}
                    </TagProvider>
                ))}
            </Genres>
        </ReactScrollbar>
    </ItemTagListWrapper>
);

export default ItemTagList;
