import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: JSON.parse(localStorage.getItem("authUser")),
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        // next
        // will be used if a user exists
        (authUser) => {
          /* every time Firebase's listener is invoked, 
          the authenticated user stored in the browser's local storage
          */
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.setState({ authUser });
        },
        // fallback
        // will be used if there's no user found
        () => {
          localStorage.removeItem("authUser");
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
