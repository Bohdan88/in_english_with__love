import { combineReducers } from "redux";
import { posts } from "./posts";
// root reducer
const rootReducer = combineReducers({
  postsReducer: posts,
});

export default rootReducer;
