import { API_REQUEST, GET_ALL_POSTS } from "../constants/actionTypes";

export const fetchPosts = () => ({
  type: API_REQUEST,
  payload: Object.assign({
    url: "",
    next: GET_ALL_POSTS,
  }),
});
