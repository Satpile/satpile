import {combineReducers} from "redux";
import folders from './folders';
import addresses from "./addresses";
import settings from "./settings";

const lastReloadTime = (lastReloadTime = '', action) => {
    switch (action.type) {
        case 'UPDATE_LAST_RELOAD_TIME':
            return (new Date()).toString();
        case 'CLEAR':
            return '';
        case 'LOAD_DATA':
            return action.state.lastReloadTime;
    }

    return lastReloadTime;
}

export default combineReducers({
    folders,
    lastReloadTime,
    addresses,
    settings
})
