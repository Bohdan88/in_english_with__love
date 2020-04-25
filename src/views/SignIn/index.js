import React, { Component } from "react";
// import { FirebaseContext } from "../Firebase";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { LOGO_LEFT_SIDE, LOGO_LINK } from "../../constants/shared";
import {
  Grid,
  Image,
  Form,
  Button,
  Header,
  Label,
  Statistic,
} from "semantic-ui-react";
import * as ROUTES from "../../constants/routes";
// import logot from "./file.svg";
import "./style.scss";

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
  <Grid columns={2} className="sign-in-grid">
    <Grid.Row>
      <Grid.Column className="left-side-sign">
        <Header className="left-side-header form-header" as="h2">
          IN ENGLISH WITH <span className="style-love">LOVE</span>
        </Header>
        <Image
          className="left-logo-size"
          /* src={LOGO_LINK} */
          src={LOGO_LINK}
        />
        <Header className="left-side-header form-header" as="h2">
          LEARN NATRALLY.
        </Header>
      </Grid.Column>
      <Grid.Column>
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

    const isInvalid = password === "" || email === "";

    return (
      <div>
        {/* background: #55C2Ad; */}
        {/* <form onSubmit={this.onSubmit}>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>
          {error && <p>{error.message}</p>}
        </form> */}
        <Form className="sign-in-form" onSubmit={this.onSubmit}>
          <div className="container-form-header">
            <Header className="form-header" as="h2">
              SIGN IN
            </Header>
          </div>
          <Form.Field>
            <label className="form-label">Login</label>
            <input className="form-input" placeholder="Login" />
          </Form.Field>
          <Form.Field>
            <label className="form-label">Password</label>
            <input className="form-input" placeholder="Password" />
          </Form.Field>
          <Button className="sign-button" type="submit">
            <span className="button-text">SIGN IN</span>
          </Button>
          <PasswordForgetLink />
          <SignUpLink />
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
