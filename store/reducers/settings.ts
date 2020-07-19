import {defaultSettings, Settings} from "../../utils/Settings";
import {Action} from "../actions/actions";


const settings = (state: Partial<Settings> = {}, action: Action): Settings => {

    const normalizedSettings = {...defaultSettings(), ...state};

    switch (action.type) {
        case 'LOAD_DATA':
            //When we load the data from memory we want to merge the saved settings with the default settings
            return {...defaultSettings(), ...action.state.settings};

        case 'UPDATE_SETTINGS':
            //When we update some settings, we want to merge the existing settings with the new settings and the default
            return {...normalizedSettings, ...action.settings};

        case 'CLEAR':
            //When we reset the settings we just return a copy of the default settings
            return {...defaultSettings()};
        case 'SORT_FOLDERS':
            return {...normalizedSettings, foldersOrder: action.foldersOrder}
        case 'SWAP_FOLDERS':
            return {...normalizedSettings, foldersOrder: "custom"}

        default: return normalizedSettings;
    }
};

export default settings;
