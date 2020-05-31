import React, { Component } from "react";
import { CHAPTERS_ICONS } from "../../../../constants/shared";
import { Label, Menu, Transition, Icon } from "semantic-ui-react";
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
    // remove content and conclustion
    // let filteredLessonItems = lessonItems.filter(
    //   (item) => item !== "content" && item !== "conclusion"
    // );
    // // push conclusion in the end
    // filteredLessonItems.push("conclusion");

    this.setState({
      filteredLessonItems: filteredLessonItems,
    });
  }

  render() {
    const { isMenuOpen, filteredLessonItems } = this.state;
    const { currentChapter } = this.props;
    const hamburgerClass = isMenuOpen ? "open" : "";
    const menuClass = isMenuOpen ? "open-menu" : "close-menu";
    // console.log(this.props.currentChapter,'Propds')

    return (
      <div>
        {/* <div className={`body-${menuClass}`} /> */}
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
          {/* <div className={menuClass}> */}
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
                    {/* <Icon  name={CHAPTERS_ICONS[item]} /> */}
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
