import { ExpoConfig, ConfigContext } from "expo/config";
import invariant from "invariant";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, slug } = config;
  invariant(name, "No name found in app.json");
  invariant(slug, "No slug found in app.json");
  const appVersion = process.env.APP_VERSION || "0.0.0-0";
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
