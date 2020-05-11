import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import ReactDOM from "react-dom";
import { Editor, EditorState } from "draft-js";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import CustomEditor from "../Editor";
import "firebase/storage";
import {
  ADMIN_TABS,
  CATEGORIES,
  ADMIN_DROPDOWN_TITLES,
} from "../../constants/shared";
import {
  Dimmer,
  Segment,
  Loader,
  Tab,
  Grid,
  Container,
  Header,
  Dropdown,
  Form,
  Button,
  Popup,
  Image,
} from "semantic-ui-react";
import axios, { put } from "axios";

import "./style.scss";
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
    };

    this.state = {
      editorState: EditorState.createEmpty(),
      categories: CATEGORIES,
      subCategories: [],
      bias: [],
      files: null,
      iconSrc: "",
    };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  handleAddition = (data, type) => {
    this.setState((prevState) => ({
      [type]: [{ text: data.value, value: data.value }, ...prevState[type]],
    }));
  };

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

      // set posts
      this.setState({
        subCategories: transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.type)),
        ]),
        bias: transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.bias)),
        ]),
      });
    });
  }

  assignDefaultValue = (arr, defaultValue) => {
    if (!this.state[defaultValue] && arr[0]) {
      this.setState({
        [defaultValue]: arr[0].text,
      });
    }
  };

  componentDidUpdate() {
    this.assignDefaultValue(
      this.state.categories,
      ADMIN_DROPDOWN_TITLES.category.defaultVal
    );
    this.assignDefaultValue(
      this.state.subCategories,
      ADMIN_DROPDOWN_TITLES.subCategory.defaultVal
    );
    this.assignDefaultValue(
      this.state.bias,
      ADMIN_DROPDOWN_TITLES.bias.defaultVal
    );
  }

  onDropDownChange = (data, dropDownType) => {
    this.setState({
      [dropDownType]: data.value,
    });
  };

  componentWillMount() {
    // this.listener()
  }

  //-----------------  icon upload handler

  handleChangeInput = (files) =>
    this.setState({
      files: files,
    });

  handleSaveImage = () => {
    if (this.state.files) {
      let bucketName = "posts";
      let file = this.state.files[0];
      let storageRef = this.props.firebase.storage.ref(
        `${bucketName}/${file.name}`
      );
      storageRef.put(file);
    }
  };

  showImage = () => {
    let storageRef = this.props.firebase.storage.ref();
    let spaceRef = storageRef.child(`posts/${this.state.files[0].name}`);
    storageRef
      .child(`posts/${this.state.files[0].name}`)
      .getDownloadURL()
      .then((url) => {
        this.setState({ iconSrc: url });
      });
  };
  render() {
    const {
      loading,
      posts,
      categories,
      subCategories,
      bias,
      categoryValue,
      subCategoryValue,
      biasValue,
      files,
      iconSrc
    } = this.state;
    // console.log(this.props.firebase.storage, "firebase");
    // console.log(this.state, "this.state");

    const panes = [
      {
        menuItem: ADMIN_TABS.create_lesson,
        render: () => (
          <Tab.Pane attached={false}>
            <Form>
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Dropdown
                    className="capitalize"
                    label={ADMIN_DROPDOWN_TITLES.category.label}
                    selection
                    search
                    value={categoryValue}
                    options={categories}
                    onChange={(e, data) =>
                      this.onDropDownChange(
                        data,
                        ADMIN_DROPDOWN_TITLES.category.defaultVal
                      )
                    }
                    placeholder="Select Category"
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Dropdown
                    className="capitalize"
                    label={ADMIN_DROPDOWN_TITLES.subCategory.label}
                    selection
                    search
                    allowAdditions
                    options={subCategories}
                    value={subCategoryValue}
                    placeholder={ADMIN_DROPDOWN_TITLES.subCategory.placeholder}
                    onChange={(e, data) =>
                      this.onDropDownChange(
                        data,
                        ADMIN_DROPDOWN_TITLES.subCategory.defaultVal
                      )
                    }
                    onAddItem={(e, d) =>
                      this.handleAddition(d, "subCategories")
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Dropdown
                    className="capitalize"
                    label={ADMIN_DROPDOWN_TITLES.bias.label}
                    selection
                    search
                    allowAdditions
                    options={bias}
                    value={biasValue}
                    placeholder={ADMIN_DROPDOWN_TITLES.bias.label}
                    onChange={(e, data) =>
                      this.onDropDownChange(
                        data,
                        ADMIN_DROPDOWN_TITLES.bias.defaultVal
                      )
                    }
                    onAddItem={(e, d) => this.handleAddition(d, "bias")}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
            <Form widths="equal" onSubmit={this.handleSaveImage}>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Title</label>
                  <Form.Input placeholder="Title" />
                </Form.Field>
                <Form.Field>
                  <label>Icon Settings</label>
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={(e) => this.handleChangeInput(e.target.files)}
                  />
                  <Button.Group className="admin-button-group" basic fluid>
                    <Button
                      content="Choose Icon"
                      labelPosition="left"
                      icon="file"
                      onClick={() => this.fileInputRef.current.click()}
                    />
                    <Button disabled={files ? false : true} type="submit">
                      Upload
                    </Button>
                    <Popup
                    className="admin-icon-popup"
                      content={<Image src={iconSrc}   alt="PRIVET" size="small"  />}
                      on="click"
                      pinned
                      trigger={
                        <Button
                          disabled={files ? false : true}
                          onClick={this.showImage}
                        >
                          Show image
                        </Button>
                      }
                    />
                  </Button.Group>
                </Form.Field>
              </Form.Group>
            </Form>

            <CustomEditor firebase={this.props.firebase} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: ADMIN_TABS.all_lessons,
        render: () => <Tab.Pane attached={false}>All LEsonst</Tab.Pane>,
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

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
