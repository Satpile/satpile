import React, {useState} from "react";
import {Animated, Dimensions, Text} from "react-native";


interface ToastOptions {
    message: string;
    duration: number;
    type: "left" | "right" | "bottom" | "top";
}

// Holds ref to show function from the current rendered ToastHolder
let INTERNAL_showRef: (ToastOptions) => void;

export function ToastHolder() {

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [slideAnimation] = useState(new Animated.Value(0));
    const [slideType, setSlideType] = useState('none');

    INTERNAL_showRef = ({message, duration, type}: ToastOptions) => {
        setVisible(false);
        slideAnimation.setValue(0);

        setMessage(message);
        setVisible(true);
        setSlideType(type);

        Animated.timing(slideAnimation, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true
        }).start(() => {
            setVisible(false);
            setMessage("");
            slideAnimation.setValue(0);
        });
    };

    if (Toast.awaitingToast) {
        Toast._showAwaitingToast();
    }

    if (!visible) {
        return null;
    }


    const animateStyle = () => {
        switch (slideType) {
            case 'top':
                return {
                    top: 30,
                    transform: [{
                        translateY: slideAnimation.interpolate({
                            inputRange: [0.0, 0.03, 0.97, 1.0],
                            outputRange: [-80, 0, 0, -80],
                        })
                    }]
                }
            case 'bottom':
                return {
                    bottom: 50,
                    transform: [{
                        translateY: slideAnimation.interpolate({
                            inputRange: [0.0, 0.03, 0.97, 1.0],
                            outputRange: [100, 0, 0, 100],
                        })
                    }]
                }
            case 'right':
                return {
                    bottom: 50,
                    transform: [{
                        translateX: slideAnimation.interpolate({
                            inputRange: [0.0, 0.03, 0.97, 1.0],
                            outputRange: [Dimensions.get('screen').width, 0, 0, -Dimensions.get('screen').width],
                        })
                    }]
                };

            default:
            case 'left':
                return {
                    bottom: 50,
                    transform: [{
                        translateX: slideAnimation.interpolate({
                            inputRange: [0.0, 0.03, 0.97, 1.0],
                            outputRange: [-Dimensions.get('screen').width, 0, 0, Dimensions.get('screen').width],
                        })
                    }],
                };
        }
    };

    return <Animated.View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        paddingHorizontal: 15,
        ...animateStyle(),
    }}>
        <Animated.View style={{
            backgroundColor: '#323232',
            paddingVertical: 14,
            borderRadius: 5,
            alignContent: 'center'
        }}>
            <Text style={{color: 'white', textAlign: 'center'}}>{message}</Text>
        </Animated.View>
    </Animated.View>
}


export class Toast {
    static awaitingToast: ToastOptions = null;
    static showToast(options: ToastOptions) {
        if (INTERNAL_showRef) {
            INTERNAL_showRef(options);
        } else {
            this.awaitingToast = options;
        }
    }

    static _showAwaitingToast() {
        this.showToast(this.awaitingToast);
        this.awaitingToast = null;
    }
}
