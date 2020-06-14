import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { posts } from "./posts";
import { newPostReducer } from "./newpost";
import sessionReducer from "./session";
import userReducer from "./users";
import storage from "redux-persist/lib/storage";

const newPostStateConfig = {
  key: "root",
  storage: storage,
  blacklist: ["post"],
};

const rootReducer = combineReducers({
  posts,
  sessionState: sessionReducer,
  userState: userReducer,
  newPostState: persistReducer(newPostStateConfig, newPostReducer),
});

export default rootReducer;
