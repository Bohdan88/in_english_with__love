import {
  API_REQUEST,
  GET_ALL_POSTS,
  GET_ALL_CATEGORIES,
  SET_NEW_POST_VALUES,
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

export const setNewPostValues = (values) => {
  return {
    type: SET_NEW_POST_VALUES,
    payload: {
      ...values,
    },
  };
};
