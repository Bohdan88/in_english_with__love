import React, { Component } from "react";
import { withFirebase } from "../../../Firebase";
import { Button, Message, Header, Segment } from "semantic-ui-react";
import { fireAlert } from "../../../../utils";
import {
  CONFIRMATION_ALERT,
  REMOVE_ACCOUNT_CONFIRMATION,
} from "../../../../constants/alertContent";

// style
import "./style.scss";

class DeleteAccount extends Component {
  state = {
    error: null,
  };

  onDeleteAccount = () => {
    const { firebase } = this.props;

    fireAlert({
      state: true,
      type: CONFIRMATION_ALERT,
      values: REMOVE_ACCOUNT_CONFIRMATION,
    }).then((response) => {
      if (response.value) {
        firebase.auth.currentUser
          .delete()
          .catch((error) => this.setState({ error: error.message }));
      }
    });
  };
  render() {
    const { error } = this.state;
    return (
      <Segment>
        <Header as="h3" textAlign="center">
          Delete Account
        </Header>
        <div className="delete-account-container">
          <p className="delete-account-warning">
            You can delete your account at any time. However, this action is
            irreversible.
          </p>
          <div
            className="delete-account-button-container"
            style={{ justifyContent: error ? "space-between" : "flex-end" }}
          >
            <Message
              className="delete-account-message"
              style={{ display: error ? "" : "none" }}
              error
              content={error}
            />
            <Button
              color="red"
              type="submit"
              className="delete-account-button"
              onClick={this.onDeleteAccount}
            >
              I understand, delete my account
            </Button>
          </div>
        </div>
      </Segment>
    );
  }
}

export default withFirebase(DeleteAccount);
