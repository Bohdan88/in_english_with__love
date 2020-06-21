import React, { Component } from "react";
import { connect } from "react-redux";

import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import { CreateLesson } from "./Components";
import "firebase/storage";
import {
  ADMIN_TABS,
  EDIT_CREATE_POST_TAB_INDEX,
  POST_MODE,
  INIT_NEW_POST_VALUES,
} from "../../constants/shared";
import {
  CONFIRMATION_ALERT,
  CONFIRMATION_REMOVE_CONTENT,
} from "../../constants/alertContent";
import {
  Dimmer,
  Segment,
  Loader,
  Tab,
  Grid,
  Button,
  Icon,
} from "semantic-ui-react";

import { getAllPostsValues, setPostValues } from "../../redux/actions";

import "./style.scss";
import LessonsList from "./Components/LessonsList";
import { fireAlert } from "../../utils";
// Admin

const transformToOptions = (arr) => {
  // console.log(arr, "arr");
  return arr && arr[0] !== undefined
    ? arr.map((el) => ({
        key: el,
        text: el,
        value: el,
      }))
    : [];
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      loading: false,
      users: [],
      posts: [],
      activeTabIndex: 0,
    };

    // this.state = {
    //   editorState: EditorState.createEmpty(),
    //   categories: CATEGORIES,
    //   subCategories: [],
    //   focus: [],
    //   files: null,
    //   iconSrc: "",
    //   iconVisibility: false,
    // };
  }

  // handleAllPostsValues = () => this.props.onGetAllPostsValues("THIS");
  componentDidMount() {
    // redux stuff

    if (!this.props.users.length) {
      this.setState({ loading: true });
    }

    // set users
    this.props.firebase.users().on("value", (snapshot) => {
      this.props.onSetUsers(snapshot.val());

      this.setState({ loading: false });
    });

    // set posts

    // this.props.firebase.posts().on("value", (snapshot) => {
    //   this.props.onGetAllPostsValues(snapshot.val());
    // });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  // componentWillUnmount() {
  //   this.listener();
  //   this.listener2();
  // }

  onTabChange = (data) => {
    this.setState({
      activeTabIndex: data.activeIndex,
    });
  };

  setEditPostTabIndex = () =>
    this.setState({
      activeTabIndex: EDIT_CREATE_POST_TAB_INDEX,
      postMode: POST_MODE.EDIT,
    });

  setReduxToInit = () => {
    fireAlert({
      state: true,
      type: CONFIRMATION_ALERT,
      values: CONFIRMATION_REMOVE_CONTENT,
    }).then((val) => {
      !val.dismiss && this.props.onSetPostNewValues(INIT_NEW_POST_VALUES);
    });
  };

  render() {
    const { loading, activeTabIndex, postMode } = this.state;
    // console.log(this.props,'this.state')
    // console.log(this.props.users,'usersusersusers')
    const panes = [
      {
        menuItem: ADMIN_TABS.all_lessons,
        render: () => (
          <Tab.Pane>
            <LessonsList setEditPostTabIndex={this.setEditPostTabIndex} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: ADMIN_TABS.create_lesson,
        render: () => (
          <Tab.Pane>
            <CreateLesson postMode={postMode} />
          </Tab.Pane>
        ),
      },

      {
        menuItem: ADMIN_TABS.users,
        render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
      },

      // {
      //   menuItem: ADMIN_TABS.reset,
      //   render: () => <Button> Button </Button>,
      // },

      // {
      //   menuItem: CREATE_LESSON_STAGES.preview,
      //   render: () => (
      //     <Tab.Pane className="preview-tab">
      //       <LessonPreview
      //         focus={focus}
      //         title={title}
      //         iconSrc={this.props.newPostState.iconPath}
      //         sectionKey={CREATE_LESSON_STAGES.preview.key}
      //       />
      //     </Tab.Pane>
      //   ),
      // },
    ];

    // console.log(this.state, "STAATE");
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
                <Button
                  style={{ display: activeTabIndex === 1 ? "" : "none" }}
                  onClick={() => this.setReduxToInit()}
                  className="admin-reset-progress"
                >
                  <Icon name="redo" />
                  Reset
                </Button>
                <Tab
                  activeIndex={activeTabIndex}
                  onTabChange={(e, data) => this.onTabChange(data)}
                  panes={panes}
                />

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
      type: "History",
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

const mapStateToProps = (state) => ({
  posts: state.posts,
  users: Object.keys(state.userState.users || {}).map((key) => ({
    ...state.userState.users[key],
    uid: key,
  })),
  // console.log(state, "STATE");
  // const { posts } = state;
  // return { posts };
});

const mapDispatchToProps = (dispatch) => {
  // console.log("DISPATCH");
  return {
    // onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    onSetUsers: (users) => dispatch({ type: "USERS_SET", users }),
    onSetPostNewValues: (values) => dispatch(setPostValues(values)),
  };
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(AdminPage);
