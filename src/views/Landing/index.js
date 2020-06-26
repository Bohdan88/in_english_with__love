import React from "react";

//style
import "./style.scss";
import Footer from "../Shared/Footer";
import { Segment } from "semantic-ui-react";
import { NON_FOOTER_PAGES } from "../../constants/routes";

const Landing = ({ children, history }) => {
  // some pages won't have footer,
  const isFooterExist = NON_FOOTER_PAGES.includes(history.location.pathname);
  return (
    <div className="landing-wrapper">
      <Segment
        className="main-content-container"
        style={{
          height: !isFooterExist ? "calc(100% - 148px)" : "100%",
        }}
        clearing
      >
        {children}
      </Segment>

      <Footer />
    </div>
  );
};

export default Landing;
