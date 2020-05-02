import React, { Component } from "react";
// import { FirebaseContext } from "../Firebase";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { LOGO_LEFT_SIDE, LOGO_LINK, SIGN_IN } from "../../constants/shared";
import { Grid, Image, Form, Button, Header, Label } from "semantic-ui-react";
import * as ROUTES from "../../constants/routes";
// import logot from "./file.svg";
import "./style.scss";

import { SignButton, FormInput, AnotherAccount, LeftGridAuth } from "../Shared";
const INITIAL_STATE = {
  //   username: "",
  email: "",
  password: "",
  error: null,
};

{
  /* <div>
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div> */
}

const SignInPage = () => (
  <Grid columns={2} className="sign-grid">
    <Grid.Row >
      <LeftGridAuth />
      <Grid.Column className="sign-column">
        <SignInForm />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { username, email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        // props from the router
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    // prevent a reload of the browser
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { username, email, password, passwordTwo, error } = this.state;
    return (
      <div>
        <Form className="sign-form" onSubmit={this.onSubmit}>
          <div className="container-form-header">
            <Header className="form-header" as="h2">
              SIGN IN
            </Header>
            {error &&
              !error.message.includes("password") &&
              !error.message.includes("email") && (
                <p className="error-no-user">{`${
                  error.message.split(".")[0]
                }.`}</p>
              )}
          </div>

          <FormInput
            styleVal="email-signin"
            error={error}
            type="email"
            value="email"
            onChange={this.onChange}
          />
          <FormInput
            styleVal="password-signin"
            error={error}
            onChange={this.onChange}
            type="password"
            value="password"
          />
          <PasswordForgetLink />
          <SignButton value="SIGN IN" />
          <AnotherAccount
            type={SIGN_IN}
            history={this.props.history}
            firebase={this.props.firebase}
            noUser={"error-no-user"}
            actionType="SIGN IN"
          />
          <div className="container-account-ask">
            <p className="">
              Don't have an account?
              <span className="sign-word">
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
              </span>
            </p>
          </div>
        </Form>
      </div>
    );
  }
}

const SignInLink = () => (
  <p>
    Already have an account?? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm, SignInLink };
