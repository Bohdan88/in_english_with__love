import {
  API_REQUEST,
  GET_ALL_POSTS,
  GET_ALL_CATEGORIES,
} from "../constants/actionTypes";

export const fetchPosts = () => ({
  type: API_REQUEST,
  payload: Object.assign({
    url: "",
    next: GET_ALL_POSTS,
  }),
});

export const getAllPostsValues = (firebase) => {
  // console.log(GET_ALL_CATEGORIES,'firebase')
  return {
    type: GET_ALL_CATEGORIES,
    payload: {
      firebase,
    },
  };
};
