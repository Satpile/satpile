import { combineReducers } from "redux";
import folders from "./folders";
import addresses from "./addresses";
import settings from "./settings";
import { Action } from "../actions/actions";

const lastReloadTime = (lastReloadTime = "", action: Action) => {
  switch (action.type) {
    case "UPDATE_LAST_RELOAD_TIME":
      return new Date().toString();
    case "CLEAR":
      return "";
    case "LOAD_DATA":
      return action.state.lastReloadTime;
  }

  return lastReloadTime;
};

const loadingReducer = (loading = false, action: Action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return false;
    case "UPDATE_REFRESH_STATUS":
      return action.status;
  }

  return loading;
};

export default combineReducers({
  folders,
  lastReloadTime,
  loading: loadingReducer,
  addresses,
  settings,
});
