const asyncActionType = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

/* API */
export const API_REQUEST = "API_REQUEST";

/* API requests  */
export const GET_ALL_POSTS = asyncActionType("GET_ALL_POSTS");

/* */

export const GET_ALL_CATEGORIES = "GET_ALL_CATEGORIES";
export const AUTH_USER_SET = "AUTH_USER_SET";
export const USERS_SET = "USERS_SET";
export const USER_SET = "USER_SET";
