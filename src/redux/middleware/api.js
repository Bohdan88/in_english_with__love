// import instance from "../../lib/utils/axios-interceptor";
import axios from "axios";
import { API_REQUEST } from "../constants/actionTypes";

let CancelToken = axios.CancelToken;
let source = CancelToken.source();
let instance = axios.create();
const apiMiddleWare = ({ dispatch }) => (next) => (action) => {
  const handleResponse = (response) => {
    const { next, url, ...rest } = action.payload;

    dispatch({
      type: action.payload.next.SUCCESS,
      payload: { ...rest, ...response.data },
    });
  };

  if (action.type === API_REQUEST) {
    source = CancelToken.source();
    instance
      .get(action.payload.url, { cancelToken: source.token })
      .then(handleResponse)
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.warn("Request canceled", error.message);
        } else {
          dispatch({ type: action.payload.next.ERROR, error });
        }
      });
    dispatch({ type: action.payload.next.PENDING });
  }
};

export default apiMiddleWare;
