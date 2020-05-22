import React from "react";
import CustomEditor from "../../../Editor/CustomEditor";

const BeforeWatch = ({ sectionKey }) => {
  return (
    <div>
      <CustomEditor sectionKey={sectionKey} />
    </div>
  );
};

export default BeforeWatch;
