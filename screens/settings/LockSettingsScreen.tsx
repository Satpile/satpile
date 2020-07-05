import {Text, useTheme} from "react-native-paper";
import {askPermission, durationToText, SecuritySetting, useSettings} from "../../utils/Settings";
import {SettingsData} from "@taccolaa/react-native-settings-screen";
import {i18n} from "../../translations/i18n";
import {LayoutAnimation, Switch, View} from "react-native";
import {CustomSettingsScreen} from "../../components/CustomSettingsScreen";
import * as React from "react";
import {Ionicons} from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import {useEffect, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";

export function LockSettingsScreen(){

    const theme = useTheme();
    const [settings, updateSettings] = useSettings();
    const [capabilities, setCapabilities] = useState<LocalAuthentication.AuthenticationType[]>([])

    useEffect(() => {
        (async () => {
            const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
            setCapabilities(supported);
        })();
    }, [settings.security])

    let settingsData: SettingsData = [
        {
            type: "SECTION",
            header: i18n.t('settings.lock'),
            rows: [
                {
                    title: i18n.t('settings.enable_lock'),
                    renderAccessory: () => <Switch value={settings.security !== "none"} onValueChange={(value) => {
                        LayoutAnimation.configureNext({
                            duration: 200,
                            create: {
                                property: LayoutAnimation.Properties.scaleXY
                            },
                            delete: {
                                property: LayoutAnimation.Properties.scaleXY
                            }
                        });
                        updateSettings({security: value ? "biometric" : "none"})
                    }}/>,
                }
            ]
        },
        {
            visible: settings.security !== "none",
            type: 'SECTION',
            rows: ["biometric", "passphrase"].map((value: SecuritySetting) => {
                return {
                    visible: value !== "biometric" || capabilities.length > 0,
                    title: i18n.t(`settings.lock_type.${value}`),
                    showDisclosureIndicator: false,
                    renderAccessory: () => {
                        if (settings.security === value) {
                            return <Ionicons name={"md-checkmark"} color={'#f47c1c'} size={20}/>
                        }
                        return null;
                    },
                    onPress: async () => {
                        updateSettings({security: value})
                    }
                }
            })
        }
    ];

    return <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <CustomSettingsScreen settings={settingsData}/>
    </View>;
}
