import React from "react";
import { Button } from "semantic-ui-react";
import "./style.scss";

const SignButton = ({ value, onSubmit }) => {
  return (
    <Button className="sign-button" type="submit">
      <span className="button-text">{value}</span>
    </Button>
  );
};

export default SignButton;
