import React from "react";
import styled from "styled-components";
import { compose, withProps, withHandlers } from "recompose";
import { createStructuredSelector } from "reselect";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { queryParamsSelector } from "../../selectors";
import { encodedStringifiedToObj } from "../../utils";
import { thru, includes, concat, filter } from "lodash";

const TagWrapper = styled.span.attrs({
    backgroundColor: props => props.backgroundColor,
    fontWeight: props => (props.active ? 600 : 400)
})`
    background-color: ${props => props.backgroundColor}
    font-weight:  ${props => props.fontWeight}
    color: white;
    padding: 10px;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
`;

// Dependes on query strings!
const Tag = ({ children, onClick, active, element }) => element;

export default compose(
    connect(
        createStructuredSelector({ queryParams: queryParamsSelector }),
        { push }
    ),
    withProps(({ queryParams: { tags }, id }) => ({
        active: includes(encodedStringifiedToObj(tags), id)
    })),
    withHandlers({
        onClick: ({ push, queryParams, id, active }) => () =>
            push({
                search:
                    "?" +
                    queryString.stringify({
                        ...queryParams,
                        tags: encodeURI(
                            JSON.stringify(
                                thru(
                                    encodedStringifiedToObj(queryParams.tags, []),
                                    // If we have the tag already, then remove it
                                    // Else, add it
                                    tags =>
                                        active ? filter(tags, tag => tag !== id) : concat(tags, id)
                                )
                            )
                        )
                    })
            })
    }),
    withProps(({ active, backgroundColor, onClick, children }) => ({
        element: (
            <TagWrapper
                onClick={onClick}
                active={active}
                children={children}
                backgroundColor={backgroundColor}
            />
        )
    }))
)(Tag);
