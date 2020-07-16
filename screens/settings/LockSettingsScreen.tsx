import {Headline, Text, useTheme} from "react-native-paper";
import {askPermission, durationToText, SecuritySetting, useSettings} from "../../utils/Settings";
import {SettingsData} from "@taccolaa/react-native-settings-screen";
import {i18n} from "../../translations/i18n";
import {Alert, LayoutAnimation, StyleSheet, Switch, View} from "react-native";
import {CustomSettingsScreen} from "../../components/CustomSettingsScreen";
import * as React from "react";
import {Ionicons} from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import {useEffect, useRef, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import PromptModal from "../../components/PromptModal";
import {hashPassword} from "../../utils/Passphrase";

const scaleTransition = () => {
    LayoutAnimation.configureNext({
        duration: 200,
        create: {
            property: LayoutAnimation.Properties.scaleXY
        },
        delete: {
            property: LayoutAnimation.Properties.scaleXY
        }
    });
}

export function LockSettingsScreen(){

    const theme = useTheme();
    const [settings, updateSettings] = useSettings();
    const [capabilities, setCapabilities] = useState<LocalAuthentication.AuthenticationType[]>([])
    const [showModal, setShowModal] = useState(false);
    const [settingUpPassphrase, setSettingUpPassphrase] = useState(false);

    useEffect(() => {
        (async () => {
            const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
            setCapabilities(supported);
        })();
    }, [settings.security.enableBiometrics])


    const setPassphrase = async (hash) => {
        scaleTransition();
        closeModal();
        updateSettings({
            security: {
                passphrase: hash,
                enableBiometrics: false
            }
        })
    }

    const closeModal = () => {
        setSettingUpPassphrase(false);
        setShowModal(false);
    }

    let settingsData: SettingsData = [
        {
          type: "CUSTOM_VIEW",
            render: () => <View style={{paddingTop: 5, paddingHorizontal: 24}}>
                <Text style={styles.simpleText}>
                    {i18n.t("settings.security.warning")}
                </Text>
            </View>
        },
        {
            type: "SECTION",
            rows: [
                {
                    title: i18n.t('settings.enable_lock'),
                    renderAccessory: () => <Switch value={!!settings.security.passphrase || settingUpPassphrase} onValueChange={(value) => {
                        scaleTransition();
                        if(value){
                            setShowModal(true);
                            setSettingUpPassphrase(true);
                        }else{
                            updateSettings({
                                security: {
                                    passphrase: null,
                                    enableBiometrics: false
                                }
                            });
                        }
                    }}/>,
                },
                {
                    visible: !!settings.security.passphrase,
                    title: i18n.t('settings.lock_type.biometric'),
                    renderAccessory: () => <Switch value={!!settings.security.enableBiometrics} onValueChange={(value) => {
                        updateSettings({
                            security: {
                                enableBiometrics: value,
                                passphrase: settings.security.passphrase
                            }
                        });
                    }}/>,
                }
            ]
        },
    ];

    return <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <SetPasswordModal onCancel={closeModal} onClose={closeModal} onValidate={setPassphrase} visible={showModal} />
        <CustomSettingsScreen settings={settingsData}/>
    </View>;
}

const SetPasswordModal = ({onCancel, onClose, visible, onValidate}) => {

    const [settings] = useSettings();
    const [step, setStep] = useState<"password"|"confirm">("password");
    const [tmpPassword, setTmpPassword] = useState<string|undefined>(undefined);
    const hash = useRef<null | string>(null);
    useEffect(() => {
        if(!visible){
            setStep("password");
            setTmpPassword(undefined);
            hash.current = undefined;
        }
    }, [visible]);

    const setFirst = (input?: string) => {
        if(input && input.length){
            setTmpPassword(input);
            setStep("confirm");
            hashPassword(input).then(newHash => {
                hash.current = newHash;
            });
        }
    }

    const goBackToFirst = () => {
        setTmpPassword(undefined);
        setStep("password");
        hash.current = null;
    }

    return (
        <>
            <PromptModal
                key={"password"}
                title={"Passphrase"}
                description={"Create the passphrase you will use to access Satpile."}
                visible={visible && step === "password"}
                inputPlaceholder={"Passphrase"}
                submitLabel={"OK"}
                onValidate={setFirst}
                onClose={() => {}}
                onCancel={onCancel}
                textInputProps={{
                    secureTextEntry: true,
                    keyboardAppearance: settings.darkMode ? "dark" : "light"
                }}
            />
            <PromptModal
                key={"confirm"}
                title={"Passphrase"}
                description={"Re-type passphrase"}
                visible={visible && step === "confirm"}
                inputPlaceholder={"Passphrase"}
                submitLabel={"OK"}
                onValidate={input => {
                    if(input === tmpPassword){
                        onValidate(hash.current);
                    }else{
                        Alert.alert("Passphrases do not match");
                        onCancel();
                    }
                }}
                onClose={onClose}
                onCancel={goBackToFirst}
                textInputProps={{
                    secureTextEntry: true,
                    keyboardAppearance: settings.darkMode ? "dark" : "light"
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    simpleText: {
        fontSize: 16,
        textAlign: 'justify',
        marginVertical: 16,
        letterSpacing: -0.5
    },
})
