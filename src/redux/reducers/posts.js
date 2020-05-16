import { GET_ALL_CATEGORIES } from "../constants/actionTypes";
import {
  CATEGORIES,
  EXERCISES_TYPES,
  EXERCISES_DESCRIPTIONS,
  EXERCISES_NAMES,
} from "../../constants/shared";
const initState = {
  loading: false,
  error: false,
  allPosts: [],
  categories: CATEGORIES,
  subCategories: [],
  focuses: [],
  exercisesTypes: EXERCISES_TYPES,
  exercisesDescriptions: EXERCISES_DESCRIPTIONS,
  exerciseNames: EXERCISES_NAMES,
};

export const posts = (state = initState, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      // console.log(action.payload.firebase);
      return {
        ...state,
        ...action.payload.firebase,
      };
    default:
      return state;
  }
};
