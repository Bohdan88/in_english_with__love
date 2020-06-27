import { PasswordForgetPage, SignUpPage, SignInPage } from "../views/SignForm";
import HomePage from "../views/Home";
import AccountPage from "../views/Account";
import AdminPage from "../views/Admin";
import CategoryTopics from "../views/CategoryTopics";
import TopicList from "../views/TopicList";
import LessonView from "../views/LessonView";
import About from "../views/About";
import PrivacyPolicy from "../views/PrivacyPolicy";

import * as ROUTES from "../constants/routes";

const routes = [
  {
    path: ROUTES.HOME,
    exact: true,
    name: "Home",
    component: HomePage,
  },
  {
    path: ROUTES.READ,
    name: "Read",
    component: CategoryTopics,
  },
  {
    path: ROUTES.LISTEN,
    name: "Listen",
    component: CategoryTopics,
  },
  {
    path: ROUTES.LESSON_TOPIC_LIST,
    name: "Topics",
    component: TopicList,
  },
  {
    path: ROUTES.ABOUT,
    name: "About",
    component: About,
  },
  {
    path: ROUTES.ACCOUNT,
    name: "Account",
    component: AccountPage,
  },
  {
    path: ROUTES.ADMIN,
    name: "Admin",
    component: AdminPage,
  },
  {
    path: ROUTES.LESSON_TOPIC,
    name: "Lesson Topic",
    component: LessonView,
  },
  {
    path: ROUTES.PASSWORD_FORGET,
    name: "Forget Password",
    component: PasswordForgetPage,
  },
  {
    path: ROUTES.SIGN_IN,
    name: "Sign in",
    component: SignInPage,
  },
  {
    path: ROUTES.SIGN_UP,
    name: "Sign up",
    component: SignUpPage,
  },
  {
    path: ROUTES.PRIVACY_POLICY,
    component: PrivacyPolicy,
  },
];

export default routes;
