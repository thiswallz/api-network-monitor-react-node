import {
  setFetching,
  setFetched,
  setFetchedError,
  setDefault
} from "./reducer_services";
import axios from "axios";

const ROOT_URL = 'http://localhost:3000/services';

export function consultServices(env, order="asc", sort="name") {
  return (dispatch, getState) => {
    dispatch(setFetching());
    return axios.get(`${ROOT_URL}?env=${env}`)
    .then(res => {
      dispatch(setFetched(res.data));
    })
    .catch(err => {
      dispatch(setFetchedError(err));
    });
  }
}