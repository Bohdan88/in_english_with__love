import React, { Component } from "react";
// import { FirebaseContext } from "../Firebase";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROLES from "../../constants/roles";
import {
  ERROR_CODE_ACCOUNT_EXISTS,
  ERROR_MSG_ACCOUNT_EXISTS,
} from "../../constants/shared";
import * as ROUTES from "../../constants/routes";
import { Grid, Header, Image, Form } from "semantic-ui-react";
import { LOGO_LINK } from "../../constants/shared";
import { SignButton, FormInput, AnotherAccount } from "../Shared";

const INITIAL_STATE = {
  username: "",
  email: "",
  password: "",
  "repeat password": "",
  passwordTwo: "",
  isAdmin: false,
  error: null,
};

const SignUpPage = () => (
  /* <div>
    {/* <h1>SignUp</h1>
    <SignUpForm /> */
  <Grid columns={2} className="sign-grid">
    <Grid.Row>
      <Grid.Column className="left-side-sign">
        <Header className="left-side-header form-header" as="h2">
          IN ENGLISH WITH <span className="style-love">LOVE</span>
        </Header>
        <Image className="left-logo-size" src={LOGO_LINK} />
        <Header className="left-side-header form-header" as="h2">
          LEARN NATURALLY.
        </Header>
      </Grid.Column>
      <Grid.Column>
        <SignUpForm />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { username, email, password, isAdmin, error } = this.state;
    if (username === "") {
      this.setState({
        error: {
          message: "A username should have at least 4 characters.",
        },
      });
      // error.message = "OK"
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
          });
        })
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          // // props from the router
          this.props.history.push(ROUTES.HOME);
        })
        .catch((error) => {
          if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
            error.message = ERROR_MSG_ACCOUNT_EXISTS;
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
    const {
      username,
      email,
      password,
      passwordTwo,
      error,
      isAdmin,
    } = this.state;
    // console.log(this.state["repeat password"], 'this.stae')
    const isInvalid =
      password !== this.state["repeat password"] ||
      password === "" ||
      email === "" ||
      username === "";

    return (
      <div>
        <Form className="sign-form" onSubmit={this.onSubmit}>
          <div className="container-form-header">
            <Header className="form-header" as="h2">
              SIGN UP
            </Header>
            {error &&
              error.message &&
              !error.message.includes("password") &&
              !error.message.includes("username") &&
              !error.message.includes("email") && (
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
          {/* <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />{" "} */}
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
          <br />
          {/* <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          /> */}
          <br />

          {/* <button
             disabled={isInvalid}  
            type="submit"
          >
            Sign Up
          </button>  */}
          <AnotherAccount
            history={this.props.history}
            firebase={this.props.firebase}
            actionType="SIGN UP"
          />
          <div className="container-account-ask">
            <p className="">
              ALREADY HAVE AN ACCOUNT?
              <span className="sign-word">
                <Link to={ROUTES.SIGN_IN}>SIGN IN</Link>
              </span>
            </p>
          </div>
          {/* {error && <p>{error.message}</p>} */}
        </Form>
        {/* </form> */}
        {/* <label>
            Admin:
            <input
              name="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeCheckbox}
            />
          </label> */}
      </div>
    );
  }
}

const SignUpLink = () => (
  /* <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link> */
  <p>
    Already have an account?? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
