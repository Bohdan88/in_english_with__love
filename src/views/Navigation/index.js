import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Menu, Image, Sticky } from "semantic-ui-react";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { SignOut } from "../SignForm";
import MobileMenu from "./MobileMenu";

// style
import "./style.scss";

// assets
import logo from "../../assets/images/default.png";

const identifyActiveLink = (basePath, searchedPath) => {
  if (basePath !== ROUTES.LESSON_TOPIC_LIST) {
    return basePath;
  } else {
    // looking for the first '=' to understand its listen or read category
    const linkIndex = searchedPath.indexOf("=");
    const linkLastIndex = searchedPath.indexOf("&");

    // it could be either read or listen
    const linkName = searchedPath.slice(linkIndex + 1, linkLastIndex);
    return `/${linkName}`;
  }
};

const NavigationAuth = ({ authUser }) => {
  const pathname = useLocation().pathname;
  const searchedPath = useLocation().search;
  const [activeItem, setActiveItem] = useState(pathname);

  useEffect(() => {
    setActiveItem(identifyActiveLink(pathname, searchedPath));
  }, [pathname, searchedPath]);

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
  const pathname = useLocation().pathname;
  const searchedPath = useLocation().search;
  const [activeItem, setActiveItem] = useState(pathname);

  useEffect(() => {
    setActiveItem(identifyActiveLink(pathname, searchedPath));
  }, [pathname, searchedPath]);

  return (
    <Sticky className="nav-bar-sticky">
      <div className="nav-bar-menu-container">
        <MobileMenu
          signRoutes={[ROUTES.SIGN_IN, ROUTES.SIGN_UP]}
          routes={ROUTES.NON_AUTH_ROUTES}
        />
        <Menu borderless className="nav-bar-menu">
          <Menu.Menu className="main-menu">
            <Menu.Item className="logo-container">
              <Link onClick={() => setActiveItem(ROUTES.HOME)} to={ROUTES.HOME}>
                <Image className="menu-logo" src={logo} />
              </Link>
            </Menu.Item>
            {ROUTES.NON_AUTH_ROUTES.map((route) => (
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
