import React, { Component } from "react";
// import { FirebaseContext } from "../Firebase";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Header } from "semantic-ui-react";
import { PasswordForgetLink } from "./PasswordForget";
import { SIGN_IN } from "../../constants";
import * as ROUTES from "../../constants/routes";
import { SignButton } from "../Shared";
import { AnotherAccount, FormInput, SignLanding } from "./Components";

// style
import "./style.scss";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

const SignInPage = () => (
  <SignLanding>
    <SignInForm />
  </SignLanding>
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
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
    const { error } = this.state;
    return (
      <Form className="sign-form" onSubmit={this.onSubmit}>
        <div className="container-form-header">
          <Header className="form-header" as="h3">
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
