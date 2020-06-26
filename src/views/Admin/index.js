import React, { Component } from "react";
// import { connect } from "react-redux";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import { CreateLesson } from "./Components";
import "firebase/storage";
import {
  ADMIN_TABS,
  EDIT_CREATE_POST_TAB_INDEX,
  POST_MODE,
  INIT_NEW_POST_VALUES,
} from "../../constants";
import {
  CONFIRMATION_ALERT,
  CONFIRMATION_REMOVE_CONTENT,
} from "../../constants/alertContent";
import { Tab, Grid, Button, Icon } from "semantic-ui-react";
import LessonsList from "./Components/LessonsList";
import { fireAlert } from "../../utils";
// import { setPostValues } from "../../redux/actions";

// style
import "./style.scss";

class AdminPage extends Component {
  state = {
    activeTabIndex: 0,
  };

  onTabChange = (data) => {
    this.setState({
      activeTabIndex: data.activeIndex,
    });
  };

  setEditPostTabIndex = () =>
    this.setState({
      activeTabIndex: EDIT_CREATE_POST_TAB_INDEX,
      postMode: POST_MODE.EDIT,
    });

  setNewPostToInit = () => {
    fireAlert({
      state: true,
      type: CONFIRMATION_ALERT,
      values: CONFIRMATION_REMOVE_CONTENT,
    }).then((val) => {
      !val.dismiss && this.props.onSetPostNewValues(INIT_NEW_POST_VALUES);
    });
  };

  render() {
    const { activeTabIndex, postMode } = this.state;

    const panes = [
      {
        menuItem: ADMIN_TABS.create_lesson,
        render: () => (
          <Tab.Pane>
            <CreateLesson postMode={postMode} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: ADMIN_TABS.all_lessons,
        render: () => (
          <Tab.Pane>
            <LessonsList setEditPostTabIndex={this.setEditPostTabIndex} />
          </Tab.Pane>
        ),
      },

      // {
      //   menuItem: ADMIN_TABS.users,
      //   render: () => <Tab.Pane>Users</Tab.Pane>,
      // },
    ];

    return (
      <Grid className="grid-admin">
        <Grid.Row>
          <Grid.Column className="column-admin">
            <Button
              style={{ display: activeTabIndex === 0 ? "" : "none" }}
              onClick={() => this.setNewPostToInit()}
              className="admin-reset-progress"
            >
              <Icon name="redo" />
              Reset
            </Button>
            <Tab
              activeIndex={activeTabIndex}
              onTabChange={(e, data) => this.onTabChange(data)}
              panes={panes}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

// const removePostFromDb = (post, firebase) => {
//   firebase.db.ref(`posts/${post.uid}`).remove();
// };

// const editPostFromDb = (post, firebase) => {
//   // firebase.db.ref(`posts/${post.uid}`).remove()
//   // console.log(firebase.db.ref(`posts/${post.uid}`))
//   firebase.db.ref(`posts/${post.uid}`).update({
//     post: "UPDATED",
//   });
// };

// const mapStateToProps = (state) => ({
//   posts: state.posts,
//   users: Object.keys(state.userState.users || {}).map((key) => ({
//     ...state.userState.users[key],
//     uid: key,
//   })),
// });

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onSetUsers: (users) => dispatch({ type: "USERS_SET", users }),
//     onSetPostNewValues: (values) => dispatch(setPostValues(values)),
//   };
// };

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase
  // connect(mapStateToProps, mapDispatchToProps)
)(AdminPage);
