import React from "react";
import CustomEditor from "../../../Editor";

const LessonContent = ({ sectionKey }) => {
  return (
    <div>
      <CustomEditor sectionKey={sectionKey} />
    </div>
  );
};

export default LessonContent;
