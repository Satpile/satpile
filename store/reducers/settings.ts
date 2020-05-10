import {defaultSettings} from "../../utils/Settings";


const settings = (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            //When we load the data from memory we want to merge the saved settings with the default settings
            return {...defaultSettings(), ...action.state.settings};

        case 'UPDATE_SETTINGS':
            //When we update some settings, we want to merge the existing settings with the new settings and the default
            return {...defaultSettings(), ...state, ...action.settings};

        case 'CLEAR':
            //When we reset the settings we just return a copy of the default settings
            return {...defaultSettings()};
    }

    return state;
};

export default settings;
