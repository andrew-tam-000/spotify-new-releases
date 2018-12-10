import React from "react";
import Typography from "@material-ui/core/Typography";
import { formatDate } from "../../utils";

const Date = ({ date }) => <Typography variant="h6">{formatDate(date)}</Typography>;

export default Date;
