import React, { Component } from "react";
import { withFirebase } from "../../../Firebase";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withAuthorization } from "../../../Session";
import * as ROLES from "../../../../constants/roles";
import draftToHtml from "draftjs-to-html";
import {
  ADMIN_DROPDOWN_TITLES,
  POSTS_BUCKET_NAME,
  INIT_NEW_POST_VALUES,
  CREATE_LESSON_STAGES,
} from "../../../../constants/shared";
import { EditorState, convertToRaw } from "draft-js";
import {
  Form,
  Button,
  Popup,
  Icon,
  Tab,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { getAllPostsValues, setNewPostValues } from "../../../../redux/actions";
import {
  LESSON_STATUS,
  ICON_POST_REMOVE_STATUS,
  ICON_POST_ADD_STATUS,
} from "../../../../constants/shared";
import { AfterWatch, BeforeWatch, LessonContent, Practise } from "./index";
import { transformToOptions, fireAlert } from "../../../../utils";

class CreateLesson extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      isLoading: false,
      users: [],
      posts: [],
      iconFile: null,
      iconSrc: "",
      iconVisibility: false,
      onPreview: false,
      editorState: EditorState.createEmpty(),
      editorTextContent: true,
      isEditorEmpty: true,
      exercises: [],
      errorFields: [
        // category: false,
        // focus: false,
        // subCategory: false,
        // title: false,
      ],
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

  fetchPostsFromDb = () => {
    // reload the page
    // this.setState({ isLoading: true });
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
        });

        const setSubCategories = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.subCategory)),
        ]);

        const setFocuses = transformToOptions([
          ...new Set(postsList.map((obj, key) => obj.focus)),
        ]);

        // set posts
        this.props.onGetAllPostsValues({
          allPosts: postsList,
          subCategories: setSubCategories,
          focuses: setFocuses,
          // exercisesTypes: setExercisesTypes,
          // exercisesDescriptions: setExercisesDescriptions,
        });

        // assign subcategoris and focuses if there's some values
        INIT_NEW_POST_VALUES.subCategory =
          setSubCategories[0] && setSubCategories[0].text;

        INIT_NEW_POST_VALUES.focus = setFocuses[0] && setFocuses[0].text;

        // set init
        this.props.onSetNewPostValues(INIT_NEW_POST_VALUES);
      }
    });
  };
  componentDidMount() {
    this.fetchPostsFromDb();
  }

  onDropDownChange = (data, dropDownType) => {
    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });

    this.setState({
      errorFields: { ...this.state.errorFields, [dropDownType]: false },
    });
  };

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

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  isEmptyField = (value) => !value || value.trim === "";
  checkEachRequiredField = () => {
    const { category, subCategory, focus, title } = this.props.newPostState;
    //  clone state to avoid immutability
    const errorFields = Object.assign({}, this.state.errorFields);

    // equal to false if there's an empty field
    let isAllFieldFilled;

    // iterate through each array
    [{ category }, { subCategory }, { focus }, { title }].forEach((obj) => {
      isAllFieldFilled = !Object.values(obj)[0] ? false : true;
      errorFields[Object.keys(obj)[0]] = !Object.values(obj)[0] && true;
    });

    this.setState({ errorFields });
    return isAllFieldFilled;
  };

  convertEditorStateToHtml = () => {
    this.setState({ isLoading: true });
    // clone an opbject to avoid immutability
    const post = Object.assign({}, this.props.newPostState.post);
    const assets = this.props.newPostState.assets;

    Object.entries(post).forEach((arr) => {
      // if string is not empty
      if (!!arr[1]) {
        // entityMap => uploaded images
        const editorRow = Object.values(
          convertToRaw(arr[1].getCurrentContent()).entityMap
        );
        // filter by uploaded images (it can be not uplaoded images like links)
        if (!!Object.entries(editorRow).length) {
          const filterEditor = editorRow.filter((obj) =>
            obj.data.src.includes("blob")
          );
          // once we found some values , reassign links from local machine to db
          if (!!filterEditor.length) {
            filterEditor.map(
              (obj, key) =>
                (obj.data.src = Object.values(assets[arr[0]][key])[0])
            );
          }
        }
        // convert editor to html because EditorState has undefined values which is why we can't push it into DB
        post[arr[0]] = draftToHtml(convertToRaw(arr[1].getCurrentContent()));
      }
    });

    // change props values
    return new Promise((resolve) => {
      resolve(this.props.onSetNewPostValues({ post }));
    }).then(() => {
      // push to db afterwards
      this.pushPostToDb();
    });
  };

  uploadAssetsToDb = () => {
    const { newPostState, firebase } = this.props;
    const assets = Object.assign({}, newPostState.assets);

    Object.values(assets).map((arrayOfObj) => {
      if (arrayOfObj && !!arrayOfObj.length) {
        arrayOfObj.map((obj) => {
          const imgSection = Object.values(obj)[0].section;
          const imgUrl = Object.keys(obj)[0];
          // build a path like this => posts/title/about/imageUrl
          const storageRef = firebase.storage.ref(
            `${POSTS_BUCKET_NAME}/${newPostState.title
              .split(" ")
              .join("_")}/${imgSection}/${Object.values(obj)[0].name}`
          );

          //  put file in a storage
          storageRef.put(Object.values(obj)[0]).then(() => {
            this.props.firebase.storage
              .ref()
              .child(storageRef.fullPath)
              .getDownloadURL()
              .then((url) => {
                const index = assets[imgSection].findIndex(
                  (img) => Object.keys(img)[0] === imgUrl
                );

                console.log(
                  assets[imgSection][index][imgUrl],
                  "assets[imgSection][index][imgUrl]"
                );
                assets[imgSection][index][imgUrl] = url;
                this.props.onSetNewPostValues({ assets });
              })
              .then(() => {
                this.convertEditorStateToHtml();
              });
          });
        });
      }
    });
  };

  pushPostToDb = () => {
    this.props.firebase
      .posts()
      .push()
      .set(this.props.newPostState)
      .then(() => {
        this.setState({ isLoading: false });
        // call success modal and refresh props
        fireAlert(true, LESSON_STATUS).then(() => this.fetchPostsFromDb());
      })
      .catch((error) => fireAlert(false, LESSON_STATUS, error));
  };

  onSubmitPost = () => {
    if (this.checkEachRequiredField()) {
      // check if user uploaded some values
      if (
        Object.values(this.props.newPostState.assets).some(
          (arr) => !!arr.length
        )
      ) {
        // insert into db users assets and convert editor state
        this.uploadAssetsToDb();
      } else {
        // if not we just converting into html and pushing it into db
        this.convertEditorStateToHtml();
      }
    }
  };

  onEditorTextChange = (value) => this.setState({ isEditorEmpty: value });

  render() {
    const {
      isLoading,
      iconFile,
      iconSrc,
      iconVisibility,
      preview,
      editorTextContent,
      exercises,
      isEditorEmpty,
      errorFields,
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

    const panes = [
      {
        menuItem: CREATE_LESSON_STAGES.before,
        render: () => (
          <Tab.Pane>
            <BeforeWatch sectionKey={CREATE_LESSON_STAGES.before.key} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: CREATE_LESSON_STAGES.practise,
        render: () => (
          <Tab.Pane>
            <Practise
              exercises={exercises}
              sectionKey={CREATE_LESSON_STAGES.practise.key}
            />
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

    return isLoading ? (
      <Segment className="loader-admin">
        <Dimmer active>
          <Loader size="massive"> Loading </Loader>
        </Dimmer>
      </Segment>
    ) : (
      <div>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Dropdown
                className="capitalize"
                label={ADMIN_DROPDOWN_TITLES.category.label}
                selection
                search
                error={errorFields[ADMIN_DROPDOWN_TITLES.category.defaultVal]}
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
                error={
                  errorFields[ADMIN_DROPDOWN_TITLES.subCategory.defaultVal]
                }
                value={subCategory}
                options={subCategories}
                placeholder={ADMIN_DROPDOWN_TITLES.subCategory.placeholder}
                onChange={(e, data) =>
                  this.onDropDownChange(
                    data,
                    ADMIN_DROPDOWN_TITLES.subCategory.defaultVal
                  )
                }
                onAddItem={(e, d) =>
                  this.handleAddition(
                    d,
                    ADMIN_DROPDOWN_TITLES.subCategory.allValues
                  )
                }
              />
            </Form.Field>
            <Form.Field>
              <Form.Dropdown
                className="capitalize"
                label={ADMIN_DROPDOWN_TITLES.focus.label}
                selection
                search
                allowAdditions
                error={errorFields[ADMIN_DROPDOWN_TITLES.focus.defaultVal]}
                value={focus}
                options={focuses}
                placeholder={ADMIN_DROPDOWN_TITLES.focus.label}
                onChange={(e, data) =>
                  this.onDropDownChange(
                    data,
                    ADMIN_DROPDOWN_TITLES.focus.defaultVal
                  )
                }
                onAddItem={(e, d) =>
                  this.handleAddition(d, ADMIN_DROPDOWN_TITLES.focus.allValues)
                }
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Form widths="equal" onSubmit={this.handleSaveImage}>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>{ADMIN_DROPDOWN_TITLES.title.label}</label>
              <Form.Input
                error={errorFields.title}
                value={title}
                onChange={(e, data) =>
                  this.onDropDownChange(
                    data,
                    ADMIN_DROPDOWN_TITLES.title.defaultVal
                  )
                }
                placeholder={ADMIN_DROPDOWN_TITLES.title.placeholder}
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
          disabled={isEditorEmpty ? false : false} // true: false
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
