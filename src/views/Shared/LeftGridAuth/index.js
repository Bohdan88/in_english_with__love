import React from "react";
import { Grid, Image, Header } from "semantic-ui-react";

import logo from "../../../assets/images/default.png";

// style
import "./style.scss";

const LeftGridAuth = () => {
  return (
    <Grid.Column className="left-side-sign">
      <Header className="left-side-header form-header" as="h3">
        IN ENGLISH WITH <span className="style-love">LOVE</span>
      </Header>
      <Image className="left-logo-size" src={logo} />
      <Header className="left-side-header form-header" as="h3">
        LEARN NATURALLY.
      </Header>
    </Grid.Column>
  );
};

export default LeftGridAuth;
