import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { posts } from "./posts";
import { newPostReducer } from "./newpost";
import sessionReducer from "./session";
import userReducer from "./users";
import userActivityReducer from "./userActivity";
import storage from "redux-persist/lib/storage";

const confi = {
  key: "root",
  storage: storage,
  blacklist: ["post"],
};

const rootPersistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["userReducer", "sessionReducer"],
};

const rootReducer = combineReducers({
  posts,
  sessionState: sessionReducer,
  userState: userReducer,
  newPostState: persistReducer(confi, newPostReducer),
  userActivity: userActivityReducer,
});
// root reducer
// const rootReducer = combineReducers({
//   db: dataReducer,
//   // newPostReducer: newPost,
// });

export default rootReducer;
