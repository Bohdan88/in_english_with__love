import { createStore, compose } from "redux";
import rootReducer from "./reducers/root";
// persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// let middleware = [apiMiddleware, thunk];

// const persistConfig = {
//   key: "root",
//   storage: storage,
//   blackList: ["posts"],
//   stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
// };

// console.log(persistConfig, "persistConfig");

// const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  rootReducer,
  // pReducer,
  composeEnhancers()
  // composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

window.store = store; // makes the store available globally

// const onStoreChange = () => {};

// store.subscribe(onStoreChange);

// export default store;
