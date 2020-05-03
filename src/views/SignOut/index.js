import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { SIGN_OUT } from "../../constants/shared";
import { HOME } from "../../constants/routes";

//
const SignOutButton = ({ firebase }) => (
  <Link to={HOME} onClick={firebase.doSignOut}>
    {SIGN_OUT}
  </Link>
);

{
  /* <button type="button" onClick={firebase.doSignOut}>
  
  </button> */
}

export default withFirebase(SignOutButton);
