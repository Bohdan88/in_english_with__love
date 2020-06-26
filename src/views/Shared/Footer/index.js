import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Grid, Image, Icon, Container } from "semantic-ui-react";
import * as ROUTES from "../../../constants/routes";

// style
import "./style.scss";

// assets
import logo from "../../../assets/images/default.png";

/* <Segment
        className="footer-container"
        padded="very"
        style={{ display: !isFooterExist ? "" : "none" }}
      >
      </Segment> */

const Footer = () => {
  const [activeItem, setActiveItem] = useState(null);
  return (
    <Grid className="footer-container">
      <Grid.Row columns={3} verticalAlign="middle">
        <Grid.Column width={5} floated="left" className="footer-grid-logo">
          <Link onClick={() => setActiveItem(ROUTES.HOME)} to={ROUTES.HOME}>
            <Image className="menu-logo" src={logo} />
          </Link>
        </Grid.Column>
        <Grid.Column width={6}>
          <Menu text className="footer-menu-brand">
            <Menu.Item className="footer-item-brand-name">
              © In English With Love
            </Menu.Item>
            <Menu.Item
              name="Privacy Policy"
              active={activeItem === "Privacy Policy"}
            />
            <Menu.Item name="Contact Us" active={activeItem === "Contact Us"} />
          </Menu>
        </Grid.Column>

        <Grid.Column width={5} className="footer-grid-icons">
          <Menu text floated="right">
            <Menu.Item>
              <a
                href="https://www.instagram.com/inenglishwithlove"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon color="black" link size="large" name="instagram" />
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                href="https://www.facebook.com/inenglishwithlove/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  className="footer-icon-facebook"
                  link
                  size="large"
                  name="facebook"
                />
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                href="https://www.facebook.com/inenglishwithlove/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon color="red" link size="large" name="pinterest square" />
              </a>
            </Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Footer;
