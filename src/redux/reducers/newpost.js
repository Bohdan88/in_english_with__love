import {
  SET_NEW_POST_VALUES,
  GET_ALL_CATEGORIES,
} from "../constants/actionTypes";
import { CATEGORIES } from "../../constants/shared";

const initState = {
  category: CATEGORIES[0].text,
  subCategory: "",
  bias: "",
  post: "",
  isPostEmpty: true,
};

export const newPostReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_NEW_POST_VALUES:
      console.log(action.payload, "NEST POSTs");
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
