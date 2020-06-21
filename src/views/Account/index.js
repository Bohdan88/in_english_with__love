import React, { Component } from "react";
import { Grid, Menu } from "semantic-ui-react";
import { EditAccount, HomePage, Help } from "./Components";
import { withAuthorization } from "../Session";

// import { PasswordForgetForm } from "../PasswordForget";
// import PasswordChangeForm from "../PasswordChange";
// import { withAuthorization } from "../Session";
import { SIGN_IN_METHODS } from "../../constants/shared";
import { withFirebase } from "../Firebase";
import { connect } from "react-redux";
import { compose } from "recompose";

// style
import "./style.scss";

class AccountPage extends Component {
  state = {
    activeItem: "Home",
    menuItems: [
      { name: "Home", component: HomePage },
      { name: "Edit", component: EditAccount },
      // { name: "Help", component: Help },
    ],
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, menuItems } = this.state;

    const activeComponent = menuItems.findIndex(
      (obj) => obj.name === activeItem
    );

    const ComponentName = menuItems[activeComponent].component;
    return (
      <Grid>
        <Grid.Row className="account-row">
          <Grid.Column width={4}>
            <Menu fluid pointing vertical>
              {menuItems.map((item) => {
                return (
                  <Menu.Item
                    key={item.name}
                    name={item.name}
                    active={activeItem === item.name}
                    onClick={this.handleItemClick}
                  />
                );
              })}
            </Menu>
          </Grid.Column>
          <Grid.Column width={12}>
            <ComponentName {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

// check if auth user exists
const condition = (authUser) => !!authUser;

// export default withAuthorization(condition)(AccountPage);
export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(AccountPage);
