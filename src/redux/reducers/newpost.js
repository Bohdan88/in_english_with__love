import { SET_NEW_POST_VALUES } from "../constants/actionTypes";
import { INIT_NEW_POST_VALUES } from "../../constants/shared";

const initState = INIT_NEW_POST_VALUES;

export const newPostReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_NEW_POST_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
