import React, { useState } from "react";
import { Image, Button } from "semantic-ui-react";
import {
  GOOGLE_LINK,
  FACEBOOK_LINK,
  SIGN_IN,
  SIGN_UP,
  ERROR_CODE_ACCOUNT_EXISTS,
  ERROR_MSG_ACCOUNT_EXISTS,
} from "../../../constants/shared";
import "./style.scss";
import * as ROUTES from "../../../constants/routes";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../Firebase";

const AnotherAccountBase = ({ type, firebase, actionType, history }) => {
  const [error, setError] = useState(null);
  // let onSubmit = () => null;
  // switch (type) {
  //   case SIGN_IN: {
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
        // console.log(error.code, 'errorCode')
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

  const onSubmitTwitter = (event) => {
    firebase
      .doSignInWithTwitter()
      .then((socialAuthUser) => {
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
        setError(error);
      });
    event.preventDefault();
  };

  return (
    <div className="container-another-account">
      <p className="another-account"> {actionType} WITH ANOTHER ACCOUNT: </p>
      <div className="contaniner-social-assets">
        <Image
          onClick={onSubmitGoogle}
          className="social-image-google"
          src={GOOGLE_LINK}
        />
        <Image
          onClick={onSubmitFacebook}
          className="social-image-facebook"
          src={FACEBOOK_LINK}
        />
        {error && <p className="error-no-user"> {error}</p>}
        {/* <Image
          onClick={onSubmitTwitter}
          className="social-image-facebook"
          src={FACEBOOK_LINK}
        /> */}
      </div>
    </div>
  );
};

const AnotherAccount = compose(withRouter, withFirebase)(AnotherAccountBase);

export default AnotherAccount;
