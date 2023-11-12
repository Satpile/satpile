import { ConfigContext, ExpoConfig } from "expo/config";
import invariant from "invariant";
import dotenv from "dotenv";

dotenv.config();
const IS_DEV = process.env.APP_VARIANT === "development";
export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, slug } = config;
  const appVersion = process.env.APP_VERSION || "dev+1";
  invariant(name, "No name found in app.json");
  invariant(slug, "No slug found in app.json");
  invariant(appVersion, "No app version found in env");
  const [version, buildNumber] = appVersion.split("+");

  return {
    ...config,
    name: IS_DEV ? `${name} DEV` : name,
    slug,
    ios: {
      ...(config.ios || {}),
      buildNumber: buildNumber || "1",
      bundleIdentifier: (IS_DEV ? "dev." : "") + config.ios?.bundleIdentifier,
    },
    version,
  };
};
