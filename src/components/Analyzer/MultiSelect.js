import React, { Component } from "react";
import { includes, indexOf, filter, toLower } from "lodash";
import styled from "styled-components";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import _MenuItem from "@material-ui/core/MenuItem";

import { List } from "react-virtualized";

const MenuItem = styled(_MenuItem)`
    padding-top: 0 !important;
    padding-bottom: 0 !important;
`;

class VirtualizedList extends Component {
    state = {
        filter: ""
    };

    getFilteredOptions = () =>
        this.state.filter
            ? filter(this.props.options, options =>
                  includes(toLower(options.name), toLower(this.state.filter))
              )
            : this.props.options;

    onClick(id) {
        const index = indexOf(this.props["data-value"], id);
        this.props.onChange(
            index !== -1
                ? [
                      ...this.props["data-value"].slice(0, Math.max(index, 0)),
                      ...this.props["data-value"].slice(index + 1)
                  ]
                : [...this.props["data-value"], id]
        );
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style // Style object to be applied to row (to position it)
    }) => {
        const { id, name } = this.getFilteredOptions()[index];
        return (
            <MenuItem
                onClick={() => this.onClick(id)}
                key={id}
                value={id}
                style={style}
                selected={includes(this.props["data-value"], id)}
            >
                {name}
            </MenuItem>
        );
    };

    updateFilter = e => this.setState({ filter: e.target.value });
    render() {
        return (
            <React.Fragment>
                <TextField value={this.state.filter} onChange={this.updateFilter} />
                <List
                    width={300}
                    height={300}
                    rowCount={this.getFilteredOptions().length}
                    rowHeight={48}
                    _cacheBuster={this.props["data-value"]}
                    _cacheBusterFilter={this.state.filter}
                    rowRenderer={this.rowRenderer}
                />
            </React.Fragment>
        );
    }
}

// Select for some reason maps 'value' to 'data-value'
VirtualizedList.defaultProps = {
    options: [],
    "data-value": []
};

const MultiSelect = props => {
    const { label, labelGetter, value, options, onChange } = props;
    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={value}
                input={<Input />}
                renderValue={selected => (
                    <div>
                        {selected.map(value => (
                            <Chip key={value} label={labelGetter && labelGetter(value, props)} />
                        ))}
                    </div>
                )}
            >
                <VirtualizedList options={options} onChange={onChange} value={value} />
            </Select>
        </FormControl>
    );
};

export default MultiSelect;
