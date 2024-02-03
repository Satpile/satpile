const fs = require("fs");
const [en, fr, de, cs] = [
  require("../translations/locales/en.js"),
  require("../translations/locales/fr.js"),
  require("../translations/locales/de.js"),
  require("../translations/locales/cs.js"),
];

// check for missing translations, recursively by comparing the reference translations with the translations of a given language
// returns an array of missing translations paths
const missingTranslations = (reference, translations, path = []) => {
  const missing = [];
  for (const key in reference) {
    if (!translations || !translations[key]) {
      missing.push(path.concat(key).join("."));
    }

    if (Array.isArray(reference[key])) {
      continue;
    }

    if (typeof reference[key] === "object") {
      missing.push(
        ...missingTranslations(
          reference[key],
          (translations ?? {})[key],
          path.concat(key)
        )
      );
    }
  }
  return missing;
};
const referenceTranslations = en;

const missingEn = missingTranslations(referenceTranslations, en);
const missingFr = missingTranslations(referenceTranslations, fr);
const missingDe = missingTranslations(referenceTranslations, de);
const missingCs = missingTranslations(referenceTranslations, cs);

Object.entries({ missingEn, missingFr, missingDe, missingCs }).forEach(
  ([name, missing]) => {
    console.log(name, missing);
  }
);

fs.writeFileSync(
  "tmp/missingTranslations.json",
  JSON.stringify({ missingEn, missingFr, missingDe, missingCs }, null, 2)
);
