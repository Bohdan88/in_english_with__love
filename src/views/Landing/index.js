import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//style
import "./style.scss";
import Footer from "../Shared/Footer";
import { Segment } from "semantic-ui-react";
import { NON_FOOTER_PAGES } from "../../constants/routes";

const doesPathHaveFooter = (currentPath) =>
  NON_FOOTER_PAGES.some((path) => currentPath.includes(path));

const Landing = ({ children }) => {
  // get current url
  const pathname = useLocation().pathname;

  const [footerView, setFooterView] = useState(doesPathHaveFooter(pathname));

  useEffect(() => {
    setFooterView(doesPathHaveFooter(pathname));
  }, [pathname]);

  const headerHight = "80px";
  const footerHeight = "70px";

  return (
    <div className="landing-wrapper">
      <Segment
        className="main-content-container"
        style={{
          height: `calc(100% - ${headerHight} - ${
            !footerView ? footerHeight : "0px"
          })`,
        }}
      >
        {children}
      </Segment>
      {!footerView && <Footer />}
    </div>
  );
};

export default Landing;
