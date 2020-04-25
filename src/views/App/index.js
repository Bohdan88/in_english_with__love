import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "../Navigation";
// import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import { AuthUserContext } from "../Session";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import Read from "../Read";
import Listen from "../Listen";
import Write from "../Write";
import { withAuthentication } from "../Session";
import Blog from "../Blog";
import About from "../About";
import { createBrowserHistory } from "history";
import * as ROUTES from "../../constants/routes";

const hist = createBrowserHistory();

const App = () => {
  return (
    <div>
      <Router history={hist}>
        <div>
          <Navigation />
          {/* <Switch> */}
          <div className="land-container">
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.WRITE} component={Write} />
            <Route path={ROUTES.READ} component={Read} />
            <Route path={ROUTES.LISTEN} component={Listen} />
            <Route path={ROUTES.BLOG} component={Blog} />
            <Route path={ROUTES.ABOUT} component={About} />
          </div>
          {/* </Switch> */}
        </div>
      </Router>
    </div>
  );
};

export default withAuthentication(App);
