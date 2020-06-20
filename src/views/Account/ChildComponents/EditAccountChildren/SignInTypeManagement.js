import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { SIGN_IN_METHODS } from "../../../../constants/shared";
import { withFirebase } from "../../../Firebase";
import { setSessionValues } from "../../../../redux/actions";
import {
  Segment,
  Header,
  List,
  Button,
  Message,
  Form,
  Input,
  Icon,
} from "semantic-ui-react";
import { passwordValidator } from "../../../../utils";

class SignInTypeManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  onDefaultLoginLink = (password) => {
    const { firebase } = this.props;
    const { authUser } = this.props.sessionState;

    const credential = firebase.emailAuthProvider.credential(
      authUser.email,
      password
    );

    firebase.auth.currentUser
      // .linkAndRetrieveDataWithCredential(credential)
      .linkWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  componentDidMount() {
    this.fetchSignInMethods();
  }

  // all social networks you already linked to ur account
  fetchSignInMethods = () => {
    const { firebase } = this.props;
    const { authUser } = this.props.sessionState;

    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch((error) => this.setState({ error }));
  };

  onSocialLoginLink = (provider) => {
    const { firebase } = this.props;
    const { authUser } = this.props.sessionState;

    firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onUnlink = (providerId) => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;
    return (
      <Segment>
        <Header as="h3" textAlign="center">
          Manage Sign In Methods
        </Header>
        <p className="sign-in-management-description">Sign In Methods:</p>
        <List>
          {SIGN_IN_METHODS.map((signInMethod) => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);
            return (
              <List.Item key={signInMethod.id} as="ul">
                {signInMethod.id === "password" ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                  />
                )}
              </List.Item>
            );
          })}
        </List>
        {error && <Message error content={error.message} />}
      </Segment>
    );
  }
}

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { passwordOne: "", passwordTwo: "" };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = this.props;
    const { passwordOne, passwordTwo } = this.state;

    const isInvalid =
      (passwordOne === "" && passwordTwo === "") ||
      passwordOne !== passwordTwo ||
      !passwordValidator(passwordOne);

    return isEnabled ? (
      <Button onClick={() => onUnlink(signInMethod.id)} disabled={onlyOneLeft}>
        Deactivate {signInMethod.id}
      </Button>
    ) : (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <Form.Input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
          <Form.Input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm New Password"
          />
          <Form.Button disabled={isInvalid}>Link {signInMethod.id}</Form.Button>
        </Form.Group>
      </Form>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => (
  <div className="sign-in-management-social-container">
    <div className="sign-in-management-social-name">
      <span>
        <Icon name={signInMethod.icon} /> {signInMethod.name}
      </span>
    </div>
    <div className="sign-in-management-social-sign">
      {isEnabled ? (
        <Button
          color="red"
          onClick={() => onUnlink(signInMethod.id)}
          disabled={onlyOneLeft}
        >
          Deactivate Account
        </Button>
      ) : (
        <Button primary onClick={() => onLink(signInMethod.provider)}>
          Link Account
        </Button>
      )}
    </div>
  </div>
);

const mapStateToProps = (state) => {
  const { sessionState } = state;
  return { sessionState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateUserProfile: (values) => dispatch(setSessionValues(values)),
  };
};

// const LoginManagement = withFirebase(SignInTypeManagement);

// export default withFirebase(SignInTypeManagement);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebase
)(SignInTypeManagement);
