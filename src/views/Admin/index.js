import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import ReactDOM from "react-dom";
import { Editor, EditorState } from "draft-js";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import CustomEditor from "../Editor";
import { ADMIN_TABS } from "../../constants/shared";
import {
  Dimmer,
  Segment,
  Loader,
  Tab,
  Grid,
  Container,
  Header,
} from "semantic-ui-react";

import "./style.scss";
// Admin

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      posts: [],
    };

    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        // loading: false,
      });
    });

    this.listener2 = this.props.firebase.posts().on("value", (snapshot) => {
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
    // this.listener()
  }

  render() {
    const { users, loading, posts } = this.state;
    console.log(this.state.posts, "posts");

    const panes = [
      {
        menuItem: ADMIN_TABS.lessons,
        render: () => (
          <Tab.Pane attached={false}>
            <CustomEditor firebase={this.props.firebase} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: ADMIN_TABS.users,
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
      },
    ];

    return (
      <div>
        {loading ? (
          <Segment className="loader-admin">
            <Dimmer active>
              <Loader size="massive">Loading </Loader>
            </Dimmer>
          </Segment>
        ) : (
          <Grid className="grid-admin">
            <Grid.Row>
              <Grid.Column className="column-admin">
                {/* <Container> */}
                <Tab menu={{ secondary: true }} panes={panes} />
                {/* </Container> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </div>
    );
  }
}

{
  /* <p>The Admin Page is accessible by every signed in admin user.</p> */
}
/* <AddPost firebase={this.props.firebase} />
        <PostsList posts={posts} firebase={this.props.firebase} /> */
/* <Editor
         editorState={this.state.editorState} onChange={this.onChange} />
        <UserList users={users} /> */
/* <CustomEditor firebase={this.props.firebase} />
            <MyPosts posts={posts} /> */

const MyPosts = ({ posts }) => {
  if (posts) {
    let lastpost = posts[posts.length - 1];
    // console.log(JSON.stringify(lastpost.post), "last");

    return <p dangerouslySetInnerHTML={{ __html: lastpost.post }} />;

    // return lastpost.post
  }
  return null;
};
class AddPost extends Component {
  state = {
    textArea: "INIT",
  };

  handleChange = (e) => this.setState({ textArea: e.target.value });
  onSubmit = () => {
    const { textArea } = this.state;
    // this.props.firebase.posts().on("value", (snapshot) => {
    //   const posts = snapshot.val();

    // });

    // Create a post in your Firebase realtime database
    // this.props.firebase((post) => {
    // console.log(post, "post");
    return this.props.firebase.posts().push().set({
      post: textArea,
      type: "history",
    });
    // });
  };

  onRetrieve = () => {
    // console.log(this.props.firebase.posts());
  };
  render() {
    return (
      <div>
        <textarea value={this.state.textArea} onChange={this.handleChange} />
        <button onClick={() => this.onSubmit()}> Submit </button>
        <button onClick={() => this.onRetrieve()}> Retrieve </button>
      </div>
    );
  }
}
const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <br />
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <br />
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

const removePostFromDb = (post, firebase) => {
  firebase.db.ref(`posts/${post.uid}`).remove();
};

const editPostFromDb = (post, firebase) => {
  // firebase.db.ref(`posts/${post.uid}`).remove()
  // console.log(firebase.db.ref(`posts/${post.uid}`))
  firebase.db.ref(`posts/${post.uid}`).update({
    post: "UPDATED",
  });
};
const PostsList = ({ posts, firebase }) => (
  <ul>
    {posts.map((post) => (
      <li key={post.uid}>
        <span>
          <strong>ID:</strong> {post.uid}
        </span>
        <br />
        <span>
          <strong>Text:</strong> {post.post}
        </span>
        <br />
        <span>
          <strong>Type:</strong> {post.type}
        </span>
        <br />
        <span>
          <button onClick={() => removePostFromDb(post, firebase)}>
            Remove post from db
          </button>
          <button onClick={() => editPostFromDb(post, firebase)}>
            Edit post from db
          </button>
        </span>
      </li>
    ))}
  </ul>
);

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
