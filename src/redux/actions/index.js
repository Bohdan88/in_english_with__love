import {
  API_REQUEST,
  GET_ALL_POSTS,
  GET_ALL_CATEGORIES,
  SET_USER_ACTIVITY_VALUES,
  SET_POST_VALUES,
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

export const setSessionValues = (values) => {
  return {
    type: SET_USER_ACTIVITY_VALUES,
    payload: {
      ...values,
    },
  };
};

export const setPostValues = (values) => {
  return {
    type: SET_POST_VALUES,
    payload: {
      ...values,
    },
  };
};
