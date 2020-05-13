import React, { useState } from "react";
import CustomEditor from "../../../Editor";

const BeforeWatch = ({ sectionKey }) => {
  // [isEditorEmpty, setEditorState] = useState(false);
  //
  // onEditorTextChange = (value) => setEditorState(value);
  return (
    <div>
      <CustomEditor
        sectionKey={sectionKey}
        /* onEditorTextChange={onEditorTextChange} */
        /* firebase={this.props.firebase} */
      />
    </div>
  );
};

export default BeforeWatch;
