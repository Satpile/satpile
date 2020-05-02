import React, {useEffect, useState} from 'react'
import {Animated, Easing, StyleSheet} from "react-native";


export default function AnimatedSplashScreen({animate, onAnimationDone}) {

    const [scale] = useState(new Animated.Value(0))
    useEffect(() => {
        if (animate) {
            Animated.timing(scale, {
                toValue: 1,
                duration: 250,
                easing: Easing.cubic
            }).start(() => {
                requestAnimationFrame(onAnimationDone);
            })
        }
    })

    return <Animated.View style={{
        ...StyleSheet.absoluteFillObject, backgroundColor: 'white',

    }}>
        <Animated.Image style={{
            resizeMode: 'contain',
            width: '100%',
            alignItems: 'center',
            alignSelf: 'center',
            flex: 1,
            backgroundColor: "white",
            transform: [
                {
                    scale: scale.interpolate({inputRange: [0, 1], outputRange: [1, 15]})
                }
            ],
            opacity: scale.interpolate({inputRange: [0, 1], outputRange: [1, 0]})
        }} source={require('../assets/splash.png')}/>
    </Animated.View>
}
