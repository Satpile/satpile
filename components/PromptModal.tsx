import React, {useEffect, useState} from 'react';
import {Button, Dialog, Paragraph, Portal} from "react-native-paper";
import {Keyboard, Platform, StatusBar, TextInput, View} from "react-native";
import {i18n} from "../translations/i18n";

declare type PromptModalProps = {
    title: string,
    description: string,
    visible: boolean,
    inputPlaceholder: string
    submitLabel: string,
    defaultValue?: string

    onValidate: (input: string) => void,
    onCancel?: () => void,
    onClose: () => void
};

export default function PromptModal(props: PromptModalProps){
    const [input, setInput] = useState(props.defaultValue);

    const _cancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
        _close()
    }

    const _validate = () => {
        props.onValidate(input);
        _close()
    }

    const _close = () => {
        if (props.defaultValue) {
            setInput(props.defaultValue);
        } else {
            setInput('');
        }
        props.onClose();
    }

    if (Platform.OS === "ios") {


        useEffect(() => {
            Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
            Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

            // cleanup function
            return () => {
                Keyboard.removeListener("keyboardWillShow", _keyboardWillShow);
                Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
            };
        }, []);

        const _keyboardWillShow = (event) => {
            updateKeyboardHeight(event.endCoordinates.height)
        };

        const _keyboardDidHide = (event) => {
            updateKeyboardHeight(event.endCoordinates.height)
        };
    }

    const [keyboardHeight, updateKeyboardHeight] = useState(0);

    return (
        props.visible && (<Portal>
            {props.visible && <StatusBar animated={false} backgroundColor={"#7a3d0e"}/>}

            <View style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}>
                <Dialog
                    style={{marginBottom: keyboardHeight}}
                    visible={props.visible}
                    onDismiss={_close}>
                    <Dialog.Title>{props.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{props.description}</Paragraph>
                        <TextInput
                            value={input}
                            defaultValue={props.defaultValue}
                            onChangeText={setInput}
                            placeholder={props.inputPlaceholder}
                            style={{borderBottomWidth: 1, height: 32}}
                            autoFocus={true} blurOnSubmit={true} enablesReturnKeyAutomatically={true}
                            returnKeyType={"done"}
                            autoCompleteType={'off'}
                            onSubmitEditing={_validate}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={_cancel}>{i18n.t('cancel')}</Button>
                        <Button onPress={_validate}>{props.submitLabel}</Button>
                    </Dialog.Actions>
                </Dialog>
            </View>
        </Portal>) || null
    );


}