import React from "react";
import { Grid, Image, Header, Container } from "semantic-ui-react";

import logo from "../../../assets/images/default.png";

// style
import "./style.scss";

const LeftGridAuth = () => {
  return (
    <Grid.Column className="left-side-sign" computer={7} textAlign="right">
      <div className="left-side-sign-container">
        <div className="left-side-sign-container-top-header">
          <Header as="h3">
            IN ENGLISH WITH <span className="style-love">LOVE</span>
          </Header>
        </div>
        <Image className="left-logo-size" src={logo} />
        <div className="left-side-sign-container-bottom-header">
          <Header as="h3">LEARN NATURALLY.</Header>
        </div>
      </div>
    </Grid.Column>
  );
};

export default LeftGridAuth;
