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
import { Button, Dropdown, Input } from "semantic-ui-react";
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

/* <Input
      action={{
        color: "teal",
        labelPosition: "right",
        icon: "plus",
        content: `Add Answer ${index}`,
      }}
      defaultValue=""
    /> */

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
      editorTextContent: true,
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
    const blocks = convertToRaw(this.state.editorState.getCurrentContent())
      .blocks;

    const checkIfcontainsJustSpaces =
      blocks
        .map((block) => (!block.text.trim() && "\n" && "") || block.text)
        .join("\n") === "";

    this.setState({
      editorState,
      editorTextContent: checkIfcontainsJustSpaces,
    });
  };

  onSubmit = () => {
    const { editorState } = this.state;
    const post =
      editorState &&
      editorState.getCurrentContent() &&
      draftToHtml(convertToRaw(editorState.getCurrentContent()));

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
    const { editorState, preview, editorTextContent } = this.state;
    // console.log(editorTextContent, "editorTextContent");
    // console.log(editorState,'editorState')
    // console.log(this.props.firebase, 'FirebeAads')
    // this.props.firebase.posts().on("value", (snapshot) => {
    //   const postsObject = snapshot.val();

    //   console.log(postsObject, 'postsObj')
    // });

    // console.log(this.state.templateNumber, "this.state.quantity");

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

        <div className="answers-container">
          <AnswerTemplate
            quantity={this.state.quantity}
            onUpdateQuantity={this.updateQuantity}
          />
        </div>
        <Button
          disabled={editorTextContent ? true : false}
          onClick={this.onPreview}
        >
          {preview ? "Close Preview" : "Open Preview"}
        </Button>
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
