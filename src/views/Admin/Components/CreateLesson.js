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
} from "semantic-ui-react";
import { getAllPostsValues } from "../../../redux/actions";

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

class CreateLesson extends Component {
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
      iconVisibility: false,
    };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  handleAddition = (data, type) => {
    this.setState((prevState) => ({
      [type]: [{ text: data.value, value: data.value }, ...prevState[type]],
    }));
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

    // this.listener2 = this.props.firebase.posts().on("value", (snapshot) => {
    //   const postsObject = snapshot && snapshot.val();
    //   if (postsObject) {
    //     const postsList = Object.keys(postsObject).map((key) => ({
    //       ...postsObject[key],
    //       uid: key,
    //     }));

    //     this.setState({
    //       posts: postsList,
    //       loading: false,
    //     });

    //     // set posts
    //     this.setState({
    //       subCategories: transformToOptions([
    //         ...new Set(postsList.map((obj, key) => obj.type)),
    //       ]),
    //       bias: transformToOptions([
    //         ...new Set(postsList.map((obj, key) => obj.bias)),
    //       ]),
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

        // this.props.onGetAllPostsValues({posts: postsList});

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
          posts: postsList,
          subCategories: setSubCategories,
          bias: setBias,
        });
      }

      // this.props.onGetAllPostsValues(snapshot.val());
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

  componentWillUnmount() {
    // this.listener();
    // this.listener2();
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
      iconSrc,
      iconVisibility,
    } = this.state;

    console.log(this.state, "this.state");
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  // users: Object.keys(state.userState.users || {}).map((key) => ({
  //   ...state.userState.users[key],
  //   uid: key,
  // })),
  // console.log(state, "STATE");
  // const { posts } = state;
  // return { posts };
});

const mapDispatchToProps = (dispatch) => {
  // console.log("DISPATCH");
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    // onSetUsers: (users) => dispatch({ type: "USERS_SET", users }),
  };
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuthorization(condition),
  withFirebase
)(CreateLesson);
