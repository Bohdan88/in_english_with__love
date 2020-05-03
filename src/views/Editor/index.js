import React, { Component } from "react";
import {
  EditorState,
  Modifier,
  convertToRaw,
  ContentState,
  convertFromRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { BlockPicker } from "react-color";
import PropTypes from "prop-types";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import { Button } from "semantic-ui-react";
import { LESSON_STATUS } from "../../constants/shared";
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

class ColorPic extends Component {
  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange("color", color.hex);
  };

  renderModal = () => {
    const { color } = this.props.currentState;
    return (
      <div onClick={this.stopPropagation}>
        <BlockPicker color={color} onChangeComplete={this.onChange} />
      </div>
    );
  };

  render() {
    const { expanded, onExpandEvent } = this.props;
    return (
      <div
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
      >
        <div onClick={onExpandEvent}>
          {/* <img src={icon} alt="" /> */}
          ICON
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
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
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onSubmit = () => {
    // draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // console.log(this.props.firebase.posts());
    // console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))

    const post =
      this.state.editorState &&
      this.state.editorState.getCurrentContent() &&
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

      console.log(convertToRaw(this.state.editorState.getCurrentContent()))
    if (post) {
      // this.props.firebase.posts().push().set({
      //   post: post,
      //   type: "history",
      // });

      this.setState({
        editorState: "",
      });
      fireAlert(true);
    } else {
      fireAlert(false);
    }
  };

  onPreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  render() {
    const { editorState, preview } = this.state;
    // console.log(editorState,'editorState')
    return (
      <div className="editor-component">
        <div className="container-editor">
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            toolbarClassName="toolbar-class"
            /* toolbar={{
            inline: { inDropdown: false },
            list: { inDropdown: false },
            textAlign: { inDropdown: false },
            link: { inDropdown: false },
            history: { inDropdown: false },
          }} */
            editorClassName="editor-area"
            toolbarClassName="editor-toolbar"
            toolbar={{
              colorPicker: { component: ColorPic },
            }}
            /* toolbarCustomButtons={[<CustomOption />]} */
          />

          {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
        </div>
        {/* <button onClick={this.onSubmit}> Submit to DB</button> */}

        <Button onClick={this.onPreview}>
          {preview ? "Close Preview" : "Open Preview"}
        </Button>
        <Button onClick={this.onSubmit}>Create</Button>
        <Button onClick={this.onEdit}>Edit</Button>

        {preview && editorState && (
          <div className="container-preview">
            <div
              dangerouslySetInnerHTML={{
                __html: draftToHtml(
                  convertToRaw(editorState.getCurrentContent())
                ),
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default CustomEditor;
