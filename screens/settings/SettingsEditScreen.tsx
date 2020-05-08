import {MainTitle} from "../../components/DynamicTitle";
import {i18n, updateLocale} from "../../translations/i18n";
import {Appbar, Headline} from "react-native-paper";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {durationToText, useSettings} from "../../utils/Settings";
import {SettingsData, SettingsScreen as SettingsScreenComponent} from "@taccolaa/react-native-settings-screen";
import {Ionicons} from "@expo/vector-icons";
import {Linking} from "expo";
import {TWITTER_URL} from "../../utils/Constants";
import {Legal} from "./Legal";

// This component uses a fork of react-native-settings-screen to easily display the settings items.
export default function SettingsEditScreen({navigation, route}) {

    const {setting} = route.params;
    const [settings, updateSettings] = useSettings();

    navigation.setOptions({
        headerTitle: () => <MainTitle title={i18n.t('settings.title')}/>,
        headerLeft: () => <Appbar.BackAction color={"white"} onPress={() => navigation.goBack()}/>,
    });

    let settingsData: SettingsData = [];

    switch (setting) {

        //Background refresh interval
        case 'refresh':
            let refreshValues = [
                {value: -1},
                {value: 60 * 1},
                {value: 60 * 5},
                {value: 60 * 15},
                {value: 60 * 30},
                {value: 60 * 45},
                {value: 60 * 60},
            ]

            settingsData = [
                {
                    type: 'SECTION',
                    header: i18n.t`settings.refresh_every`,
                    rows: refreshValues.map(value => {
                        return {
                            title: durationToText(value.value),
                            showDisclosureIndicator: false,
                            renderAccessory: () => {
                                if (settings.refresh === value.value) {
                                    return <Ionicons name={"md-checkmark"} color={'#f47c1c'} size={20}/>
                                }
                                return null;
                            },
                            onPress: () => updateSettings({refresh: value.value})
                        }
                    })
                }];
            break;

        //Language setting
        case 'locale':
            let languages = Object.keys(i18n.translations).map(locale => {
                let localeName = i18n.translations[locale]['current_language'];

                return {
                    title: localeName,
                    showDisclosureIndicator: false,
                    renderAccessory: () => {
                        if (settings.locale === locale || localeName === i18n.t`current_language`) {
                            return <Ionicons name={"md-checkmark"} color={'#f47c1c'} size={20}/>
                        }
                        return null;
                    },
                    onPress: () => {
                        updateLocale(locale);
                        updateSettings({locale: locale})
                    }
                }
            });

            settingsData = [
                {
                    type: 'SECTION',
                    header: i18n.t`settings.locale`,
                    rows: languages
                }];
            break;
        case 'about':
            settingsData = [
                {
                    type: 'CUSTOM_VIEW',
                    render: () => {
                        return <View style={{padding: 32}}>
                            <Headline>{i18n.t`settings.about`}</Headline>
                            <Text style={styles.simpleText}>
                                {i18n.t`settings.about_content.0`}
                            </Text>
                            <Text style={styles.simpleText}>
                                {i18n.t`settings.about_content.1`}
                                {"\u00A0" /* &nbsp */}
                                <Text style={{color: '#f47c1c'}}
                                      onPress={() => Linking.openURL(TWITTER_URL)}>@satpile</Text>.
                                {"\n"}
                                {i18n.t`settings.about_content.2`}
                            </Text>
                        </View>
                    }
                }
            ];
            break;
        case 'legal':
            settingsData = [
                {
                    type: 'CUSTOM_VIEW',
                    render: () => {
                        return <View style={{padding: 32}}>
                            <Headline>{i18n.t`settings.legal`}</Headline>
                            <Text selectable={true} style={styles.simpleText}><Legal/></Text>
                        </View>
                    }
                }
            ];
            break;

    }

    return <View style={{flex: 1, backgroundColor: 'hsl(0, 0%, 97%)'}}>
        <SettingsScreenComponent data={settingsData} style={{paddingTop: 20}}/>
    </View>;

}

const styles = StyleSheet.create({
    simpleText: {
        fontSize: 16,
        textAlign: 'justify',
        marginVertical: 16,
        letterSpacing: -0.5
    },
    simpleTextContainer: {
        padding: 32
    }
})