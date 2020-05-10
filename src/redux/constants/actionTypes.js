const asyncActionType = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

/* API */
export const API_REQUEST = "API_REQUEST";

/* API requests  */
export const GET_ALL_POSTS = asyncActionType("GET_ALL_POSTS");