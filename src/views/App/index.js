import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { withAuthentication } from "../Session";
import { createBrowserHistory } from "history";
import * as ROUTES from "../../constants/routes";
import Footer from "../Shared/Footer";
import Navigation from "../Navigation";
import Landing from "../Landing";
import routes from "../../routes";
import { Segment } from "semantic-ui-react";

const hist = createBrowserHistory();

const App = () => {
  return (
    <Router history={hist}>
      <Navigation />

      <Landing history={hist}>
        <Switch>
          {routes.map((route) => {
            return (
              <Route
                key={route.path.slice(1)}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            );
          })}
          <Redirect to={ROUTES.HOME} />
        </Switch>
        {/* </Segment> */}
      </Landing>
    </Router>
  );
};

export default withAuthentication(App);
