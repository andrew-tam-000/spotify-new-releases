import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { myLibraryDataSelector } from "../../selectors/tables";
import { loadingAnalyzerTableSelector } from "../../selectors/";

import TableWithTags from "../Table/TableWithTags";
const mapStateToProps = createStructuredSelector({
    tableData: myLibraryDataSelector,
    loading: loadingAnalyzerTableSelector
});

export default connect(mapStateToProps)(TableWithTags);
