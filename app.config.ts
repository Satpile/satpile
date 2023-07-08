import { ExpoConfig, ConfigContext } from "expo/config";
import invariant from "invariant";
import dotenv from "dotenv";
dotenv.config();
export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, slug } = config;
  const appVersion = process.env.APP_VERSION;
  invariant(name, "No name found in app.json");
  invariant(slug, "No slug found in app.json");
  invariant(appVersion, "No app version found in env");
  const [version, buildNumber] = appVersion.split("+");
  return {
    ...config,
    name,
    slug,
    ios: {
      ...(config.ios || {}),
      buildNumber: buildNumber || "1",
    },
    version,
  };
};
