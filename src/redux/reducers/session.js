/* manages the authUser object */

import { AUTH_USER_SET, SET_NEW_VALUES } from "../constants/actionTypes";

const INITIAL_STATE = {
  authUser: null,
  lessonsCompleted: null,
};

const applySetAuthUser = (state, action) => ({
  ...state,
  authUser: action.authUser,
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER_SET: {
      return applySetAuthUser(state, action);
    }
    case SET_NEW_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default sessionReducer;
