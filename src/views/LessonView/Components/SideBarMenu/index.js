import React, { Component } from "react";
import { List } from "semantic-ui-react";
import "./style.scss";

class SideBarMenu extends Component {
  state = {
    isMenuOpen: false,
    theoryMergedWithExercises: [],
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
    this.props.checkMenu(!this.state.isMenuOpen);
  };

  componentDidMount() {
    const { lessonItems, exercises } = this.props;
    let theoryMergedWithExercises = lessonItems;

    // insert exercises before the last element, because the last element is after exercise chapter
    exercises.forEach((exercise) => {
      theoryMergedWithExercises.splice(-1, 0, exercise.type);
    });
    this.setState({ theoryMergedWithExercises });
  }
  render() {
    const { isMenuOpen, theoryMergedWithExercises } = this.state;
    const hamburgerClass = isMenuOpen ? "open" : "";
    const menuClass = isMenuOpen ? "open-menu" : "close-menu";

    if (isMenuOpen) {
      //    this.props.checkMenu()
      //     console.log(document.getElementById("root").style.background,'document.getElementById("root").')
      //   document.getElementById("root").style.background = "red";
    }
    return (
      <div>
        {/* <div className={`body-${menuClass}`} /> */}
        <div className="burger-menu">
          <div
            className="menu-icon-wrapper float-left"
            onClick={() => this.toggleMenu()}
          >
            <div
              id="hamburger"
              className={hamburgerClass}
              /* {hamburgerClass} */
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className={menuClass}>
            {theoryMergedWithExercises.map((item, key) => {
              console.log(item, "item");
              return (
                item !== "content" && (
                  <List.Item
                    name={"error"}
                    key={key}
                    as="a"
                    /* href={item.path} */
                    className="mobile-sidebar-menu"
                  >
                    <List.Content> {item} </List.Content>
                    {/* <List.Icon name={item.icon} /> */}
                    {/* <List.Content>{item.name[flag ? 0 : 1]}</List.Content> */}
                  </List.Item>
                )
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SideBarMenu;
