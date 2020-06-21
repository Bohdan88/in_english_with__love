import React, { Component } from "react";
import { connect } from "react-redux";
import { withFirebase } from "../../../Firebase";
import { compose } from "recompose";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  AtomicBlockUtils,
  ContentState,
} from "draft-js";
import _ from "lodash";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {
  EDITOR_OPTIONS,
  SLICED_UPLOADED_IMAGE_KEY,
} from "../../../../constants/shared";
import { CustomColorPicker, VideoPlayer } from "./CustomComponents";
import { setPostValues } from "../../../../redux/actions";

// style
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./style.scss";

class CustomEditor extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.state = {
      editorState: EditorState.createEmpty(),
      uploadedImages: [],
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState: editorState,
    });
    this.onChangeReduxState(editorState);
  };

  onChangeReduxState = _.debounce((editorState) => {
    const { sectionKey } = this.props;
    // get all entities we uplaoded, for examples media, link, custom elements

    const entitityValues = Object.values(
      convertToRaw(editorState.getCurrentContent()).entityMap
    );

    //  get all images uploaded from local device
    const allUploadedImagesLinks =
      !!entitityValues.length &&
      entitityValues.map((obj) =>
        obj.type === "IMAGE" && obj.data.src.includes("blob")
          ? obj.data.src.slice(SLICED_UPLOADED_IMAGE_KEY)
          : null
      );

    //--------------
    this.props.onSetPostNewValues({
      // if a user remove an image from editor => we remove it from redux store
      assets: {
        ...this.props.newPostState.assets,
        [sectionKey]: this.props.newPostState.assets[sectionKey].filter(
          (obj) =>
            !!Object.keys(obj).length &&
            !!allUploadedImagesLinks.length &&
            allUploadedImagesLinks.includes(Object.keys(obj)[0])
        ),
      },

      post: {
        ...this.props.newPostState.post,
        [this.props.sectionKey]: editorState,
      },
      postLocalStorage: {
        ...this.props.newPostState.postLocalStorage,
        [this.props.sectionKey]: JSON.stringify(
          convertToRaw(editorState.getCurrentContent())
        ),
      },
    });
  }, 300);

  transformJsonText = (state) => {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(state)));
  };

  fetchFromLocalStorage = () => {
    const { newPostState, sectionKey } = this.props;

    const transformToEditorState = this.transformJsonText(
      newPostState.postLocalStorage[sectionKey]
    );

    this.props.onSetPostNewValues({
      post: {
        ...this.props.newPostState.post,
        [this.props.sectionKey]: transformToEditorState,
      },
    });

    this.setState({ editorState: transformToEditorState });
  };

  componentDidMount() {
    const { newPostState, sectionKey } = this.props;

    if (
      !newPostState.post[sectionKey] ||
      newPostState.post[sectionKey] === ""
    ) {
      this.setState({
        editorState: EditorState.createEmpty(),
      });
    } else if (!!newPostState.post[sectionKey]._immutable) {
      this.setState({
        editorState: EditorState.createWithContent(
          newPostState.post[sectionKey].getCurrentContent()
        ),
      });

      // if typeof string after parsing it means that we received html code from db
    } else if (typeof JSON.parse(newPostState.post[sectionKey]) === "string") {
      const blocksFromHtml = htmlToDraft(
        JSON.parse(newPostState.post[sectionKey])
      );

      const { contentBlocks, entityMap } = blocksFromHtml;

      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );

      const editorState = EditorState.createWithContent(contentState);

      this.props.onSetPostNewValues({
        post: {
          ...this.props.newPostState.post,
          [this.props.sectionKey]: editorState,
        },
      });

      this.setState({ editorState: editorState });
    } else if (newPostState.postLocalStorage[sectionKey] !== "") {
      this.fetchFromLocalStorage();
    }
  }

  componentDidUpdate() {
    const { newPostState, sectionKey } = this.props;
    // console.log("UPDATE");
    // check if local storage has some values
    // if (
    //   newPostState.postLocalStorage[sectionKey] !== "" &&
    //   newPostState.post[sectionKey] === ""
    // ) {
    //   this.fetchFromLocalStorage();
    // }
  }

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  _uploadImageCallBack = (file) => {
    const { sectionKey } = this.props;

    // every time we upload an image, we
    // need to save it to the state so we can get it's data
    // Make sure you have a uploadImages: [] as your default state
    let uploadedImages = this.state.uploadedImages;

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };

    // assign section key to a file to make a reference in firebase
    file.section = sectionKey;

    // upload an asset into Redux
    this.props.onSetPostNewValues({
      assets: {
        ...this.props.newPostState.assets,
        [sectionKey]: this.props.newPostState.assets[sectionKey].concat({
          [imageObject.localSrc.slice(SLICED_UPLOADED_IMAGE_KEY)]: file,
        }),
      },
    });

    this.setState({ uploadedImages: uploadedImages });

    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    return new Promise((resolve, reject) => {
      resolve({
        data: { link: imageObject.localSrc },
      });
    });
  };

  _addImage = (src, height, width, alt) => {
    const { editorState, onChange, config } = this.props;
    const entityData = { src, height, width };
    if (config.alt.present) {
      entityData.alt = alt;
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity("IMAGE", "MUTABLE", entityData)
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      " "
    );
    onChange(newEditorState);
    this.doCollapse();
  };
  render() {
    const { editorState } = this.state;
    const { newPostState, sectionKey } = this.props;
    const { post } = this.props.newPostState;
    // console.log(this.props.newPostState, " this.props.newPostState");
    // console.log(post[sectionKey], "RENDER_RENDER");
    // we check on blocks in case it's not editor state
    // const currentEditor =
    //   newPostState.postLocalStorage[sectionKey] === "" &&
    //   (post[sectionKey] === "" ||
    //     post[sectionKey].blocks ||
    //     post[sectionKey][0] === "<")
    //     ? EditorState.createEmpty()
    //     : post[sectionKey];
    const currentEditor =
      post[sectionKey] === "" ? EditorState.createEmpty() : post[sectionKey];

    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            ref={this.editorRef} //currentEditor  EditorState.createEmpty()
            /* editorState={editorState} */
            /* editorState={post} */
            editorState={editorState}
            /* editorState={currentEditor} */
            onEditorStateChange={this.onEditorStateChange}
            toolbarClassName="toolbar-class"
            editorClassName="editor-area"
            toolbarClassName="editor-toolbar"
            toolbar={{
              fontFamily: { options: EDITOR_OPTIONS.fontFamily },
              colorPicker: { component: CustomColorPicker },
              embedded: { className: "default-embedded" },
              image: {
                addImageFromState: this._addImageFromState,
                uploadCallback: this._uploadImageCallBack,
                previewImage: true,
                alt: { present: true, mandatory: false },
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
              },
            }}
            toolbarCustomButtons={[<VideoPlayer />]}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { newPostState } = state;
  return { newPostState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetPostNewValues: (values) => dispatch(setPostValues(values)),
  };
};

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(CustomEditor);
