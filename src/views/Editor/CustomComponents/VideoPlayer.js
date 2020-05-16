import React, { Component } from "react";
import { AtomicBlockUtils } from "draft-js";

import { FiVideo } from "react-icons/fi";

const transformEmbeddedLink = (link) => {
  if (link.includes("youtube")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const youtubeMatch = link.match(regExp);
    return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
  }
  return link;
};

class VideoPlayer extends Component {
  state = {
    embeddedLink: "",
    width: "auto",
    height: "auto",
    view: false,
  };

  toggleView = () => {
    this.viewOpened = !this.state.view;
  };

  openedView = () => {
    this.setState({
      view: this.viewOpened,
    });
    this.viewOpened = false;
  };

  componentDidMount() {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.openedView);
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.openedView);
  }

  //   addEmbeddedLink = (embeddedLink, height, width) => {
  //     const {
  //       editorState,
  //       onChange,
  //       config: { embedCallback },
  //     } = this.props;
  //     const src = embedCallback ? embedCallback(embeddedLink) : embeddedLink;
  //     const entityKey = editorState
  //       .getCurrentContent()
  //       .createEntity("EMBEDDED_LINK", "MUTABLE", { src, height, width })
  //       .getLastCreatedEntityKey();

  //     const newEditorState = AtomicBlockUtils.insertAtomicBlock(
  //       editorState,
  //       entityKey,
  //       " "
  //     );
  //     onChange(newEditorState);
  //     this.doCollapse();
  //   };

  // convert html case
  // const blocksFromHTML = convertFromHTML(sampleMarkup);

  /* 
let sampleMarkup = <div> hi </div> 

convert html case 
    // const blocksFromHTML = convertFromHTML(sampleMarkup);
// const state = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    // );
    let state = EditorState.createWithContent(state);
*/

  addToEditor = () => {
    const { embeddedLink, width, height } = this.state;
    const { editorState, onChange } = this.props;
    const src = transformEmbeddedLink(embeddedLink);
    const entityKey = editorState
      .getCurrentContent()
      .createEntity("EMBEDDED_LINK", "MUTABLE", { src, height, width })
      .getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      " "
    );

    onChange(newEditorState);
    this.closeView();
  };

  onChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  doView = () => this.setState({ view: true });
  closeView = () => this.setState({ view: false });

  render() {
    const { view, embeddedLink, height, width } = this.state;

    return (
      <div className="rdw-embedded-wrapper">
        <div
          ref={(node) => (this.node = node)}
          onClick={this.toggleView}
          className="rdw-option-wrapper"
          title="Embedded"
        >
          <FiVideo />
        </div>
        <div
          style={{ display: `${view ? "flex" : "none"}  ` }}
          className="rdw-embedded-modal"
        >
          <div className="rdw-embedded-modal-header">
            <span className="rdw-embedded-modal-header-option">
              URL
              <span className="rdw-embedded-modal-header-label"></span>
            </span>
          </div>

          <div className="rdw-embedded-modal-link-section">
            <span className="rdw-embedded-modal-link-input-wrapper">
              <input
                className="rdw-embedded-modal-link-input"
                placeholder="Enter link"
                name="embeddedLink"
                value={embeddedLink}
                onChange={this.onChangeInput}
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </span>
            <div className="rdw-embedded-modal-size">
              <span>
                <input
                  name="height"
                  className="rdw-embedded-modal-size-input"
                  placeholder="Height"
                  value="auto"
                  value={height}
                  onChange={this.onChangeInput}
                />
                <span className="rdw-image-mandatory-sign">*</span>
              </span>
              <span>
                <input
                  name="width"
                  className="rdw-embedded-modal-size-input"
                  placeholder="Width"
                  value="auto"
                  value={width}
                  onChange={this.onChangeInput}
                />
                <span className="rdw-image-mandatory-sign">*</span>
              </span>
            </div>
          </div>

          <span className="rdw-embedded-modal-btn-section">
            <button
              type="button"
              className="rdw-embedded-modal-btn"
              disabled=""
              onClick={this.addToEditor}
            >
              Add
            </button>
            <button
              type="button"
              className="rdw-embedded-modal-btn"
              onClick={this.closeView}
            >
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
