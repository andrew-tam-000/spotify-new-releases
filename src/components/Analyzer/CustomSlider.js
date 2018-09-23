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
    handleUpdateMin = val =>
        this.props.handleChange({
            [join(["min", this.props.dataKey], "_")]: Number(val.toFixed(this.props.tolerance))
        });
    handleUpdateMax = val =>
        this.props.handleChange({
            [join(["max", this.props.dataKey], "_")]: Number(val.toFixed(this.props.tolerance))
        });
    handleUpdateMinSlider = (e, val) => this.handleUpdateMin(val);
    handleUpdateMaxSlider = (e, val) => this.handleUpdateMax(val);
    handleUpdateMinText = e => this.handleUpdateMin(Number(e.target.value));
    handleUpdateMaxText = e => this.handleUpdateMax(Number(e.target.value));
    handleUpdateClear = e => {
        this.handleUpdateMin(undefined);
        this.handleUpdateMax(undefined);
    };
    render() {
        const { min, max, minValue, maxValue, label, ...props } = this.props;
        return (
            <div {...props}>
                <div>
                    <Typography id="label">{label}</Typography>
                    <div onClick={this.handleUpdateClear}>CLEAR</div>
                </div>
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
    tolerance: 2,
    minValue: "",
    maxValue: ""
};

export default CustomSlider;
