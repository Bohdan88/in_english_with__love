import React, { Component } from "react";
import { AtomicBlockUtils } from "draft-js";
import { Icon, Popup } from "semantic-ui-react";

const transformEmbeddedLink = (link) => {
  if (link.includes("youtube")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/; // eslint-disable-line
    const youtubeMatch = link.match(regExp);
    return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
  }
  return link;
};

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      embeddedLink: "",
      width: "auto",
      height: "auto",
      view: false,
    };
  }

  toggleView = () => {
    this.setState({
      view: !this.state.vieew,
    });
  };

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
    const { embeddedLink, height, width } = this.state;

    return (
      <div className="rdw-embedded-wrapper">
        <Popup
          basic
          trigger={
            <div
              ref={(node) => (this.node = node)}
              onClick={this.toggleView}
              className="rdw-option-wrapper"
              title="Embedded"
            >
              <Icon
                className="video-player-icon"
                fitted
                inverted
                color="black"
                name="video"
              />
            </div>
          }
          className={"video-popup"}
          position={"bottom center"}
          on={"click"}
          content={
            <div>
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
                      /* value="auto" */
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
                  className="rdw-embedded-modal-btn video-add-button"
                  disabled=""
                  onClick={this.addToEditor}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="rdw-embedded-modal-btn video-cancel-button"
                  onClick={this.closeView}
                >
                  Cancel
                </button>
              </span>
            </div>
          }
        />
      </div>
    );
  }
}

export default VideoPlayer;
