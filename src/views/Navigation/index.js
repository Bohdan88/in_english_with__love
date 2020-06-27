import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Container, Image, Sticky, Grid } from "semantic-ui-react";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { SignOut } from "../SignForm";
import MobileMenu from "./MobileMenu";

// style
import "./style.scss";

// assets
import logo from "../../assets/images/default.png";

const identifyActiveLink = (routes) => {
  const currentPathName = window.location.pathname;
  const currentLocation = window.location.search;

  if (routes.includes(currentPathName)) {
    return currentPathName;
  } else if (currentPathName === ROUTES.LESSON_TOPIC_LIST) {
    // looking for the first '=' to understand its listen or read category
    const linkIndex = currentLocation.indexOf("=");
    const linkLastIndex = currentLocation.indexOf("&");

    // it could be either read or listen
    const linkName = currentLocation.slice(linkIndex + 1, linkLastIndex);
    return `/${linkName}`;
  }
  return null;
};

const NavigationAuth = ({ authUser }) => {
  const [activeItem, setActiveItem] = useState(ROUTES.SIGN_IN);

  useEffect(() => {
    setActiveItem(identifyActiveLink(ROUTES.ROLES_AUTH_ROUTES));
  }, [activeItem]);

  return (
    <Sticky className="nav-bar-sticky">
      <div className="nav-bar-menu-container">
        <Menu className="nav-bar-menu" borderless>
          <Menu.Menu className="main-menu">
            <Menu.Item className="logo-container">
              <Link onClick={() => setActiveItem(ROUTES.HOME)} to={ROUTES.HOME}>
                <Image className="menu-logo" src={logo} />
              </Link>
            </Menu.Item>
            {ROUTES.ROLES_AUTH_ROUTES.map((route) => {
              return (
                ((route === ROUTES.ADMIN && !!authUser.roles[ROLES.ADMIN]) ||
                  route !== ROUTES.ADMIN) && (
                  <Menu.Item
                    key={route}
                    className="capitalize"
                    active={activeItem === route}
                  >
                    <Link onClick={() => setActiveItem(route)} to={route}>
                      {route && route === "/" ? "Home" : route.slice(1)}
                    </Link>
                  </Menu.Item>
                )
              );
            })}
          </Menu.Menu>
          <Menu.Menu className="sign-menu" position={"right"}>
            <Menu.Item>
              <SignOut />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    </Sticky>
  );
};

const NavigationNonAuth = () => {
  const [activeItem, setActiveItem] = useState(
    window.location.pathname || ROUTES.SIGN_IN
  );

  useEffect(() => {
    setActiveItem(
      identifyActiveLink(
        ROUTES.SHARED_AUTH_ROUTES.concat([ROUTES.SIGN_IN, ROUTES.SIGN_UP])
      )
    );
  }, [activeItem]);

  return (
    <Sticky className="nav-bar-sticky">
      <div className="nav-bar-menu-container">
        <MobileMenu
          signRoutes={[ROUTES.SIGN_IN, ROUTES.SIGN_UP]}
          routes={ROUTES.SHARED_AUTH_ROUTES}
        />
        <Menu borderless className="nav-bar-menu">
          <Menu.Menu className="main-menu">
            <Menu.Item className="logo-container">
              <Link onClick={() => setActiveItem(ROUTES.HOME)} to={ROUTES.HOME}>
                <Image className="menu-logo" src={logo} />
              </Link>
            </Menu.Item>
            {ROUTES.SHARED_AUTH_ROUTES.map((route) => (
              <Menu.Item
                key={route}
                active={activeItem === route}
                className="capitalize"
              >
                <Link onClick={() => setActiveItem(route)} to={route}>
                  {route && route === "/" ? "Home" : route.slice(1)}
                </Link>
              </Menu.Item>
            ))}
          </Menu.Menu>
          <Menu.Menu className="sign-menu" position={"right"}>
            <Menu.Item active={activeItem === ROUTES.SIGN_UP}>
              <Link
                onClick={() => setActiveItem(ROUTES.SIGN_UP)}
                to={ROUTES.SIGN_UP}
              >
                Sign up
              </Link>
            </Menu.Item>
            <Menu.Item active={activeItem === ROUTES.SIGN_IN}>
              <Link
                onClick={() => setActiveItem(ROUTES.SIGN_IN)}
                to={ROUTES.SIGN_IN}
              >
                Sign in
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    </Sticky>
  );
};

const Navigation = ({ authUser }) =>
  authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />;

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
