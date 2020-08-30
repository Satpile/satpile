import React, {useMemo, useState} from "react";
import {View} from "react-native";
import {Button, Text} from "react-native-paper";
import {useTheme} from "../utils/Theme";
import PromptModal from "./PromptModal";
import {i18n} from "../translations/i18n";
import {getNextNPaths} from "../utils/XPubAddresses";

type Props = {
    value: string;
    onChange(value: string);
}

function generatePathsExample(startingPath: string) {
    return getNextNPaths(startingPath, 5);
}

function isPathValid(path: string): boolean {
    return /^[0-9](\/[0-9])*$/.test(path);
}

export function DerivationPathSelector({value, onChange}: Props) {
    const theme = useTheme();
    const [showEditModal, setShowEditModal] = useState(false);
    const pathsExamples = useMemo(() => generatePathsExample(value), [value])

    return <View style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: 24
    }}>
        {showEditModal && <PromptModal
            title={i18n.t('edit_derivation_path')}
            description={i18n.t('enter_starting_derivation_path')}
            inputPlaceholder={i18n.t('starting_derivation_path')}
            visible={showEditModal}
            submitLabel={i18n.t('done')}
            onClose={() => setShowEditModal(false)}
            onValidate={(input) => {
                onChange(input);
            }}
            validationRule={isPathValid}
            defaultValue={value} /> }
            <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text>{i18n.t("selected_starting_derivation_path")}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{fontWeight: "bold"}}>{value}</Text>
                    <Button onPress={() => setShowEditModal(true)}>Edit</Button>
                </View>
            </View>
            <View>
                <Text>{i18n.t("generated_derivation_paths")}</Text>
                <Text>{pathsExamples.join(", ")}...</Text>
            </View>
    </View>

}
