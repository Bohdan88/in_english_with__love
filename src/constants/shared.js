export const LOGO_LINK =
  "https://firebasestorage.googleapis.com/v0/b/in-english-with-love.appspot.com/o/logo.png?alt=media&token=378c1c9e-0248-4f3f-bda3-105628619e8f";

export const GOOGLE_LINK =
  "https://firebasestorage.googleapis.com/v0/b/in-english-with-love.appspot.com/o/google.png?alt=media&token=96f2a909-0b68-44df-9398-5e14e962140e";

export const FACEBOOK_LINK =
  "https://firebasestorage.googleapis.com/v0/b/in-english-with-love.appspot.com/o/faceb.png?alt=media&token=54936a45-1669-4d78-b480-8622a51189e0";
// "https://firebasestorage.googleapis.com/v0/b/in-english-with-love.appspot.com/o/facebook.png?alt=media&token=9a01f538-8c5c-4920-b04e-7d4a60014fef";
//  error message

export const PASSWORD_FORGET_INIT = {
  email: "",
  error: null,
};
export const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  "repeat password": "",
  passwordTwo: "",
  isAdmin: false,
  error: null,
};
export const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

export const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. 
`;

export const ERROR_MESSAGES = {
  username: "The username must be 4 characters long or more.",
  confirmPassword: "The passwords don't much",
  accountExist:
    "An account with an E-Mail address tothis social account already exists. ",
};
export const SIGN_IN = "SIGN_IN";
export const SIGN_UP = "SIGN_UP";
export const SIGN_OUT = "SIGN OUT";

export const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null,
  },
  {
    id: "google.com",
    provider: "googleProvider",
  },
  {
    id: "facebook.com",
    provider: "facebookProvider",
  },
];

// admin page
export const ADMIN_TABS = {
  create_lesson: "CREATE A LESSON",
  all_lessons: "ALL LESSONS",
  users: "USERS",
};

export const CATEGORIES = [
  { key: "Read", text: "Read", value: "Read" },
  { key: "Listen", text: "Listen", value: "Listen" },
];

export const INIT_NEW_POST_VALUES = {
  category: "Read",
  subCategory: "",
  bias: "",
  post: "",
  title: "",
  iconPath: "",
};

export const ADMIN_DROPDOWN_TITLES = {
  category: {
    label: "Category",
    placeholder: "Select Category",
    defaultVal: "category",
  },
  subCategory: {
    label: "Subcategory",
    placeholder: "Select Subcategory",
    defaultVal: "subCategory",
  },
  bias: {
    label: "Bias",
    placeholder: "Select Bias",
    defaultVal: "bias",
  },
};

export const ICON_POST_REMOVE_STATUS = {
  icon: {
    success: "success",
    error: "error",
  },
  text: {
    success: "An Icon has been deleted!",
    error: "Something went wrong!",
  },
  title: {
    success: "Success!",
    error: "Oops...",
  },
};

export const ICON_POST_ADD_STATUS = {
  icon: {
    success: "success",
    error: "error",
  },
  text: {
    success: "An Icon has been uploded successfully!",
    error: "Something went wrong!",
  },
  title: {
    success: "Success!",
    error: "Oops...",
  },
};

export const POSTS_BUCKET_NAME = "posts";

// editor page
export const LESSON_STATUS = {
  icon: {
    success: "success",
    error: "error",
  },
  text: {
    success: "A lesson has been created!",
    error: "Something went wrong!",
  },
  title: {
    success: "Success!",
    error: "Oops...",
  },
};

export const EDITOR_OPTIONS = {
  fontFamily: [
    "Arial",
    "Lato",
    "Georgia",
    "Impact",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ],
};
