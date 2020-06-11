import React, { Component } from "react";
import { CREATE_LESSON_STAGES } from "../../../../constants/shared";
import { Label, Menu, Transition } from "semantic-ui-react";
import "./style.scss";

class SideBarMenu extends Component {
  state = {
    isMenuOpen: false,
    filteredLessonItems: [],
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
    this.props.checkMenu(!this.state.isMenuOpen);
  };

  onMenuItemClick = (data) => {
    this.props.setCurrentChapter(data.name);
  };

  componentDidMount() {
    const { filteredLessonItems } = this.props;

    this.setState({
      filteredLessonItems: filteredLessonItems,
    });
  }

  render() {
    const { isMenuOpen, filteredLessonItems } = this.state;
    const { currentChapter, mode } = this.props;
    const hamburgerClass = isMenuOpen ? "open" : "";
    const menuClass = isMenuOpen
      ? mode === CREATE_LESSON_STAGES.preview
        ? "open-menu-admin"
        : "open-menu"
      : mode === CREATE_LESSON_STAGES.preview
      ? "close-menu-admin"
      : "close-menu";

    return (
      <div>
        <div className="burger-menu">
          <div
            className="menu-icon-wrapper float-left"
            onClick={() => this.toggleMenu()}
          >
            <div id="hamburger" className={hamburgerClass}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <Transition
            visible={isMenuOpen ? true : false}
            animation="slide right"
            duration={100}
            unmountOnHide={false}
          >
            <Menu size="large" secondary vertical className={menuClass}>
              {filteredLessonItems.map((item, key) => {
                return (
                  <Menu.Item
                    key={item}
                    name={item}
                    className="lesson-view-menu-item"
                    active={currentChapter === item}
                    header
                    link
                    onClick={(e, data) => this.onMenuItemClick(data)}
                  >
                    <Label className="lesson-view-label-name" color="teal">
                      {key + 1}
                    </Label>
                    {/* <Icon name={CHAPTERS_ICONS[item]} /> */}
                    <p className="capitalize">{item} </p>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Transition>
        </div>
        {/* </div> */}
      </div>
    );
  }
}

export default SideBarMenu;
