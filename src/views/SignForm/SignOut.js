import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { HOME } from "../../constants/routes";

//
const SignOut = ({ firebase }) => (
  <Link to={HOME} onClick={firebase.doSignOut}>
    Sign out
  </Link>
);

export default withFirebase(SignOut);
