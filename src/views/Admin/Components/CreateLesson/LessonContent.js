import React from "react";
import CustomEditor from "../../../Editor/CustomEditor";

const LessonContent = ({ sectionKey }) => {
  return (
    <div>
      <CustomEditor sectionKey={sectionKey} />
    </div>
  );
};

export default LessonContent;
