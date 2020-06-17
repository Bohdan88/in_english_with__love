import React, { Component } from "react";
import { withFirebase } from "../Firebase";

class UpdateUserProfile extends Component {
  state = {}
  componentDidMount() {
    const user = this.props.firebase.getUserProfile();
    console.log(user,'user')
  }
  render() {
    return <div>UpdateUserProfile</div>;
  }
}

export default withFirebase(UpdateUserProfile);
