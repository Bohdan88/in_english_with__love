import React, { Component } from "react";
import { withFirebase } from "../../Firebase";
import CustomEditor from "../../Editor";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withAuthorization } from "../../Session";
import * as ROLES from "../../../constants/roles";
import {
  ADMIN_TABS,
  CATEGORIES,
  ADMIN_DROPDOWN_TITLES,
  POSTS_BUCKET_NAME,
} from "../../../constants/shared";
import { EditorState } from "draft-js";
import {
  Form,
  Button,
  Popup,
  Image,
  Icon,
  Transition,
  Input,
} from "semantic-ui-react";
import { getAllPostsValues, setNewPostValues } from "../../../redux/actions";

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

class AnswerTemplate extends Component {
  render() {
    return (
      <div>
        <Input type="text" placeholder="Add answer...">
          <input />
          <Button
            onClick={this.props.onUpdateQuantity}
            color="teal"
            type="submit"
          >
            Add answer {` ${this.props.quantity}`}
          </Button>
        </Input>
      </div>
    );
  }
}

class CreateLesson extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      loading: false,
      users: [],
      posts: [],
      categories: CATEGORIES,
      subCategories: [],
      bias: [],
      files: null,
      iconSrc: "",
      iconVisibility: false,
      onPreview: false,
      editorState: EditorState.createEmpty(),
      editorTextContent: true,
      quantity: 1,
      answers: [],
      // templateNumber: [
      //   <AnswerTemplate
      //     quantity={this.state.quantity}
      //     onUpdateQuantity={this.updateQuantity}
      //   />,
      // ],
    };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  handleAddition = (data, type) => {
    this.setState((prevState) => ({
      [type]: [{ text: data.value, value: data.value }, ...prevState[type]],
    }));

    // console.log(data, type)

    // console.log(
    //   this.props.newPostState,
    //   "this.props.newPostState.subCategories"
    // );
    // this.props.onSetNewPostValues({
    //   [type]: [
    //     { text: data.value, value: data.value },
    //     ...this.props.newPostState.subCategory,
    //   ],
    // });
  };

  componentDidMount() {
    // this.setState({ loading: true });

    // this.listener = this.props.firebase.users().on("value", (snapshot) => {
    //   const usersObject = snapshot && snapshot.val();
    //   if (usersObject) {
    //     const usersList = Object.keys(usersObject).map((key) => ({
    //       ...usersObject[key],
    //       uid: key,
    //     }));

    //     this.setState({
    //       users: usersList,
    //       // loading: false,
    //     });
    //   }
    // });

    // on posts
    this.props.firebase.posts().on("value", (snapshot) => {
      const postsObject = snapshot && snapshot.val();
      if (postsObject) {
        const postsList = Object.keys(postsObject).map((key) => ({
          ...postsObject[key],
          uid: key,
        }));

        this.setState({
          posts: postsList,
          loading: false,
        });

        let setSubCategories = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.type)),
        ]);

        let setBias = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.bias)),
        ]);
        // set posts
        this.setState({
          subCategories: setSubCategories,
          bias: setBias,
        });

        this.props.onGetAllPostsValues({
          allPosts: postsList,
          subCategories: setSubCategories,
          bias: setBias,
        });

        this.props.onSetNewPostValues({
          subCategory: setSubCategories[0] && setSubCategories[0].text,
          bias: setBias[0] && setBias[0].text,
        });
      }
    });
  }

  onDropDownChange = (data, dropDownType) => {
    this.setState({
      [dropDownType]: data.value,
    });

    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });
  };

  componentWillUnmount() {
    // this.listener();
    // this.listener2();
    this.props.firebase.posts().off();
  }

  //-----------------  icon upload handler

  handleChangeInput = (files) =>
    this.setState({
      files: files,
    });

  handleSaveImage = () => {
    if (this.state.files && this.state.files[0]) {
      const file = this.state.files[0];
      let storageRef = this.props.firebase.storage.ref(
        `${POSTS_BUCKET_NAME}/${file.name}`
      );
      storageRef.put(file);
    }
  };

  toggleIconVisibility = () =>
    this.setState({ iconVisibility: !this.state.iconVisibility });

  showImage = () => {
    if (this.state.iconSrc === "") {
      this.props.firebase.storage
        .ref()
        .child(`${POSTS_BUCKET_NAME}/${this.state.files[0].name}`)
        .getDownloadURL()
        .then((url) => {
          this.setState({
            iconSrc: url,
          });
        });
    }
  };

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  render() {
    const {
      loading,
      biasValue,
      files,
      iconSrc,
      iconVisibility,
      preview,
      editorTextContent,
      editorState,
    } = this.state;
    const { category, subCategory, isPostEmpty, post } = this.props.newPostState;
    // console.log(this.props, "PROPSAZAVRI");
    // console.log(editorState, "editorINLESLS");
    const {
      allPosts,
      categories,
      bias,
      subCategories,
    } = this.props.posts;

    // console.log(isPostEmpty,'isPostEmptyisPostEmpty')
    return (
      <div>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Dropdown
                className="capitalize"
                label={ADMIN_DROPDOWN_TITLES.category.label}
                selection
                search
                /* value={categoryValue} */
                value={category}
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
                value={subCategory}
                placeholder={ADMIN_DROPDOWN_TITLES.subCategory.placeholder}
                onChange={(e, data) =>
                  this.onDropDownChange(
                    data,
                    ADMIN_DROPDOWN_TITLES.subCategory.defaultVal
                  )
                }
                onAddItem={(e, d) => this.handleAddition(d, "subCategories")}
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
              <label>
                Icon Settings
                <Popup
                  inverted
                  className="icon-settings-popup"
                  content="Please click Upload after you've selected an icon."
                  trigger={<Icon name="question circle" />}
                ></Popup>
              </label>
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
                <Button
                  disabled={files ? false : true}
                  onClick={() => {
                    this.showImage();
                    this.toggleIconVisibility();
                  }}
                  content={iconVisibility ? "Hide image" : " Show image"}
                />
                <Transition
                  visible={iconVisibility}
                  animation="scale"
                  duration={3000}
                >
                  <Image
                    size="small"
                    className="admin-icon-transition"
                    src={iconSrc}
                  />
                </Transition>
              </Button.Group>
            </Form.Field>
          </Form.Group>
        </Form>
        <CustomEditor firebase={this.props.firebase} />

        {/*  */}

        <div className="answers-container">
          {/* <AnswerTemplate
            quantity={this.state.quantity}
            onUpdateQuantity={this.updateQuantity}
          /> */}
        </div>
        <Button
          /* disabled={editorTextContent ? true : false} */
          disabled={isPostEmpty ? true : false}
          onClick={this.onPreview}
        >
          {preview ? "Close Preview" : "Open Preview"}
        </Button>
        <i className="fas fa-eye-dropper"></i>

        <Button
          disabled={editorTextContent ? true : false}
          onClick={this.onSubmit}
        >
          Create
        </Button>
        <Button
          disabled={editorTextContent ? true : false}
          onClick={this.onEdit}
        >
          Edit
        </Button>

        {preview && editorState && (
          <div className="container-preview">
            {/* <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  draftToHtml(convertToRaw(editorState.getCurrentContent())),
                  "editorTextContent"
                ),
              }}
            /> */}
            <div dangerouslySetInnerHTML={{ __html: post }} />
          </div>
        )}
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   posts: state.allPosts,
//   // users: Object.keys(state.userState.users || {}).map((key) => ({
//   //   ...state.userState.users[key],
//   //   uid: key,
//   // })),
//   // console.log(state, "STATE");
//   // const { posts } = state;
//   // return { posts };
// });

const mapStateToProps = (state) => {
  // posts: state.allPosts,
  // users: Object.keys(state.userState.users || {}).map((key) => ({
  //   ...state.userState.users[key],
  //   uid: key,
  // })),
  // console.log(state, "STATE");
  const { posts, newPostState } = state;
  return { posts, newPostState };
};

const mapDispatchToProps = (dispatch) => {
  // console.log("DISPATCH");
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    onSetNewPostValues: (values) => dispatch(setNewPostValues(values)),
    // onSetUsers: (users) => dispatch({ type: "USERS_SET", users }),
  };
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuthorization(condition),
  withFirebase
)(CreateLesson);
