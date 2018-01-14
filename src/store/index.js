import { combineReducers } from 'redux';
import { reducer as services } from "./reducer_services";

const rootReducer = combineReducers({
  services
});

export default rootReducer;
