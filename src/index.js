import React from "react";
import ReactDOM from "react-dom";
import App from "./views/App";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./views/Firebase";

// style
import "./style/style.scss";
import "semantic-ui-css/semantic.min.css";
import "sweetalert2/src/sweetalert2.scss";
import "../node_modules/font-awesome/css/font-awesome.min.css";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    {/* <React.StrictMode> */}

    <App />
    {/* </React.StrictMode> */}
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
