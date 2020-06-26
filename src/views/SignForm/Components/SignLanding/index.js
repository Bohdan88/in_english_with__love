import React from "react";
import { Grid } from "semantic-ui-react";
import LeftGridAuth from "../../../Shared/LeftGridAuth";

// style
import "./style.scss";

const SignLanding = (props) => {
  return (
    <Grid className="sign-grid">
      <Grid.Row columns={2} className="sign-grid-row">
        <LeftGridAuth />
        <Grid.Column
          mobile={16}
          tablet={9}
          computer={8}
          className="sign-column"
          floated="left"
        >
          {props.children}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SignLanding;
