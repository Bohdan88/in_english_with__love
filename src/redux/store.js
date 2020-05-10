import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/root";
import apiMiddleware from "./middleware/api";
import thunk from "redux-thunk";
import logger from "redux-logger";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middleware = [apiMiddleware, thunk];

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

window.store = store; // makes the sore available globally

const onStoreChange = () => {};

store.subscribe(onStoreChange);

export default store;
