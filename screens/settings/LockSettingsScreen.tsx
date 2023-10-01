import { Text, useTheme } from "react-native-paper";
import { useLockState, useSettings } from "../../utils/Settings";
import { SettingsData } from "@taccolaa/react-native-settings-screen";
import { i18n } from "../../translations/i18n";
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { CustomSettingsScreen } from "../../components/CustomSettingsScreen";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import PromptModal from "../../components/PromptModal";
import { hashPassword } from "../../utils/Passphrase";
import LocalAuth, { AuthResult } from "../../utils/LocalAuth";
import { AuthenticationType } from "expo-local-authentication";

const scaleTransition = () => {
  if (Platform.OS === "ios") {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        property: LayoutAnimation.Properties.scaleXY,
      },
      delete: {
        property: LayoutAnimation.Properties.scaleXY,
      },
    });
  }
};

export function LockSettingsScreen() {
  const theme = useTheme();
  const [settings, updateSettings] = useSettings();
  const [showModal, setShowModal] = useState(false);
  const [settingUpPassphrase, setSettingUpPassphrase] = useState(false);
  const [settingUpBiometric, setSettingUpBiometric] = useState(false);
  const lockContext = useLockState();
  const [biometricType, setBiometricType] = useState<AuthenticationType | null>(
    null
  );
  useEffect(() => {
    (async () => {
      setBiometricType(await LocalAuth.getAvailableBiometric());
    })();
  }, []);

  const setPassphrase = async (hash: string) => {
    closeModal();
    updateSettings({
      security: {
        passphrase: hash,
        enableBiometrics: false,
      },
    });
  };

  const closeModal = () => {
    setSettingUpPassphrase(false);
    setShowModal(false);
  };

  let settingsData: SettingsData = [
    {
      type: "CUSTOM_VIEW",
      render: () => (
        <View style={{ paddingTop: 5, paddingHorizontal: 24 }}>
          <Text style={styles.simpleText}>
            {i18n.t("settings.security.warning")}
          </Text>
        </View>
      ),
    },
    {
      type: "SECTION",
      rows: [
        {
          title: i18n.t("settings.security.use_passphrase"),
          renderAccessory: () => (
            <Switch
              value={!!settings.security.passphrase || settingUpPassphrase}
              onValueChange={(value) => {
                if (value) {
                  setShowModal(true);
                  setSettingUpPassphrase(true);
                  setSettingUpBiometric(false);
                } else {
                  scaleTransition();
                  setSettingUpBiometric(false);
                  updateSettings({
                    security: {
                      passphrase: null,
                      enableBiometrics: false,
                    },
                  });
                }
              }}
            />
          ),
        },
        {
          visible: !!settings.security.passphrase && !!biometricType,
          title:
            biometricType === AuthenticationType.FACIAL_RECOGNITION
              ? i18n.t("settings.security.enable_faceid")
              : i18n.t("settings.security.enable_touchid"),
          renderAccessory: () => (
            <Switch
              value={settingUpBiometric || !!settings.security.enableBiometrics}
              onValueChange={(value) => {
                const passphrase = settings.security.passphrase;
                if (!passphrase) {
                  return;
                }
                if (value) {
                  lockContext.setBiometricUnlocking(true);
                  LocalAuth.promptLocalAuth()
                    .then((result) => {
                      updateSettings({
                        security: {
                          enableBiometrics: result === AuthResult.SUCCESS,
                          passphrase,
                        },
                      });
                    })
                    .finally(() => {
                      setTimeout(
                        () => lockContext.setBiometricUnlocking(false),
                        0
                      );
                    });
                } else {
                  updateSettings({
                    security: {
                      enableBiometrics: false,
                      passphrase: settings.security.passphrase,
                    },
                  });
                }
              }}
            />
          ),
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SetPasswordModal
        onCancel={closeModal}
        onClose={closeModal}
        onValidate={setPassphrase}
        visible={showModal}
      />
      <CustomSettingsScreen settings={settingsData} />
    </View>
  );
}

const SetPasswordModal = ({
  onCancel,
  onClose,
  visible,
  onValidate,
}: {
  onCancel: () => void;
  onClose: () => void;
  visible: boolean;
  onValidate: (hash: string) => void;
}) => {
  const [settings] = useSettings();
  const [step, setStep] = useState<"password" | "confirm">("password");
  const [tmpPassword, setTmpPassword] = useState<string | undefined>(undefined);
  const hash = useRef<null | string>(null);
  useEffect(() => {
    if (!visible) {
      setStep("password");
      setTmpPassword(undefined);
      hash.current = null;
    }
  }, [visible]);

  const setFirst = (input?: string) => {
    if (input && input.length) {
      setTmpPassword(input);
      setStep("confirm");
      hashPassword(input).then((newHash) => {
        hash.current = newHash;
      });
    }
  };

  return (
    <>
      <PromptModal
        key={"password"}
        title={"Passphrase"}
        description={i18n.t("settings.security.create_passphrase")}
        visible={visible && step === "password"}
        inputPlaceholder={i18n.t("settings.security.passphrase")}
        submitLabel={"OK"}
        onValidate={setFirst}
        onClose={() => {}}
        onCancel={() => {
          onClose();
          onCancel();
        }}
        textInputProps={{
          secureTextEntry: true,
          keyboardAppearance: settings.darkMode ? "dark" : "light",
        }}
      />
      <PromptModal
        key={"confirm"}
        title={"Passphrase"}
        description={i18n.t("settings.security.confirm_passphrase")}
        visible={visible && step === "confirm"}
        inputPlaceholder={"Passphrase"}
        submitLabel={"OK"}
        onValidate={(input) => {
          if (input === tmpPassword) {
            if (hash.current) {
              onValidate(hash.current);
            }
          } else {
            Alert.alert(i18n.t("settings.security.error_match"));
            onCancel();
          }
        }}
        onClose={onClose}
        onCancel={onCancel}
        textInputProps={{
          secureTextEntry: true,
          keyboardAppearance: settings.darkMode ? "dark" : "light",
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  simpleText: {
    fontSize: 16,
    textAlign: "justify",
    marginVertical: 16,
    letterSpacing: -0.5,
  },
});
