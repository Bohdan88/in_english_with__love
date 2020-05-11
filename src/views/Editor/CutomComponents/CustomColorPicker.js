import React, { Component } from "react";
import { CompactPicker } from "react-color";
import FontAwesome from "react-fontawesome";

class CustomColorPicker extends Component {
  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    // onChange("color", color.hex);
  };

  renderModal = () => {
    const { color } = this.props.currentState;
    return (
      <div className="container-compact-picker" onClick={this.stopPropagation}>
        <CompactPicker color={color} onChangeComplete={this.onChange} />
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
        <div className="rdw-option-wrapper" onClick={onExpandEvent}>
          <FontAwesome className="fas fa-eye-dropper" name="eyedropper" />
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}

export default CustomColorPicker;
