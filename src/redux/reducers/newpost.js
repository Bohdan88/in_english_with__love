import { SET_NEW_POST_VALUES } from "../constants/actionTypes";
import {
  CREATE_LESSON_STAGES,
  CATEGORIES,
  EXERCISES_TYPES,
  EXERCISES_DESCRIPTIONS,
  EXERCISES_NAMES,
} from "../../constants/shared";

const initState = {
  category: CATEGORIES[0].text,
  subCategory: "",
  focus: "",
  post: {
    [CREATE_LESSON_STAGES.before.key]: "",
    [CREATE_LESSON_STAGES.after.key]: "",
    [CREATE_LESSON_STAGES.content.key]: "",
    [CREATE_LESSON_STAGES.practise.key]: "",
  },
  title: "",
  iconPath: "",
  exerciseType: EXERCISES_TYPES[0].text,
  exerciseDescription: EXERCISES_DESCRIPTIONS[0].text,
  exerciseName: EXERCISES_NAMES[0].text,
  // exerciseContent: {},
  exerciseContent: {
    match: [{ id: 1, letter: "", contentId: "", contentLetter: "" }],
  },
  exercisesSequence: [],
  // match: [{ id: 0, letter: "", contentId: "", contentLetter: "" }],
  // },
};

export const newPostReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_NEW_POST_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
