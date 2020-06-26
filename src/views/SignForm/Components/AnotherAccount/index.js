import React, { useState } from "react";
import { Image } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  ERROR_CODE_ACCOUNT_EXISTS,
  ERROR_MSG_ACCOUNT_EXISTS,
} from "../../../../constants";
import * as ROUTES from "../../../../constants/routes";
import { withFirebase } from "../../../Firebase";

// style
import "./style.scss";

// assets
import facebook from "../../../../assets/images/facebook.png";
import google from "../../../../assets/images/google.png";

const AnotherAccountBase = ({
  type,
  firebase,
  actionType,
  history,
  noUser,
}) => {
  const [error, setError] = useState(null);

  const onSubmitGoogle = (event) => {
    firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          setError(ERROR_MSG_ACCOUNT_EXISTS);
        }
      });

    event.preventDefault();
  };

  const onSubmitFacebook = (event) => {
    firebase
      .doSignInWithFacebook()
      .then((socialAuthUser) => {
        console.log(socialAuthUser, "socialAuthUser");
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          setError(ERROR_MSG_ACCOUNT_EXISTS);
        }
      });
    event.preventDefault();
  };

  return (
    <div className="container-another-account">
      <p className="another-account">
        <span className="action-another-account">
          {`${actionType.toLowerCase()} `}
        </span>
        with another account:
      </p>
      <div className="contaniner-social-assets">
        <Image
          onClick={onSubmitGoogle}
          className="social-image-google"
          src={google}
        />
        <Image
          onClick={onSubmitFacebook}
          className="social-image-facebook"
          src={facebook}
        />
        {error && <p className={noUser}> {error}</p>}
      </div>
    </div>
  );
};

const AnotherAccount = compose(withRouter, withFirebase)(AnotherAccountBase);

export default AnotherAccount;
