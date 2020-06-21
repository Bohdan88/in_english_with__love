import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PASSWORD_FORGET_INIT } from "../../constants/shared";
import { Grid, Header, Form } from "semantic-ui-react";
import { LeftGridAuth, SignButton } from "../Shared";

import { FormInput } from "./Components";

// style
import "./style.scss";

const PasswordForgetPage = () => (
  <Grid columns={2} className="sign-grid">
    <Grid.Row>
      <LeftGridAuth />
      <Grid.Column mobile={16} tablet={9} computer={8} verticalAlign="top">
        <PasswordForgetForm />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

// const INITIAL_STATE = {
//   email: "",
//   error: null,
// };

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
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <Form className="forget-password-form" onSubmit={this.onSubmit}>
        <div className="container-form-header">
          <Header className="form-header" as="h2">
            Forgot your password?
          </Header>
          {error && error.message && (
            <p className="error-no-user">{`${error.message.split(".")[0]}.`}</p>
          )}
        </div>

        <FormInput
          styleVal="email-signin"
          error={error}
          type="email"
          value="email"
          onChange={this.onChange}
        />
        <SignButton value="RESET MY PASSWORD" />
      </Form>
    );
  }
}

{
  /* <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form> */
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
