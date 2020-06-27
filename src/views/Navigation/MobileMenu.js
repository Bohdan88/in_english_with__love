import React, { useState } from "react";
import { List, Transition, Image } from "semantic-ui-react";
import { SIGN_IN } from "../../constants/routes";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

// assets
import logo from "../../assets/images/default.png";

const BuildRoutes = ({ routes }) =>
  routes &&
  routes.map((item, key) => {
    return (
      <List.Item
        name={"error"}
        key={key}
        as="a"
        href={item}
        className="mobile-sidebar-menu capitalize"
      >
        <List.Content>
          {item.slice(1) === "" ? "Home" : item.slice(1)}
        </List.Content>
      </List.Item>
    );
  });

const MobileMenu = ({ routes, signRoutes }) => {
  const [menu, toggleMenu] = useState(false);
  const hamburgerClass = menu ? "open" : "";
  const menuClass = menu ? "mobile-open-menu" : "mobile-close-menu";
  return (
    <div className="mobile-nav-bar mobile-view">
      <div className="nav-menu-icon-wrapper" onClick={() => toggleMenu(!menu)}>
        <div className="mobile-logo-container">
          <Link to={ROUTES.READ}>
            <Image src={logo} />
          </Link>
        </div>
        <div id="hamburger" className={hamburgerClass}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <Transition visible={menu} animation={"fade"} duration={300} mountOnShow>
        <div className={menuClass}>
          <BuildRoutes routes={routes} />
          {signRoutes &&
            signRoutes.map((item, key) => {
              return (
                <List.Item
                  name={"error"}
                  key={key}
                  as="a"
                  href={item}
                  className="mobile-sidebar-menu"
                >
                  <List.Content>
                    {item === SIGN_IN ? "Sign In" : "Sign Up"}
                  </List.Content>
                </List.Item>
              );
            })}
        </div>
      </Transition>
    </div>
  );
};

export default MobileMenu;
