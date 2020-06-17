import React, { Component } from "react";
import PasswordChangeForm from "../../PasswordChange";
import UpdateUserProfile from "../../UpdateUserProfile";
import { Header, Segment } from "semantic-ui-react";

class EditAccount extends Component {
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <Segment>
          <Header as="h3" textAlign="center">
            Update Profile
          </Header>
          <UpdateUserProfile />
        </Segment>
        <Segment>
          <Header as="h3" textAlign="center">
            Change Password
          </Header>
          <PasswordChangeForm />
        </Segment>
      </React.Fragment>
    );
  }
}

export default EditAccount;
