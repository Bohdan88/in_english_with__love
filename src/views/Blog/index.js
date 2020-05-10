import React, { Component } from "react";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

class Blog extends Component {
  state = {
    loading: false,
    posts: [],
  };

  componentDidMount() {
    this.listener = this.props.firebase.posts().on("value", (snapshot) => {
      const postsObject = snapshot.val();

      const postsList = Object.keys(postsObject).map((key) => ({
        ...postsObject[key],
        uid: key,
      }));

      this.setState({
        posts: postsList,
        loading: false,
      });
    });
  }

  componentWillMount() {
    // this.listener();
  }

  render() {
      // console.log(this.state)
    return <div>Blog</div>;
  }
}

// const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default withFirebase(Blog);

// export default Blog;
