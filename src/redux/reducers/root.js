import { combineReducers } from "redux";
import { posts } from "./posts";
import { newPostReducer } from "./newpost";
import sessionReducer from "./session";
import userReducer from "./users";
import userActivityReducer from "./userActivity";
// import { newPost } from "./newpost";

const rootReducer = combineReducers({
  posts,
  sessionState: sessionReducer,
  userState: userReducer,
  newPostState: newPostReducer,
  userActivity: userActivityReducer,
});
// root reducer
// const rootReducer = combineReducers({
//   db: dataReducer,
//   // newPostReducer: newPost,
// });

export default rootReducer;
