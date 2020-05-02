import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import ReactDOM from "react-dom";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import DraftEditor  from "../Editor";
// styles
import "./style.scss";





class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      posts: [],
      editorState: EditorState.createEmpty(),
      content: [],
    };

    // this.state = { editorState: EditorState.createEmpty() };
    // this.focus = () => this.refs.editor.focus();
    // this.onChange = (editorState) => this.setState({ editorState });
    // this.handleKeyCommand = this._handleKeyCommand.bind(this);
    // this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    // this.toggleBlockType = this._toggleBlockType.bind(this);
    // this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  // _onBoldClick() {
  //   console.log("IM HERE");
  //   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  // }
  // _handleKeyCommand(command, editorState) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.onChange(newState);
  //     return true;
  //   }
  //   return false;
  // }

  // _mapKeyToEditorCommand(e) {
  //   if (e.keyCode === 9 /* TAB */) {
  //     const newEditorState = RichUtils.onTab(
  //       e,
  //       this.state.editorState,
  //       4 /* maxDepth */
  //     );
  //     if (newEditorState !== this.state.editorState) {
  //       this.onChange(newEditorState);
  //     }
  //     return;
  //   }
  //   return getDefaultKeyBinding(e);
  // }

  // _toggleBlockType(blockType) {
  //   this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  // }
  // _toggleInlineStyle(inlineStyle) {
  //   this.onChange(
  //     RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
  //   );
  // }

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
        loading: false,
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
    const { editorState } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}
        <p>The Admin Page is accessible by every signed in admin user.</p>
        {/* <AddPost firebase={this.props.firebase} />
        <PostsList posts={posts} firebase={this.props.firebase} /> */}
        <div className="editor-container">
          {/* <span>ALo</span>
          <button onClick={this._onBoldClick.bind(this)}>Bold</button>
          <Editor
            handleKeyCommand={this.handleKeyCommand}
            editorState={this.state.editorState}
            onChange={this.onChange}
          /> */}
          <DraftEditor firebase={this.props.firebase}/>
          <AddPost firebase={this.props.firebase} />
        </div>
        {/* <UserList users={users} /> */}

        <hr/>
        <PostsList posts={posts} firebase={this.props.firebase} />
      </div>
    );
  }
}

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
  // console.log(firebase.db.ref(`posts/${post.uid}`).remove(), 'post')
  // firebase.on("value", (snapshot) => {
  //   // console.log(snapshot.val().remove());
  //   let obj = snapshot.val()
  //   console.log(snapshot.ref(post.uid))
  //   // snapshot.val()

  // });
  // post.post = "LOL"
  // ref.child(key).remove();
};

const editPostFromDb = (post, firebase) => {
  // firebase.db.ref(`posts/${post.uid}`).remove()
  // console.log(firebase.db.ref(`posts/${post.uid}`))
  firebase.db.ref(`posts/${post.uid}`).update({
    post: "UPDATED",
  });
};
const PostsList = ({ posts, firebase }) => (
  <>
  <ul>
    {posts.map((post) => (
      <>
      <li key={post.uid}>
        {/* <span>
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
        <br /> */}
          {post.post}
        <span>
          <button onClick={() => removePostFromDb(post, firebase)}>
            Remove post from db
          </button>
          <button onClick={() => editPostFromDb(post, firebase)}>
            Edit post from db
          </button>
        </span>
      </li>
      </>
    ))}
    
  </ul>
  <br/>
  <br/>
  {posts.map((post) => post.post)}
  </>
  
);

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
