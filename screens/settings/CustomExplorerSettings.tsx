import {View} from "react-native";
import {Headline, Subheading, Text, TextInput, RadioButton, Switch} from "react-native-paper";
import React from "react";
import {useSettings} from "../../utils/Settings";
import {useTheme} from "../../utils/Theme";
export default function CustomExplorerSettings(){
    const [settings, updateSettings] = useSettings();
    const theme = useTheme();

    const updateExplorerOptions = (options: Partial<typeof settings.explorerOption.options>) => {
        updateSettings({
            explorerOption: {
                ...(settings.explorerOption),
                options: {
                    ...settings.explorerOption.options,
                    ...options
                }
            }
        });
    }

    return <View>
        <TextInput label="hostname" defaultValue={settings.explorerOption.options.host} onChangeText={text => updateExplorerOptions({host: text})}/>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 12}}>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-around"}}>
                <Text>Enable TLS/SSL</Text>
                <Switch
                    value={settings.explorerOption.options.protocol === "tls"}
                    onValueChange={(value) =>{
                        updateExplorerOptions({protocol: value ? "tls" : "tcp"});
                    }}
                    color={theme.colors.primary}
                />
            </View>
            <TextInput
                style={{flex: 1}}
                label="port"
                defaultValue={settings.explorerOption.options.port+""}
                keyboardType={"number-pad"}
                error={settings.explorerOption.options.port === 0}
                onChangeText={(text) => {
                    const port = parseInt(text) || 0;
                    updateExplorerOptions({port});
                }}
            />
        </View>
    </View>
}
