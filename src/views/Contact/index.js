import React from "react";
import { SignLanding } from "../SignForm/Components";
import { Segment, Container, Header } from "semantic-ui-react";

// style
import "./style.scss";

const Contact = () => {
  return (
    <SignLanding>
      <Segment className="contact-container">
        <Container fluid>
          <Header as="h2" textAlign="center">
            Contact Us
          </Header>
          <p>
            Please send us your questions, comments, or suggestions – we read
            each and every e-mail, and would love to hear from you!
          </p>
          <Header as="h3">
            <a href="mailto:example@gmail.com">support@inenglishwithlove.com</a>
          </Header>
        </Container>
      </Segment>
    </SignLanding>
  );
};

export default Contact;
