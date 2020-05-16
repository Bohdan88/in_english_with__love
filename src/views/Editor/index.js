import React, { Component } from "react";
import {
  EditorState,
  Modifier,
  convertToRaw,
  ContentState,
  AtomicBlockUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from "prop-types";
import { EDITOR_OPTIONS } from "../../constants/shared";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import { Button, Input } from "semantic-ui-react";
import { LESSON_STATUS } from "../../constants/shared";
import { CustomColorPicker, VideoPlayer } from "./CustomComponents";
import sanitizeHtml from "sanitize-html-react";
import { setNewPostValues } from "../../redux/actions";
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

class CustomEditor extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    // const contentState = convertFromRaw(content);
    const html = "<p>Hey this <strong>editor</strong> rocks 😀</p>";
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }

    this.state = {
      editorState: EditorState.createEmpty(),
      isEditorEmpty: true,
      quantity: 1,
      uploadedImages: [],
      answers: [],
      templateNumber: [
        <AnswerTemplate
          quantity={this.state.quantity}
          onUpdateQuantity={this.updateQuantity}
        />,
      ],
      // answers: <AnswerTemplate index={1} />,
    };
  }

  updateQuantity = () => {
    let arr = this.state.templateNumber;
    arr.push(this.state.templateNumber);
    this.setState({ quantity: this.state.quantity + 1, templateNumber: arr });
  };

  onEditorStateChange = (editorState) => {
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent()), "OOOK"));
    // console.log(this.props.,'PROPS')
    // const blocks = convertToRaw(this.state.editorState.getCurrentContent())
    //   .blocks;

    // const checkIfcontainsJustSpaces =
    //   blocks
    //     .map((block) => (!block.text.trim() && "\n" && "") || block.text)
    //     .join("\n") === "";

    // this.setState({
    //   editorState: {
    //     ...this.state.editorState,
    //     [this.props.sectionKey]: editorState,
    //   },
    //   // editorState,
    //   // isEditorEmpty: checkIfcontainsJustSpaces,
    // });

    // if (this.props.newPostState.post[this.props.sectionKey]) {
    //   console.log(
    //     draftToHtml(
    //       convertToRaw(
    //         this.props.newPostState.post[
    //           this.props.sectionKey
    //         ].getCurrentContent()
    //       ),
    //       "OOOK"
    //     )
    //   );
    // }

    // let clean =  sanitizeHtml((currentTextContent))
    // const currentTextContent = "<p>Ok</p>"

    // console.log(this.props.newPostState.post,'this.props.onSetNewPostValues.post')
    // --------
    // this.props.onSetNewPostValues({
    //   post: {
    //     ...this.props.newPostState.post,
    //     [this.props.sectionKey]: sanitizeHtml(currentTextContent, {
    //       allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    //     }),
    //   },
    // });
    //--------------
    this.props.onSetNewPostValues({
      post: {
        ...this.props.newPostState.post,
        [this.props.sectionKey]: editorState,
      },
    });

    // this.props.onEditorTextChange(checkIfcontainsJustSpaces);
  };

  // onSubmit = () => {
  //   const { editorState } = this.state;
  //   // const post =
  //   //   editorState &&
  //   //   editorState.getCurrentContent() &&
  //   //   draftToHtml(convertToRaw(editorState.getCurrentContent()));

  //   if (post) {
  //     // this.props.firebase.posts().push().set({
  //     //   post: post,
  //     //   type: "history",
  //     // });

  //     this.setState({
  //       editorState: "",
  //     });
  //     fireAlert(true);
  //   } else {
  //     fireAlert(false);
  //   }
  // };

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  componentDidMount() {
    // const fontFamilies = document.querySelectorAll(
    //   ".rdw-dropdown-optionwrapper"
    // );
    // console.log(fontFamilies, "fontFamilies");
    // console.log(fontFamilies, "fontFamilies");
    // document.querySelector('rdw-dropdownoption-default').fontFamily
    // console.log(this.props.firebase.users(), "FIRE");
  }
  _uploadImageCallBack = (file) => {
    // const { iconFile } = this.state;
    const { iconPath } = this.props.newPostState;
    const { firebase } = this.props;
    // console.log(this.state, "STATUSINCALLVAKC");
    // long story short, every time we upload an image, we
    // need to save it to the state so we can get it's data
    // later when we decide what to do with it.

    // Make sure you have a uploadImages: [] as your default state
    let uploadedImages = this.state.uploadedImages;

    // let imagePath = `${POSTS_BUCKET_NAME}/${file.lastModified}-${file.name}`;
    // // console.log(file,'filefile')
    // const storageRef = firebase.storage.ref(imagePath);

    // storageRef
    //   .put(file)
    //   .then(() => {
    //     console.log("NOICE");
    //     // fireAlert(true, ICON_POST_ADD_STATUS);
    //   })
    //   .catch((error) => {
    //     console.log("ERROR");
    //   });

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };

    // POSTS_BUCKET_NAME
    // console.log(uploadedImages,'uploadedImages')
    // uploadedImages.push(imageObject);

    // console.log(imagePath, "imagePath");
    this.setState({ uploadedImages: uploadedImages });
    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    // let lastLink = "";
    // let source = firebase.storage
    //   .ref()
    //   .child(`${POSTS_BUCKET_NAME}/${imagePath}`)
    //   .getDownloadURL()
    //   .then((url) => {
    //     lastLink = url;
    //     // this.setState({
    //     //   iconSrc: url,
    //     // });
    //   });

    // console.log(lastLink, "lastLink");
    return new Promise((resolve, reject) => {
      // resolve({ data: { link: imageObject.localSrc } });
      resolve({
        data: { link: imageObject.localSrc },
      });
    });
  };

  _addImageFromState = () => {
    const imgSrc = "";
    const alt = "";
    // const { imgSrc, alt } = this.state;
    let { height, width } = this.state;
    const { onChange } = this.props;
    if (!isNaN(height)) {
      height += "px";
    }
    if (!isNaN(width)) {
      width += "px";
    }
    onChange(imgSrc, height, width, alt);
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
    const editorNode = this.editorRef.current;
    // console.log(
    //   draftToHtml(convertToRaw(editorState.getCurrentContent()), "OOOK")
    // );
    // console.log(editorState, "ost");
    // // console.log(editorState, "editorState");
    // localStorage.setItem(
    //   "writtenContent",
    //   draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // );
    console.log(this.state.uploadedImages, "statusinrender");

    const currentEditor =
      post[sectionKey] === "" ? EditorState.createEmpty() : post[sectionKey];

    console.log(
      draftToHtml(convertToRaw(currentEditor.getCurrentContent()), "OOOK")
    );

    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            ref={this.editorRef}
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
    onSetNewPostValues: (values) => dispatch(setNewPostValues(values)),
  };
};

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(CustomEditor);
