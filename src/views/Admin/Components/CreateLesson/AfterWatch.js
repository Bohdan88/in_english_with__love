import React from "react";
import CustomEditor from "../Editor/CustomEditor";

const AfterWatch = ({ sectionKey }) => {
  return (
    <div>
      <CustomEditor sectionKey={sectionKey} />
    </div>
  );
};

export default AfterWatch;
