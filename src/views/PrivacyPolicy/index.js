import React from "react";
import { Container, Header, Segment, List } from "semantic-ui-react";

// style
import "./style.scss";

const PrivacyPolicy = () => {
  return (
    <Container textAlign="left" className="privacy-policy-container">
      <Segment>
        <Header textAlign="center" as="h2">
          Privacy Policy
        </Header>
        <p>
          One of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by inenglishwithlove.com and how we use it.
          <br />
          If you have any questions or wish to exercise your rights and choices,
          please contact us as set out in the <b>“Contact Us” </b>
          section.
        </p>
        <Header as="h3">Consent</Header>
        <p>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </p>
        <Header as="h3">Information Collection</Header>
        <p>This section will discuss what type of information is collected.</p>
        <Header as="h4">1. Information You Provide Directly to Us</Header>
        <p>
          You can browse our site without providing personal information, but
          you must register in order to access most of the features of Service.
          Certain personal information—such as a user name, email address—are
          required to create an account. However, after you set up an account,
          you may choose what additional information may be shared through
          public profiles, including your name, location, website, links to your
          social media profiles, and other information that may be considered
          personal information.
        </p>
        <p>
          The following are categories of information we collect and have
          collected directly from you:
        </p>
        <List as="ul">
          <List.Item as="li">
            <b>Contact Data,</b> including your first and last name, email
            address.
          </List.Item>
          <List.Item as="li">
            <b>Account Credentials,</b> including your username, password, and
            information for authentication and account access.
          </List.Item>
        </List>
        <Header as="h4">2. Information Collected Automatically</Header>
        <p>
          In addition, we automatically collect information when you use the
          Service. The categories of information we automatically collect:
        </p>
        <List as="ul">
          <List.Item as="li">
            <b>Service Use Data,</b> including data about features you use,
            pages you visit, the time of day you browse, and your referring and
            exiting pages.
          </List.Item>
        </List>
        <Header as="h3">Your Rights and choices</Header>
        <p>This section further describes your rights.</p>
        <Header as="h4">1. Account Information</Header>
        <p>
          You may access, update, or remove certain information that you have
          provided to us through your account by visiting your account settings.
        </p>
        <Header as="h3">Children’s Privacy</Header>
        <p>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity. We do
          not knowingly collect any Personal Identifiable Information from
          children under the age of 13. If you think that your child provided
          this kind of information on our website, we strongly encourage you to
          contact us immediately and we will do our best efforts to promptly
          remove such information from our records.
        </p>
      </Segment>
    </Container>
  );
};

export default PrivacyPolicy;
