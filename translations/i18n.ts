import i18n from "i18n-js";
import * as Localization from "expo-localization";

const fr = require("./locales/fr.js");
const en = require("./locales/en.js");
const de = require("./locales/de.js");
const cs = require("./locales/cs.js");

i18n.fallbacks = true;
i18n.translations = { fr, en, de, cs };

//Changes the set locale to the one in the settings when the settings are reloaded
/*Settings.addLoadListener(() => {
    i18n.locale = Settings.settings.locale;
})

i18n.locale = Settings.settings.locale;
*/

i18n.locale = Localization.locale;
const updateLocale = (locale: string) => {
  i18n.locale = locale;
};

export { i18n, updateLocale };
