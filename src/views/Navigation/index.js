import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import SignOutButton from "../SignOut";
import { AuthUserContext } from "../Session";
import * as ROLES from "../../constants/roles";
import {
  Menu,
  Container,
  Image,
  Sticky,
  Item,
  MenuItem,
} from "semantic-ui-react";
import { LOGO_LINK } from "../../constants/shared";
import MobileMenu from "./MobileMenu";
import "./style.scss";
// const Navigation = () => (
//   <div>
//     <AuthUserContext.Consumer>
//       {(authUser) =>
//         authUser ? (
//           <NavigationAuth authUser={authUser} />
//         ) : (
//           <NavigationNonAuth />
//         )
//       }
//     </AuthUserContext.Consumer>
//   </div>
// );

const NavigationAuth = ({ authUser }) => {
  const [activeItem, setActiveItem] = useState(ROUTES.SIGN_IN);
  return (
    <div>
      <Sticky className="nav-bar-sticky">
        <Container fluid>
          <Menu className="nav-bar-menu" borderless>
            <Menu.Menu className="logo-menu-item">
              <Menu.Item
                as={"a"}
                href={`${ROUTES.HOME}`}
                /* className="logo-container" */
              >
                {/* <Image src={logo} /> */}
                <span className="logo-name">LOGO</span>
              </Menu.Item>
            </Menu.Menu>
            <Menu.Menu position={"right"}>
              <Menu.Item as="a" href={ROUTES.HOME}>
                Read
              </Menu.Item>
              <Menu.Item as="a" href={ROUTES.ACCOUNT}>
                Account
              </Menu.Item>

              {!!authUser.roles[ROLES.ADMIN] && (
                <Menu.Item as="a" href={ROUTES.ADMIN}>
                  Admin
                </Menu.Item>
              )}
              <SignOutButton />
            </Menu.Menu>
          </Menu>
        </Container>
      </Sticky>
      <li>
        <SignOutButton />
      </li>
    </div>
  );
};

const NavigationNonAuth = () => {
  const [activeItem, setActiveItem] = useState(ROUTES.SIGN_IN);
  return (
    <div>
      <Sticky className="nav-bar-sticky">
        <Container fluid>
          <MobileMenu
            signRoutes={[ROUTES.SIGN_IN, ROUTES.SIGN_UP]}
            routes={ROUTES.NON_AUTH_ROUTES}
          />
          <Menu className="nav-bar-menu" borderless>
            <Menu.Menu className="main-menu">
              <Menu.Item className="logo-container">
                <Link
                  onClick={() => setActiveItem(ROUTES.READ)}
                  to={ROUTES.READ}
                >
                  <Image className="menu-logo" src={LOGO_LINK} />
                </Link>
              </Menu.Item>
              {ROUTES.NON_AUTH_ROUTES.map((route) => (
                <Menu.Item key={route} active={activeItem === route}>
                  <Link onClick={() => setActiveItem(route)} to={route}>
                    {route.slice(1)}
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
                  SIGN UP
                </Link>
              </Menu.Item>
              <Menu.Item active={activeItem === ROUTES.SIGN_IN}>
                <Link
                  onClick={() => setActiveItem(ROUTES.SIGN_IN)}
                  to={ROUTES.SIGN_IN}
                >
                  SIGN IN
                </Link>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
      </Sticky>
    </div>
  );
};

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
);

export default Navigation;
