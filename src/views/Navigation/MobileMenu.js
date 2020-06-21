import React, { useState } from "react";
import { List } from "semantic-ui-react";
import { SIGN_IN } from "../../constants/routes";

const BuildRoutes = ({ routes }) =>
  routes &&
  routes.map((item, key) => {
    return (
      <List.Item
        name={"error"}
        key={key}
        as="a"
        href={item}
        className="mobile-sidebar-menu"
      >
        <List.Content>{item.slice(1)}</List.Content>
      </List.Item>
    );
  });

const MobileMenu = ({ routes, signRoutes }) => {
  const [menu, toggleMenu] = useState(false);
  const hamburgerClass = menu ? "open" : "";
  const menuClass = menu ? "mobile-open-menu" : "mobile-close-menu";
  return (
    <div className="mobile-nav-bar mobile-view">
      <div
        className="menu-icon-wrapper float-left"
        onClick={() => toggleMenu(!menu)}
      >
        <div id="hamburger" className={hamburgerClass}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

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
    </div>
  );
};

export default MobileMenu;
