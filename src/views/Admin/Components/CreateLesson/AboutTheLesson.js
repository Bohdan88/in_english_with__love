import React from "react";
import CustomEditor from "../Editor/CustomEditor";

const AboutTheLesson = ({ sectionKey }) => {
  return (
    <div>
      <CustomEditor sectionKey={sectionKey} />
    </div>
  );
};

export default AboutTheLesson;
