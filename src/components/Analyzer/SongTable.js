import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { myLibraryDataSelector } from "../../selectors/tables";

import TableWithTags from "../Table/TableWithTags";
const mapStateToProps = createStructuredSelector({
    tableData: myLibraryDataSelector
});

export default connect(mapStateToProps)(TableWithTags);
