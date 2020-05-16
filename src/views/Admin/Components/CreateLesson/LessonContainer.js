import React, { Component } from "react";
import { withFirebase } from "../../../Firebase";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withAuthorization } from "../../../Session";
import * as ROLES from "../../../../constants/roles";
import draftToHtml from "draftjs-to-html";

import {
  ADMIN_TABS,
  CATEGORIES,
  ADMIN_DROPDOWN_TITLES,
  POSTS_BUCKET_NAME,
  INIT_NEW_POST_VALUES,
  ICON_POST_STATUS,
  CREATE_LESSON_STAGES,
} from "../../../../constants/shared";
import { EditorState, convertToRaw } from "draft-js";
import { Form, Button, Popup, Icon, Input, Tab } from "semantic-ui-react";
import { getAllPostsValues, setNewPostValues } from "../../../../redux/actions";
import Swal from "sweetalert2";
import {
  LESSON_STATUS,
  ICON_POST_REMOVE_STATUS,
  ICON_POST_ADD_STATUS,
} from "../../../../constants/shared";
import { AfterWatch, BeforeWatch, LessonContent, Practise } from "./index";

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

const fireAlert = (state, values, error = null) => {
  Swal.fire({
    icon: state ? values.icon.success : values.icon.error,
    heightAuto: false,
    title: state ? values.title.success : values.title.error,
    text: state ? values.text.success : error ? error : values.text.error,
    customClass: {
      confirmButton: "ui green basic button",
      container: "alert-container-class",
    },
    position: "top-end",
    popup: "swal2-show",
    className: "admit-sweet-alert",
  });

  setTimeout(() => Swal.close(), 4000);
};

class CreateLesson extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      loading: false,
      users: [],
      posts: [],
      iconFile: null,
      iconSrc: "",
      iconVisibility: false,
      onPreview: false,
      editorState: EditorState.createEmpty(),
      editorTextContent: true,
      quantity: 1,
      answers: [],
      title: "",
      isEditorEmpty: true,
    };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  handleAddition = (data, type) => {
    this.props.onGetAllPostsValues({
      [type]: [
        { key: data.value, text: data.value, value: data.value },
        ...this.props.posts.subCategories,
      ],
    });
  };

  componentDidMount() {
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

        const setSubCategories = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.subCategory)),
        ]);

        const setFocuses = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.focus)),
        ]);

        // console.log(setSubCategories, "setSubCategories");

        // set posts
        this.props.onGetAllPostsValues({
          allPosts: postsList,
          subCategories: setSubCategories,
          focuses: setFocuses,
        });

        this.props.onSetNewPostValues({
          subCategory: setSubCategories[0] && setSubCategories[0].text,
          focus: setFocuses[0] && setFocuses[0].text,
        });
      }
    });
  }

  onDropDownChange = (data, dropDownType) => {
    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });
  };

  changeTitle = (e, d) => this.props.onSetNewPostValues({ title: d.value });
  componentWillUnmount() {
    this.props.firebase.posts().off();
  }

  //-----------------  icon upload handler
  handleChangeInput = (files) => {
    this.setState({
      iconFile: files,
    });
  };

  handleSaveImage = () => {
    const { iconFile } = this.state;
    const { iconPath } = this.props.newPostState;
    const { firebase } = this.props;
    // console.log(!iconPath.length, "ICON_PATH");
    // console.log(iconPath, "iconPathINIT");

    if (!iconPath.length && iconFile && iconFile[0]) {
      const storageRef = firebase.storage.ref(
        `${POSTS_BUCKET_NAME}/${iconFile[0].lastModified}-${iconFile[0].name}`
      );
      storageRef
        .put(iconFile[0])
        .then(() => {
          fireAlert(true, ICON_POST_ADD_STATUS);
          this.props.onSetNewPostValues({
            iconPath: storageRef.fullPath,
          });
        })
        .catch((error) => {
          fireAlert(false, ICON_POST_ADD_STATUS, error);
        });
    }
    if (!!iconPath.length) {
      firebase.storage
        .ref()
        .child(iconPath)
        .delete()
        .then(() => {
          fireAlert(true, ICON_POST_REMOVE_STATUS);
          this.props.onSetNewPostValues({ iconPath: "" });
          this.setState({ iconFile: null });
        })
        .catch((error) => {
          fireAlert(false, ICON_POST_REMOVE_STATUS, error);
        });
    }
  };

  toggleIconVisibility = () =>
    this.setState({ iconVisibility: !this.state.iconVisibility });

  showImage = () => {
    console.log("HANDLE SHOW IMAGE");
    console.log(this.props.newPostState.iconPath, "ICONPATH");
    console.log(`${POSTS_BUCKET_NAME}/${this.state.iconFile}`, " drufg");
    // if (this.state.iconSrc === "") {
    this.props.firebase.storage
      .ref()
      .child(`${POSTS_BUCKET_NAME}/${this.state.iconFile}`)
      .getDownloadURL()
      .then((url) => {
        this.setState({
          iconSrc: url,
        });
      });
    // }
  };

  //

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  onSubmitPost = () => {
    this.props.firebase.posts().push().set(this.props.newPostState);
    this.props.onSetNewPostValues(INIT_NEW_POST_VALUES);
    fireAlert(true, LESSON_STATUS);

    //   fireAlert(true);
    // } else {
    //   fireAlert(false);
    // }
  };

  onEditorTextChange = (value) => this.setState({ isEditorEmpty: value });

  render() {
    const {
      loading,
      iconFile,
      iconSrc,
      iconVisibility,
      preview,
      editorTextContent,
      // editorState,
      isEditorEmpty,
    } = this.state;
    const {
      category,
      subCategory,
      post,
      focus,
      title,
      iconPath,
    } = this.props.newPostState;
    const { categories, focuses, subCategories } = this.props.posts;
    // console.log(this.props.newPostState.post, "POST_POST");
    // // post[sectionKey]
    if (post["about"] !== "") {
      console.log(
        draftToHtml(convertToRaw(post["about"].getCurrentContent()), "POST")
      );
    }
    const panes = [
      {
        menuItem: CREATE_LESSON_STAGES.practise,
        render: () => (
          <Tab.Pane>
            <Practise sectionKey={CREATE_LESSON_STAGES.practise.key} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: CREATE_LESSON_STAGES.before,
        render: () => (
          <Tab.Pane>
            <BeforeWatch sectionKey={CREATE_LESSON_STAGES.before.key} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: CREATE_LESSON_STAGES.after,
        render: () => (
          <Tab.Pane>
            <AfterWatch sectionKey={CREATE_LESSON_STAGES.after.key} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: CREATE_LESSON_STAGES.content,
        render: () => (
          <Tab.Pane>
            <LessonContent sectionKey={CREATE_LESSON_STAGES.content.key} />
          </Tab.Pane>
        ),
      },
    ];

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
                label={ADMIN_DROPDOWN_TITLES.focus.label}
                selection
                search
                allowAdditions
                options={focuses}
                value={focus}
                placeholder={ADMIN_DROPDOWN_TITLES.focus.label}
                onChange={(e, data) =>
                  this.onDropDownChange(
                    data,
                    ADMIN_DROPDOWN_TITLES.focus.defaultVal
                  )
                }
                onAddItem={(e, d) => this.handleAddition(d, "focuses")}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Form widths="equal" onSubmit={this.handleSaveImage}>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>Title</label>
              <Form.Input
                value={title}
                onChange={this.changeTitle}
                placeholder="Title"
              />
            </Form.Field>
            <Form.Field>
              <label>
                Icon Settings
                <Popup
                  inverted
                  className="icon-settings-popup"
                  content="Please click Upload after you've selected an icon."
                  trigger={
                    <Icon className="icon-trigger" name="question circle" />
                  }
                />
              </label>

              <input
                accept="image/*"
                ref={this.fileInputRef}
                type="file"
                hidden
                onChange={(e) => this.handleChangeInput(e.target.files)}
              />
              <Button.Group className="admin-button-group" fluid>
                <Button
                  content="Choose Icon"
                  labelPosition="left"
                  icon="file"
                  onClick={() => this.fileInputRef.current.click()}
                />
                <Button
                  color={!iconPath.length ? "facebook" : "red"}
                  className="upload-button"
                  disabled={iconFile ? false : true}
                  type="submit"
                >
                  {!iconPath.length ? "Upload" : "Remove"}
                </Button>
                {/* <Button
                  disabled={iconFile ? false : true}
                  onClick={() => {
                    this.showImage();
                    this.toggleIconVisibility();
                  }}
                  content={iconVisibility ? "Hide icon" : "Preview icon"}
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
                </Transition> */}
              </Button.Group>
            </Form.Field>
          </Form.Group>
        </Form>

        <Tab
          className="tab-lesson-stages"
          menu={{ secondary: true, pointing: true }}
          panes={panes}
        />
        {/* <CustomEditor
          onEditorTextChange={this.onEditorTextChange}
          firebase={this.props.firebase}
        /> */}

        {/*  */}

        <div className="answers-container">
          {/* <AnswerTemplate
            quantity={this.state.quantity}
            onUpdateQuantity={this.updateQuantity}
          /> */}
        </div>
        <Button
          /* disabled={isEditorEmpty ? true : false} */
          onClick={this.onPreview}
        >
          {preview ? "Close Preview" : "Open Preview"}
        </Button>
        <i className="fas fa-eye-dropper"></i>

        <Button
          disabled={isEditorEmpty ? true : false}
          onClick={this.onSubmitPost}
        >
          Create
        </Button>
        <Button disabled={isEditorEmpty ? true : false} onClick={this.onEdit}>
          Edit
        </Button>
        {/* // editorState   */}
        {preview && (
          <div className="container-preview">
            {/* { draftToHtml(convertToRaw(post["about"].getCurrentContent())} */}
            <div
              dangerouslySetInnerHTML={{
                __html: draftToHtml(
                  convertToRaw(post["about"].getCurrentContent())
                ),
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { posts, newPostState } = state;
  return { posts, newPostState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    onSetNewPostValues: (values) => dispatch(setNewPostValues(values)),
  };
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuthorization(condition),
  withFirebase
)(CreateLesson);
