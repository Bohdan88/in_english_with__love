/* deals with the list of users from the Firebase realtime database. */

import { SET_USER_ACTIVITY_VALUES } from "../constants/actionTypes";

const INITIAL_STATE = {
  user: "",
  activity: { date: new Date().getTime(), lessons: [] },
  progress: {},
};

export const userActivityReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_ACTIVITY_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default userActivityReducer;
