import * as React from "react";
import {View} from "react-native";
import {Appbar, Switch, Text} from "react-native-paper";
import {useTheme} from "../utils/Theme";
import {SettingsData} from '@taccolaa/react-native-settings-screen'; //https://github.com/jsoendermann/react-native-settings-screen
import {i18n} from "../translations/i18n";
import {MainTitle} from "../components/DynamicTitle";
import {durationToText, useSettings} from "../utils/Settings";
import {Ionicons} from '@expo/vector-icons';
import {Linking} from "expo";
import * as StoreReview from 'expo-store-review';
import * as WebBrowser from 'expo-web-browser';
import Constants from "expo-constants";
import {COMPANY, FEEDBACK_URL, TWITTER_URL} from "../utils/Constants";
import {CustomSettingsScreen} from "../components/CustomSettingsScreen";

export default function SettingsScreen({navigation}) {

    const [settings, updateSettings] = useSettings();

    const theme = useTheme();

    navigation.setOptions({
        headerTitle: () => <MainTitle title={i18n.t('settings.title')}/>,
        headerLeft: () => <Appbar.BackAction color={"white"} onPress={() => navigation.goBack()}/>,
    });


    const settingsData: SettingsData = [
        {
            type: 'SECTION',
            rows: [{
                title: i18n.t`settings.refresh_every`,
                showDisclosureIndicator: true,
                renderAccessory: () => <SettingItemValue type={"refresh"} value={settings.refresh}/>,
                onPress: () => navigation.navigate('SettingsEdit', {setting: 'refresh'}),
            }]
        },
        {
            type: 'SECTION',
            rows: [
                {
                    title: i18n.t`settings.locale`,
                    showDisclosureIndicator: true,
                    renderAccessory: () => <SettingItemValue value={i18n.t('current_language')}/>,
                    onPress: () => navigation.navigate('SettingsEdit', {setting: 'locale'})
                },
                {
                    title: i18n.t`settings.dark_mode`,
                    renderAccessory: () => <Switch value={settings.darkMode} onValueChange={(value) => {
                        updateSettings({darkMode: value})
                    }}/>,
                },
                {
                    title: i18n.t`settings.icloud`,
                    renderAccessory: () => <Switch value={false} disabled={true} onValueChange={() => {
                    }}/>,
                }
            ],
        },
        {
            type: 'SECTION',
            rows: [
                {
                    title: i18n.t`settings.feedback`,
                    renderBeforeAccessory: () => <ItemIcon icon={"md-mail"} color={'#74b42e'}/>,
                    onPress: () => WebBrowser.openBrowserAsync(FEEDBACK_URL.replace('{version}', Constants.manifest.version))
                },
                {
                    title: i18n.t`settings.rate`,
                    renderBeforeAccessory: () => <ItemIcon icon={"md-heart"} color={"#cf021a"}/>,
                    onPress: () => {
                        let url = StoreReview.storeUrl();
                        if (url) {
                            Linking.openURL(url)
                        } else {
                            //TODO: fallback
                        }
                    }
                },
                {
                    title: i18n.t`settings.twitter`,
                    renderBeforeAccessory: () => <ItemIcon icon={"logo-twitter"} color={"#53acee"}/>,
                    onPress: () => Linking.openURL(TWITTER_URL)
                },
            ]
        },
        {
            type: 'SECTION',

            rows: [
                {
                    title: i18n.t`settings.about`,
                    showDisclosureIndicator: true,
                    onPress: () => navigation.navigate('SettingsEdit', {setting: 'about'})
                },
                {
                    title: i18n.t`settings.legal`,
                    showDisclosureIndicator: true,
                    onPress: () => navigation.navigate('SettingsEdit', {setting: 'legal'})
                },
                {title: i18n.t`settings.version`, renderAccessory: () => <Text>{Constants.manifest.version}</Text>},
                {title: i18n.t`settings.copyright`, renderAccessory: () => <Text>{COMPANY}</Text>},
            ],
        },
       /* {
            type: 'SECTION',
            rows: [
                {
                    title: i18n.t('settings.clear_data'),
                    showDisclosureIndicator: false,
                    titleStyle: {
                        color: 'red',
                        textAlign: 'center',
                    },
                    onPress: () => {
                        Alert.alert(
                            i18n.t('settings.clear_data'),
                            i18n.t('settings.clear_data_sure'),
                            [
                                {text: i18n.t('cancel'), style: 'cancel'},
                                {
                                    text: i18n.t('delete'), onPress: async () => {
                                        store.dispatch({type: 'CLEAR'})
                                    },
                                    style: "destructive"
                                },
                            ],
                            {cancelable: true}
                        )
                    }

                },
            ],
        },*/
    ];


    return <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <CustomSettingsScreen settings={settingsData}/>
    </View>;
}



const ItemIcon = ({icon, color}) => {

    return <View style={{marginRight: 5}}>
        <View style={{
            backgroundColor: color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            width: 30,
            height: 30
        }}>
            <Ionicons style={{
                alignContent: 'center',
                marginBottom: -1
            }} name={icon} color={'white'} size={20}/>
        </View>
    </View>
}


const SettingItemValue = ({value, type = null}) => {
    const theme = useTheme();
    const style = {color: theme.settingsValue, marginRight: 6, fontSize: 18};
    let displayedValue = value;
    switch (type) {
        case 'refresh':
            displayedValue = durationToText(value);
            break;
    }
    return <Text style={style}>{displayedValue}</Text>;
}
