// const config = {
//     apiKey: 'AIzaSyCkPMTAxdyCzMWQs_zak-HyAIvczNF1Uyc',
//     authDomain: "in-english-with-love.firebaseapp.com",
//     databaseURL: "https://in-english-with-love.firebaseio.com",
//     projectId: "in-english-with-love",
//     storageBucket: "",
//     messagingSenderId: "37578537655",
//   };

//   const firebaseConfig = {

//     // projectId: "in-english-with-love",
//     // storageBucket: "in-english-with-love.appspot.com",
//     // messagingSenderId: "37578537655",
//     // appId: "1:37578537655:web:6e64e4c58a5fe0e78d2b32",
//     // measurementId: "G-TNREYPX14B"
//   };

import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

/*  The process. env global variable is injected by the Node
    at runtime for your application to use and it represents
    the state of the system environment your application  is 
    in when it starts.
*/

const config = {
  apiKey: "AIzaSyCkPMTAxdyCzMWQs_zak-HyAIvczNF1Uyc",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    // console.log(app,'app')
    this.auth = app.auth();
    //
    this.db = app.database();
    // console.log(this.db,'thisdb')
    this.storage = app.storage();

    // console.log(app,'app.storage')
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
    this.emailAuthProvider = app.auth.EmailAuthProvider;
  }

  // get storage

  // getStorage = () =>

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  doProfileUpdate = (username) =>
    this.auth.currentUser.updateProfile({ username: username });

  // *** User API ***

  /* The paths in the ref() method match 
  the location where your entities (users)
  will be stored in Firebase's realtime database API. 
  */

  user = (uid) => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");

  post = (uid) => this.db.ref(`posts/${uid}`);
  posts = () => this.db.ref("posts");

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then((snapshot) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
              // dbUser = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });
}

export default Firebase;
