import { combineReducers } from "redux";
import user from "./users";

const rootReducers = combineReducers({
  userState: user,
});

export default rootReducers;
