import React from "react";
import {Clipboard, Image, TouchableHighlight, View} from "react-native";
import {List} from 'react-native-paper';
import AddressesListItemValue from "./AddressesListItemValue";
import {Toast} from "./Toast";
import {i18n} from "../translations/i18n";

export default class AddressesListItem extends React.Component<{ key, address, onClick }> {
    constructor(props) {
        super(props)
    }

    setClipBoard() {
        Clipboard.setString(this.props.address.address);
        Toast.showToast({message: i18n.t('address_copied'), duration: 1500, type: 'bottom'});
    }

    render() {
        return (
            <TouchableHighlight
                onLongPress={() => {
                    this.setClipBoard()
                }} underlayColor="rgba(0,0,0,0.1)"
                onPress={() => {
                    this.props.onClick(this.props.address)
                }}
            >
                <View>
                    <List.Item
                        title={this.props.address.name}
                        description={this.props.address.address}
                        left={() => (
                            <View style={{alignContent: 'flex-start'}}>
                                <Image source={require('../assets/icon_small.png')}
                                       style={{marginTop: 6, paddingBottom: 0, height: 24, width: 24}}/>
                            </View>)}
                        style={{marginBottom: 0, paddingBottom: 0}}
                        titleEllipsizeMode={"tail"}
                        descriptionEllipsizeMode={"middle"}
                        descriptionNumberOfLines={1}
                        descriptionStyle={{marginTop: 2, paddingBottom: 0, paddingRight: 25}}
                        titleStyle={{paddingRight: 25}}
                    />
                    <AddressesListItemValue address={this.props.address}/>
                </View>
            </TouchableHighlight>
        )
    }
}


