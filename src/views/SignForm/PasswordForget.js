import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PASSWORD_FORGET_INIT } from "../../constants";
import { Header, Form } from "semantic-ui-react";
import { SignButton } from "../Shared";

import { FormInput, SignLanding } from "./Components";

// style
import "./style.scss";

const PasswordForgetPage = () => (
  <SignLanding>
    <PasswordForgetForm />
  </SignLanding>
);

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...PASSWORD_FORGET_INIT };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...PASSWORD_FORGET_INIT });
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { error } = this.state;

    return (
      <Form className="forget-password-form" onSubmit={this.onSubmit}>
        <div className="container-form-header">
          <Header className="form-header" as="h3">
            Forgot your password?
          </Header>
          {error && error.message && (
            <p className="error-no-user">{`${error.message.split(".")[0]}.`}</p>
          )}
        </div>

        <FormInput
          styleVal="email-signin"
          type="email"
          value="email"
          onChange={this.onChange}
        />
        <SignButton value="RESET MY PASSWORD" />
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <div className="container-forgot-password">
    <p>
      <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
  </div>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
