import { STATUS } from "./status";
import { createAction, handleActions } from "redux-actions";

const ENTITY = "SERVICES";

export const setDefault = createAction(`${ENTITY}/reset`);
export const setFetching = createAction(`${ENTITY}/set_fetching`);
export const setFetched = createAction(`${ENTITY}/set_fetched`);
export const setFetchedError = createAction(`${ENTITY}/set_fetched_error`);

const initialState = {
  _status: STATUS.IDLE,
  payload: {},
  error: false
};

export const reducer = handleActions(
  {
    [setDefault]: (state, { payload }) => ({
      ...initialState
    }),
    [setFetching]: (state, { payload }) => ({
      ...state,
      _status: STATUS.FETCHING
    }),
    [setFetched]: (state, { payload }) => {
      console.log(' setFetched: ', payload);
      return {
        ...state,
        _status: STATUS.FETCHED,
        payload
      }
    },
    [setFetchedError]: (state, { payload }) => {
      console.log('setFetchedError: ', payload);
      return {
        ...state,
        _status: STATUS.ERROR,
        error: payload
      }
    }
  },
  initialState
);
/*
export default function(state = [], action) {
    switch (action.type) {
      case FETCHING_SERVICES:
          return {
            ...state,
            loading: true
          }
        case FETCH_SERVICES:
            return {
              ...state,
              payload: action.payload.data,
              loading: false
            }
    }
    return state;
}*/
