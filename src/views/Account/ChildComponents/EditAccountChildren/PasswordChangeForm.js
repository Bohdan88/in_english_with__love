import React, { Component } from "react";

import { withFirebase } from "../../../Firebase";
import {
  Form,
  Button,
  List,
  Message,
  Header,
  Segment,
} from "semantic-ui-react";
import { passwordValidator, fireAlert } from "../../../../utils";
import { PASSWORD_CHANGE_CONFIRMATION } from "../../../../constants/alertContent";
import { PASSWORD_SPECIAL_CHARACTERS } from "../../../../constants";

// Style
import "./style.scss";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  isSubmitted: false,
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = () => {
    const { passwordOne, passwordTwo } = this.state;
    if (passwordOne === "" || passwordTwo === "") {
      this.setState({
        error: "Please fill all the fields.",
      });
    }
    if (passwordOne !== passwordTwo) {
      this.setState({
        error: "Passwords don't match.",
      });
    } else if (!passwordValidator(passwordOne)) {
      this.setState({
        error: "Passwords dont't meet criteria written above.",
      });
    } else {
      this.props.firebase
        .doPasswordUpdate(passwordOne)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          fireAlert({ state: true, values: PASSWORD_CHANGE_CONFIRMATION });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
    }

    this.setState({
      isSubmitted: true,
    });
  };

  onChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const { passwordOne, passwordTwo, error, isSubmitted } = this.state;

    const isInvalid =
      (isSubmitted &&
        (!!error ||
          (passwordOne === "" && passwordTwo === "") ||
          passwordOne !== passwordTwo)) ||
      !passwordValidator;

    return (
      <Segment>
        <Header as="h3" textAlign="center">
          Change Password
        </Header>
        <p className="password-change-requirement">
          We require you to have a secure password. Make sure you:
        </p>
        <List className="password-change-requirement-list" bulleted>
          <List.Item>Use at least 6 characters</List.Item>
          <List.Item>Use a mix of upper and lower case characters</List.Item>
          <List.Item>Use at least 1 number</List.Item>
          <List.Item>
            Use at least 1 special character like:
            {PASSWORD_SPECIAL_CHARACTERS.map((sign, key) => (
              <b key={sign}>
                {" "}
                {` ${sign} ${
                  key === PASSWORD_SPECIAL_CHARACTERS.length - 1 ? " ." : ", "
                }  `}{" "}
              </b>
            ))}
          </List.Item>
          <List.Item>
            Please, try not to use common words or simple passwords like
            “password”, “qwerty”, or “123456”
          </List.Item>
        </List>
        <Form error={isInvalid} onSubmit={this.onSubmit}>
          <Form.Field onChange={this.onChange}>
            <Form.Input
              label="New Password"
              error={isInvalid}
              name="passwordOne"
              placeholder="New Password"
              value={passwordOne}
              type="password"
            />
          </Form.Field>
          <Form.Field onChange={this.onChange}>
            <Form.Input
              label="Confirmation of New Password"
              error={isInvalid}
              name="passwordTwo"
              placeholder="Confirmation of New Password"
              value={passwordTwo}
              type="password"
            />
          </Form.Field>
          <div
            className="password-change-button-container"
            style={{ justifyContent: isInvalid ? "space-between" : "flex-end" }}
          >
            <Message error content={error} />
            <Button disabled={false} floated="right" color="blue" type="submit">
              Change Password
            </Button>
          </div>
        </Form>
      </Segment>
    );
  }
}

export default withFirebase(PasswordChangeForm);
