import React, { Component } from "react";
import { connect } from "react-redux";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";
import { Grid, Header, Form } from "semantic-ui-react";
import {
  ERROR_MESSAGES,
  INITIAL_FORM_STATE,
  ERROR_CODE_ACCOUNT_EXISTS,
} from "../../constants/shared";
import { SignButton, LeftGridAuth } from "../Shared";
import { setSessionValues } from "../../redux/actions";

import { FormInput, AnotherAccount } from "./Components";

const checkIfIncludes = (error, ...rest) =>
  error &&
  error.message &&
  [...rest].every(
    (el) => !error.message.toUpperCase().includes(el.toUpperCase())
  );

const SignUpPage = () => (
  <Grid columns={2} className="sign-grid">
    <Grid.Row>
      <LeftGridAuth />
      <Grid.Column mobile={16} tablet={9} computer={8}>
        <SignUpForm />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_FORM_STATE };
  }

  onSubmit = (event) => {
    const { username, email, password, isAdmin } = this.state;
    // check userName and password match
    if (username.length < 4) {
      this.setState({
        error: {
          message: ERROR_MESSAGES.username,
        },
      });
    } else if (password !== this.state["repeat password"]) {
      this.setState({
        error: {
          message: ERROR_MESSAGES.confirmPassword,
        },
      });
    } else {
      const roles = {};

      if (isAdmin) {
        roles[ROLES.ADMIN] = ROLES.ADMIN;
      }
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          // Create a user in your Firebase realtime database
          return this.props.firebase.user(authUser.user.uid).set({
            username,
            email,
            roles,
            // add completed lesson in case if user finished one before signing up
            lessonsCompleted: {
              ...JSON.parse(localStorage.getItem("firstCompletedLesson")),
            },
            signDate: new Date(),
          });
        })
        .then(() => {
          this.setState({ ...INITIAL_FORM_STATE });

          this.props.history.push(ROUTES.HOME);
        })
        .catch((error) => {
          if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
            error.message = ERROR_MESSAGES.accountExist;
          }
          this.setState({ error });
        });
    }
    // prevent a reload of the browser
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        <Form className="sign-form" onSubmit={this.onSubmit}>
          <div className="container-form-header">
            <Header className="form-header" as="h2">
              SIGN UP
            </Header>
            {checkIfIncludes(error, "password", "username", "email") && (
              <p className="error-no-user-sign-up">{`${
                error.message.split(".")[0]
              }.`}</p>
            )}
          </div>
          <FormInput
            styleVal="username"
            error={error}
            type="text"
            value="username"
            onChange={this.onChange}
          />
          <FormInput
            styleVal="email-signup"
            error={error}
            type="email"
            value="email"
            onChange={this.onChange}
          />
          <FormInput
            styleVal="password-signup"
            error={error}
            type="password"
            value="password"
            onChange={this.onChange}
          />

          <FormInput
            styleVal="repeat-password-signup"
            error={error}
            type="password"
            value="repeat password"
            onChange={this.onChange}
          />
          <SignButton value="SIGN UP" />
          <AnotherAccount
            history={this.props.history}
            firebase={this.props.firebase}
            noUser={"error-no-user-sign-up"}
            actionType="SIGN UP"
          />
          <div className="container-account-ask">
            <p className="">
              Already have an account?
              <span className="sign-word">
                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
              </span>
            </p>
          </div>
        </Form>
      </div>
    );
  }
}

/* check if admin
<label>
            Admin:
            <input
              name="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeCheckbox}
            />
          </label> */

const SignUpLink = () => (
  <p>
    Already have an account?? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const mapDispatchToProps = (dispatch) => {
  return {
    onAddFirstLesson: (values) => dispatch(setSessionValues(values)),
  };
};

const SignUpForm = compose(
  connect(null, mapDispatchToProps),
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
