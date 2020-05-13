import React, { Component } from "react";
import {
  EditorState,
  Modifier,
  convertToRaw,
  ContentState,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from "prop-types";
import { EDITOR_OPTIONS } from "../../constants/shared";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import { Button, Dropdown, Input } from "semantic-ui-react";
import { LESSON_STATUS } from "../../constants/shared";
import { CustomColorPicker } from "./CutomComponents";
import sanitizeHtml from "sanitize-html-react";
import { setNewPostValues } from "../../redux/actions";
import { connect } from "react-redux";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

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
    // console.log(this.props.,'PROPS')
    const blocks = convertToRaw(this.state.editorState.getCurrentContent())
      .blocks;

    const checkIfcontainsJustSpaces =
      blocks
        .map((block) => (!block.text.trim() && "\n" && "") || block.text)
        .join("\n") === "";

    this.setState({
      editorState,
      isEditorEmpty: checkIfcontainsJustSpaces,
    });

    const currentTextContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    this.props.onSetNewPostValues({
      post: {
        ...this.props.onSetNewPostValues,
        [this.props.sectionKey]: sanitizeHtml(currentTextContent, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
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
    // console.log(this.props.firebase.users(), "FIRE");
  }
  render() {
    const { editorState } = this.state;
    const { post } = this.props.newPostState;
    const editorNode = this.editorRef.current;
    // console.log(editorState, "ost");
    // // console.log(editorState, "editorState");
    // localStorage.setItem(
    //   "writtenContent",
    //   draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // );

    // console.log(localStorage.writtenContent);
    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            ref={this.editorRef}
            /* editorState={editorState} */
            /* editorState={post} */
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            toolbarClassName="toolbar-class"
            editorClassName="editor-area"
            toolbarClassName="editor-toolbar"
            /* onEditorStateChange={(e,v) => console.log(e,v,"onEditorStateChange")} */
            /* onChange={(e,v) => console.log(e,v,"onChange")}   */
            /* onContentStateChange={(e,v) => console.log(e,v,"onContentStateChange")} */
            /* toolbar={{
              colorPicker: { component: CustomColorPicker },
            }} */

            toolbar={{
              fontFamily: { options: EDITOR_OPTIONS.fontFamily },
              colorPicker: { component: CustomColorPicker },
            }}
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
