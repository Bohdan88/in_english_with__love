// 
export const PASSWORD_SPECIAL_CHARACTERS = [
  "!",
  "#",
  "$",
  "%",
  "@",
  "^",
  "&",
  "*",
];

export const CATEGORY_ID = "-category-";
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
  // {
  //   id: "password",
  //   icon: "lock",
  //   provider: null,
  // },
  {
    name: "Google",
    id: "google.com",
    icon: "google",
    provider: "googleProvider",
  },
  {
    name: "Facebook",
    id: "facebook.com",
    icon: "facebook f",
    provider: "facebookProvider",
  },
];

// admin page
export const MATCHING = "Matching";
export const COMPLETE_THE_SENTENCES = "Complete the Sentences";
export const ANOTHER_WAY_TO_SAY = "Another way to say";
export const ANOTHER_WAY = "Another way";
export const REPLACED_ANSWER = " ______________ ";
export const ADMIN_TABS = {
  create_lesson: { key: "lesson ", content: "Create a lesson", icon: "add" },
  all_lessons: { key: "all_lessons ", content: "All lessons", icon: "list" },
  users: { key: "users ", content: "Users", icon: "users" },
  reset: { key: "reset ", content: "Reset", icon: "redo" },
};

export const CREATE_LESSON_STAGES = {
  about: { key: "About the video", content: "About the Video", icon: "info" },
  before: { key: "Before Watching", content: "Before Watching", icon: "eye" },
  practise: { key: "Exercises", content: "Exercises", icon: "legal" }, //lab
  content: { key: "Content", content: "Content", icon: "picture" },
  after: { key: "After Watching", content: "After Watching", icon: "law" },
  preview: { key: "Preview", content: "Preview", icon: "zoom" },
};

export const CATEGORIES = [
  { key: "Read", text: "Read", value: "Read" },
  { key: "Listen", text: "Listen", value: "Listen" },
];

export const EXERCISES_TYPES = [
  { key: "vocabulary", text: "Vocabulary", value: "Vocabulary" },
  {
    key: "vocabulary_practise",
    text: "Vocabulary Practise",
    value: "Vocabulary Practise",
  },
  { key: "from_the_video", text: "From the video", value: "From the video" },
  {
    key: "another_way_to_say",
    text: "Another way to say",
    value: "Another way to say",
  },
];

export const EXERCISES_NAMES = [
  { key: "matching", text: MATCHING, value: MATCHING },
  {
    key: "complete",
    text: COMPLETE_THE_SENTENCES,
    value: COMPLETE_THE_SENTENCES,
  },
  {
    key: "another_way",
    text: "Another way",
    value: "Another way",
  },
];

export const MATH_KEYS = {
  id: "id",
  letter: "letter",
  contentId: "contentId",
  contentLetter: "contentLetter",
};

export const COMPLETE_KEYS = {
  id: "id",
  sentence: "sentence",
  answer: "answer",
};

const MATCH_THE_WORDS_DESC = {
  key: "match_the_words",
  value:
    "Match the words on the left to their synonyms or meanings on the right.",
};

const MATCH_THE_SENTENCES_DESC = {
  key: "match_the_sentences",
  value: "Match the following sentences to their meanings below.",
};

const COMPLETE_THE_SENTENCES_DESC = {
  key: "complete_the_sentences",
  value: "Complete the sentences with one of the words below.",
};

const ANOTHER_WAY_TO_SAY_DESC = {
  key: "another_way_to_say",
  value:
    "Insert the new words you learned today in the correct form (talk – talking or talked).",
};
export const EXERCISES_DESCRIPTIONS = [
  {
    key: MATCH_THE_WORDS_DESC.key,
    text: MATCH_THE_WORDS_DESC.value,
    value: MATCH_THE_WORDS_DESC.value,
  },
  {
    key: MATCH_THE_SENTENCES_DESC.key,
    text: MATCH_THE_SENTENCES_DESC.value,
    value: MATCH_THE_SENTENCES_DESC.value,
  },
  {
    key: COMPLETE_THE_SENTENCES_DESC.key,
    text: COMPLETE_THE_SENTENCES_DESC.value,
    value: COMPLETE_THE_SENTENCES_DESC.value,
  },
  {
    key: ANOTHER_WAY_TO_SAY_DESC.key,
    text: ANOTHER_WAY_TO_SAY_DESC.value,
    value: ANOTHER_WAY_TO_SAY_DESC.value,
  },
];

export const INIT_NEW_POST_VALUES = {
  category: CATEGORIES[0].text,
  subCategory: "",
  focus: "",
  post: {
    [CREATE_LESSON_STAGES.about.key]: "",
    [CREATE_LESSON_STAGES.before.key]: "",
    [CREATE_LESSON_STAGES.content.key]: "",
    [CREATE_LESSON_STAGES.after.key]: "",
    // [CREATE_LESSON_STAGES.practise.key]: "",
  },
  title: "",
  iconPath: "",
  assets: {
    [CREATE_LESSON_STAGES.about.key]: [],
    [CREATE_LESSON_STAGES.before.key]: [],
    [CREATE_LESSON_STAGES.content.key]: [],
    [CREATE_LESSON_STAGES.after.key]: [],
  },
  newPostExercisesValues: [
    // match init
    // {
    //   id: 0,
    //   name: EXERCISES_NAMES[0].text,
    //   type: EXERCISES_TYPES[0].text,
    //   description: EXERCISES_DESCRIPTIONS[0].text,
    //   content: [{ id: 0, letter: "", contentId: "", contentLetter: "" }],
    // },
    // complete init
    // {
    //   id: 0,
    //   name: EXERCISES_NAMES[1].text,
    //   type: EXERCISES_TYPES[1].text,
    //   description: EXERCISES_DESCRIPTIONS[1].text,
    //   content: [{ id: 0, sentence: "", answer: "" }],
    // },
  ],
};

export const ADMIN_DROPDOWN_TITLES = {
  category: {
    label: "Category",
    placeholder: "Select Category",
    defaultVal: "category",
    allValues: "categories",
  },
  subCategory: {
    label: "Subcategory",
    placeholder: "Select Subcategory",
    defaultVal: "subCategory",
    allValues: "subCategories",
  },
  focus: {
    label: "Focus",
    placeholder: "Focus",
    defaultVal: "focus",
    allValues: "focuses",
  },
  title: {
    label: "Title",
    placeholder: "Title",
    defaultVal: "title",
  },
};

export const PRACTISE_DROPDOWN_TITLES = {
  name: {
    label: "Name",
    placeholder: "Name",
    defaultVal: "name",
  },
  type: {
    label: "Type",
    placeholder: "Type",
    defaultVal: "type",
  },
  description: {
    label: "Description",
    placeholder: "Description",
    defaultVal: "description",
  },
};

export const NOT_FOUND_OPTION = [
  { text: "Not Found", value: "Not Found", key: "Not found" },
];

export const MATH_FIELDS = {
  letter: { label: "Letter", placeholder: "Letter" },
  id: { label: "Num.", placeholder: "number" },
  text: { label: "Content", placeholder: "Content" },
};

export const COMPLETE_FIELDS = {
  id: { label: "Num.", placeholder: "number" },
  sentence: { label: "Sentence", placeholder: "Sentence" },
  asnwer: { label: "Answer", placeholder: "Answer" },
};
export const INIT_FIELDS_CONTENT = {
  [MATCHING]: {
    id: 0,
    letter: "",
    contentId: "",
    contentLetter: "",
  },
  [COMPLETE_THE_SENTENCES]: {
    id: 0,
    sentence: "",
    answer: "",
  },
};

export const INIT_CHAR_VALUES = [{ key: "A", text: "A", value: "A" }];
// export const INIT_CHAR_VALUES = [];
export const CHAR_SEQUENCE = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// db values
export const POSTS_BUCKET_NAME = "posts";
export const TOPICS_BUCKET_NAME = "topics";
export const USERS_BUCKET_NAME = "users";
export const DEFAULT_TOPIC_IMAGE = "default";

// editor page
export const EDIT_CREATE_POST_TAB_INDEX = 1;
export const SLICED_UPLOADED_IMAGE_KEY = 27;
export const POST_MODE = {
  EDIT: "edit",
  CREATE: "create",
};

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

export const EXERCISES_LABELS_COLORS = [
  "blue",
  "teal",
  "green",
  "olive",
  "brown",
  "violet",
  "pink",
  "red",
  "orange",
];

//

export const CHAPTERS_ICONS = {
  about: "info",
  before: "paperclip",
};

export const CHAPTERS_SEQUENCE = {
  0: "about",
  1: "before",
  2: "exercises",
  3: "conlusion",
};

// category topics

export const CATEGORY_TOPICS = {
  listen: "allListenTopics",
  read: "allReadTopics",
};

// Complete Lesson

export const SUB_FIELD = "second";

// Lessons List

export const ONE_PAGE_LESSONS = 10;
