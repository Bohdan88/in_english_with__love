import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withFirebase } from "../../../Firebase";
import { Form, Button, Message, Header, Segment } from "semantic-ui-react";
import { fireAlert } from "../../../../utils";
import { UPDATE_PROFILE_CONFIRMATION } from "../../../../constants/alertContent";
import { setSessionValues } from "../../../../redux/actions";

// style
import "./style.scss";

class UpdateUserProfile extends Component {
  state = {
    username: "",
    error: null,
    isSubmitted: false,
  };

  componentDidMount() {
    const { authUser } = this.props.sessionState;

    if (authUser) {
      this.setState({
        username: authUser.username,
      });
    }
  }

  onChange = (username) => this.setState({ username });

  onSubmit = () => {
    const { username } = this.state;
    const { firebase } = this.props;
    const { authUser } = this.props.sessionState;

    if (username.trim() === authUser.username) {
      this.setState({
        error: "You already have this username.",
        isSubmitted: true,
      });
    } else if (username.trim().length < 6) {
      this.setState({
        error: "Username is too short.",
        isSubmitted: true,
      });
    } else {
      firebase
        .user(authUser.uid)
        .update({
          username: username.trim(),
        })
        .then(() => {
          this.props.onUpdateUserProfile({
            authUser: { ...authUser, username: username.trim() },
          });

          this.setState({
            error: null,
            isSubmitted: false,
          });
          fireAlert({ state: true, values: UPDATE_PROFILE_CONFIRMATION });
        })
        .catch((error) => {
          this.setState({
            error: error.message,
            isSubmitted: true,
            username: authUser.username,
          });
        });
    }
  };

  render() {
    const { username, error, isSubmitted } = this.state;

    const isInvalid = isSubmitted && (!!error || username.trim().length < 6);

    return (
      <Segment>
        <Header as="h3" textAlign="center">
          Update Profile
        </Header>
        <p className="change-user-name-requirement">
          Please note that your <b>Username</b> should contain at least 6
          characters.
        </p>
        <Form error={isInvalid} onSubmit={this.onSubmit}>
          <Form.Field>
            <Form.Input
              label="Username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e, data) => this.onChange(data.value)}
            />
          </Form.Field>
          <div
            className="password-change-button-container"
            style={{ justifyContent: isInvalid ? "space-between" : "flex-end" }}
          >
            <Message error content={error} />
            <Button disabled={false} floated="right" color="blue" type="submit">
              Update Profile
            </Button>
          </div>
        </Form>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  const { sessionState } = state;
  return { sessionState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateUserProfile: (values) => dispatch(setSessionValues(values)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebase
)(UpdateUserProfile);
