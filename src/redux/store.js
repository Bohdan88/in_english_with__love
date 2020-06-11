import { createStore, compose } from "redux";
import rootReducer from "./reducers/root";
// persist
import { persistStore } from "redux-persist";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers()
  // composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

window.store = store; // makes the store available globally

// export default store;
