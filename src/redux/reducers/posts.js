import { GET_ALL_POSTS } from "../constants/actionTypes";

const initState = {
  loading: false,
  error: false,
  posts: [],
};

export const posts = (state = initState, action) => {
  switch (action.type) {
    case GET_ALL_POSTS.PENDING:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_POSTS.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        posts: action.payload,
      };
    case GET_ALL_POSTS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};
