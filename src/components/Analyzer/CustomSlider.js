import React, { Component } from "react";
import styled from "styled-components";
import { join } from "lodash";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import TextField from "@material-ui/core/TextField";

const SliderWrapper = styled.div`
    display: flex;
`;
class CustomSlider extends Component {
    handleUpdateMin = val => {
        this.props.handleChange(this.props.index, {
            [join(["min", this.props.dataKey], "_")]: val
        });
    };
    handleUpdateMax = val =>
        this.props.handleChange(this.props.index, {
            [join(["max", this.props.dataKey], "_")]: val
        });
    handleUpdateMinSlider = (e, val) => this.handleUpdateMin(val);
    handleUpdateMaxSlider = (e, val) => this.handleUpdateMax(val);
    handleUpdateMinText = e => this.handleUpdateMin(Number(e.target.value));
    handleUpdateMaxText = e => this.handleUpdateMax(Number(e.target.value));
    render() {
        const { min, max, minValue, maxValue, label, ...props } = this.props;
        return (
            <div {...props}>
                <Typography id="label">{label}</Typography>
                <SliderWrapper>
                    <TextField value={minValue} onChange={this.handleUpdateMinText} />
                    <Slider
                        min={min}
                        max={max}
                        value={minValue}
                        aria-labelledby="label"
                        onChange={this.handleUpdateMinSlider}
                    />
                </SliderWrapper>
                <SliderWrapper>
                    <TextField value={maxValue} onChange={this.handleUpdateMaxText} />
                    <Slider
                        min={min}
                        max={max}
                        value={maxValue}
                        aria-labelledby="label"
                        onChange={this.handleUpdateMaxSlider}
                    />
                </SliderWrapper>
            </div>
        );
    }
}

CustomSlider.defaultProps = {
    min: 0,
    max: 1
};

export default CustomSlider;
