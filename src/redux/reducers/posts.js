import { GET_ALL_POSTS, GET_ALL_CATEGORIES } from "../constants/actionTypes";
import { CATEGORIES } from "../../constants/shared";
const initState = {
  loading: false,
  error: false,
  allPosts: [],
  categories: CATEGORIES,
  subCategories: [],
  biases: [],
};

export const posts = (state = initState, action) => {
  // console.log(action.payload && action.payload.firebase, "ACTION TYPE");
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      // console.log(action.payload.firebase);
      return {
        ...state,
        ...action.payload.firebase,
      };
    default:
      return state;
  }
};
