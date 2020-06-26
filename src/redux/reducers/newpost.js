import { SET_POST_VALUES } from "../constants/actionTypes";
import {
  CREATE_LESSON_STAGES,
  CATEGORIES,
  POST_MODE,
} from "../../constants";

const initState = {
  uid: "",
  postMode: POST_MODE.CREATE,
  category: CATEGORIES[0].text,
  subCategory: "",
  focus: "",
  post: {
    [CREATE_LESSON_STAGES.about.key]: "",
    [CREATE_LESSON_STAGES.before.key]: "",
    [CREATE_LESSON_STAGES.after.key]: "",
    [CREATE_LESSON_STAGES.content.key]: "",
    // [CREATE_LESSON_STAGES.practise.key]: "",
  },
  postLocalStorage: {
    [CREATE_LESSON_STAGES.about.key]: "",
    [CREATE_LESSON_STAGES.before.key]: "",
    [CREATE_LESSON_STAGES.after.key]: "",
    [CREATE_LESSON_STAGES.content.key]: "",
  },
  title: "",
  iconPath: "",
  assets: {
    [CREATE_LESSON_STAGES.about.key]: [],
    [CREATE_LESSON_STAGES.before.key]: [],
    [CREATE_LESSON_STAGES.after.key]: [],
    [CREATE_LESSON_STAGES.content.key]: [],
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

export const newPostReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_POST_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
