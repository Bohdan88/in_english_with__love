import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "../Navigation";
import { PasswordForgetPage, SignUpPage, SignInPage } from "../SignForm";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import CategoryTopics from "../CategoryTopics";
import TopicList from "../TopicList";
import LessonView from "../LessonView";
import { withAuthentication } from "../Session";
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
            <Route path={ROUTES.READ} component={CategoryTopics} />
            <Route path={ROUTES.LISTEN} component={CategoryTopics} />
            <Route path={ROUTES.ABOUT} component={About} />
            <Route path={ROUTES.LESSON_TOPIC_LIST} component={TopicList} />
            <Route path={ROUTES.LESSON_TOPIC} component={LessonView} />
          </div>
          {/* </Switch> */}
        </div>
      </Router>
    </div>
  );
};

export default withAuthentication(App);
