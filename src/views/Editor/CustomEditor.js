import React, { Component } from "react";
import {
  EditorState,
  Modifier,
  convertToRaw,
  ContentState,
  AtomicBlockUtils,
  convertFromRaw,
  SelectionState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from "prop-types";
import { EDITOR_OPTIONS } from "../../constants/shared";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import { Button, Input } from "semantic-ui-react";
import {
  LESSON_STATUS,
  SLICED_UPLOADED_IMAGE_KEY,
} from "../../constants/shared";
import { CustomColorPicker, VideoPlayer } from "./CustomComponents";
import sanitizeHtml from "sanitize-html-react";
import { setNewValues } from "../../redux/actions";
import { connect } from "react-redux";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { POSTS_BUCKET_NAME } from "../../constants/shared";

// import * as PluginEditor from "draft-js-plugins-editor";
// style

import "./style.scss";

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
    preview: false,
    modalWindow: false,
  };

  addStar = () => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      "⭐",
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };

  render() {
    return <div onClick={this.addStar}>⭐</div>;
  }
}

const fireAlert = (state) => {
  Swal.fire({
    icon: state ? LESSON_STATUS.icon.success : LESSON_STATUS.icon.error,
    heightAuto: false,
    title: state ? LESSON_STATUS.title.success : LESSON_STATUS.title.error,
    text: state ? LESSON_STATUS.text.success : LESSON_STATUS.text.error,
    customClass: {
      confirmButton: "ui green basic button",
      container: "alert-container-class",
    },
    popup: "swal2-show",
  });

  setTimeout(() => Swal.close(), 4000);
};

class CustomEditor extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    // const contentState = convertFromRaw(content);
    // const html = "<p>Hey this <strong>editor</strong> rocks 😀</p>";
    // const contentBlock = htmlToDraft(html);

    // if (contentBlock) {
    //   const contentState = ContentState.createFromBlockArray(
    //     contentBlock.contentBlocks
    //   );
    //   const editorState = EditorState.createWithContent(contentState);
    //   this.state = {
    //     editorState,
    //   };
    // }

    this.state = {
      editorState: EditorState.createEmpty(),
      isEditorEmpty: true,
      quantity: 1,
      uploadedImages: [],
      answers: [],
    };
  }

  onEditorStateChange = (editorState) => {
    const { sectionKey } = this.props;
    // get all entities we uplaoded, for examples media, link, custom elements
    const entitityValues = Object.values(
      convertToRaw(editorState.getCurrentContent()).entityMap
    );
    // // get all images uploaded from local device
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

    console.log(this.props.newPostState, "SEC");
    this.setState({
      try: convertToRaw(editorState.getCurrentContent()),
    });

    // this.props.onEditorTextChange(checkIfcontainsJustSpaces);
  };

  componentDidMount() {
    // console.log(this.editorRef.current,'THIS')
    // this.fetchFromLocalStorage();
    // console.log(document.querySelector(".rdw-fontfamily-dropdown"));
  }

  fetchFromLocalStorage = () => {
    const { newPostState, sectionKey } = this.props;
    if (
      newPostState.postLocalStorage[sectionKey] !== "" &&
      newPostState.post[sectionKey] === ""
    ) {
      this.props.onSetPostNewValues({
        post: {
          ...this.props.newPostState.post,
          [this.props.sectionKey]: EditorState.createWithContent(
            convertFromRaw(
              JSON.parse(newPostState.postLocalStorage[sectionKey])
            )
          ),
        },
      });
    }
  };

  componentDidUpdate() {
    this.fetchFromLocalStorage();
  }

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  _uploadImageCallBack = (file) => {
    const { iconPath } = this.props.newPostState;
    const { firebase } = this.props;
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

    // if (fontFamilyOptionWrapper) {
    //   Object.values(fontFamilyOptionWrapper.children).forEach((tag) => {
    //     tag.style.fontFamily = tag.innerHTML;
    //   });
    // }
    // console.log(fontFamilyOptionWrapper && fontFamilyOptionWrapper.children);
    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            ref={this.editorRef} //currentEditor  EditorState.createEmpty()
            /* editorState={editorState} */
            /* editorState={post} */

            editorState={currentEditor}
            onEditorStateChange={this.onEditorStateChange}
            toolbarClassName="toolbar-class"
            editorClassName="editor-area"
            toolbarClassName="editor-toolbar"
            /* onChange={(e,v) => console.log(e,v,"onChange")}   */
            /* onContentStateChange={(e,v) => console.log(e,v,"onContentStateChange")} */
            /* toolbar={{
              colorPicker: { component: CustomColorPicker },
            }} */

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
    onSetPostNewValues: (values) => dispatch(setNewValues(values)),
  };
};

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(CustomEditor);
