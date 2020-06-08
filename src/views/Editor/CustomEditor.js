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
        // [this.props.sectionKey]: editorState,
        "About the video": {
          ...this.props.newPostState.post["About the video"],
          ...JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        },
        // JSON.stringify(
        //   convertToRaw(editorState.getCurrentContent())
        // ),
      },
    });

    console.log(this.props.newPostState.post[this.props.sectionKey], "SEC");
    this.setState({
      try: convertToRaw(editorState.getCurrentContent()),
    });

    // this.props.onEditorTextChange(checkIfcontainsJustSpaces);
  };

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
    const { post } = this.props.newPostState;
    const { sectionKey } = this.props;

    // we check on blocks in case it's not editor state
    const currentEditor =
      post[sectionKey] === "" ||
      post[sectionKey].blocks ||
      post[sectionKey][0] === "<"
        ? EditorState.createEmpty()
        : post[sectionKey];

    // console.log(sectionKey,'SEEEc')
    // console.log(this.props[post[sectionKey]])
    // console.log(JSON.parse(post[sectionKey]),'LOL')
    // const contentState =
    //   post[sectionKey] === "" ? "" : convertFromRaw(post[sectionKey]);
    // this.setState({
    //   editorState: EditorState.createWithContent(contentState),
    // });

    // console.log(post[sectionKey] === "" ? "it's string" :(EditorState.createWithContent(convertFromRaw(JSON.parse(post[sectionKey])))));
    // console.log(EditorState.createWithContent(contentState), "contentState");
    // console.log(JSON.stringify(post[sectionKey]), "SECTION_KEY");
    // console.log(currentEditor._immutable, "currentEditor");
    // {
    //    post[sectionKey] === ""
    //   ? EditorState.createEmpty()
    //   : EditorState.createWithContent(
    //       convertFromRaw(JSON.parse(post[sectionKey]))
    //     )
    // }
    console.log(this.props.newPostState, "NEWPS");
    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            ref={this.editorRef} //currentEditor  EditorState.createEmpty()
            /* editorState={editorState} */
            /* editorState={post} */

            editorState={
              post[sectionKey] === ""
                ? EditorState.createEmpty()
                : EditorState.createWithContent(
                    convertFromRaw(JSON.parse(post[sectionKey]))
                  )
            }
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

          {/* <Button
            disabled={isEditorEmpty ? true : false}
            onClick={this.onPreview}
          >
            {preview ? "Close Preview" : "Open Preview"}
          </Button> */}
          {/* <div className="container-preview">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  (draftToHtml(convertToRaw(editorState.getCurrentContent())),
                  "isEditorEmpty"),
              }}
            />
          </div> */}
          {/* <textarea
            style={{ height: "300px", width: "300px" }}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
          
        {/* </div> */}
          {/* <button onClick={this.onSubmit}> Submit to DB</button> */}

          {/* <div className="answers-container">
          <AnswerTemplate
            quantity={this.state.quantity}
            onUpdateQuantity={this.updateQuantity}
          />
        </div>
        <Button
          disabled={isEditorEmpty ? true : false}
          onClick={this.onPreview}
        >
          {preview ? "Close Preview" : "Open Preview"}
        </Button>
        <i className="fas fa-eye-dropper"></i>

        <Button
          disabled={isEditorEmpty ? true : false}
          onClick={this.onSubmit}
        >
          Create
        </Button>
        <Button
          disabled={isEditorEmpty ? true : false}
          onClick={this.onEdit}
        >
          Edit
        </Button>

        {preview && editorState && (
          <div className="container-preview">
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  draftToHtml(convertToRaw(editorState.getCurrentContent())),
                  "isEditorEmpty"
                ),
              }}
            />
          </div> */}
          {/* )} */}
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
