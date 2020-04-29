import React from "react";
import { Grid, Image, Header } from "semantic-ui-react";
import { LOGO_LINK } from "../../../constants/shared";
import "./style.scss";

const LeftGridAuth = () => {
  return (
    <Grid.Column className="left-side-sign">
      <Header className="left-side-header form-header" as="h2">
        IN ENGLISH WITH <span className="style-love">LOVE</span>
      </Header>
      <Image className="left-logo-size" src={LOGO_LINK} />
      <Header className="left-side-header form-header" as="h2">
        LEARN NATURALLY.
      </Header>
    </Grid.Column>
  );
};

export default LeftGridAuth;
