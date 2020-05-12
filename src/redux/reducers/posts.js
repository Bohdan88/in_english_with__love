import { GET_ALL_POSTS, GET_ALL_CATEGORIES } from "../constants/actionTypes";

const initState = {
  loading: false,
  error: false,
  posts: [],
  categories: [],
  subCategories: [],
  bias: [],
};

export const posts = (state = initState, action) => {
  console.log(action, "ACTION TYPE");
  switch (action.type) {
    // case GET_ALL_CATEGORIES:
    //   console.log("YYEEEEEE");
    // case GET_ALL_POSTS.PENDING:
    //   return {
    //     ...state,
    //     loading: true,
    //   };
    // case GET_ALL_POSTS.SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: false,
    //     posts: action.payload,
    //   };
    // case GET_ALL_POSTS.ERROR:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.error,
    //   };

    default:
      return state;
  }
};
