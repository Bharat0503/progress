import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import {
    PanGestureHandler,
    PinchGestureHandler,
    GestureHandlerRootView,
    PanGestureHandlerGestureEvent,
    PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';



const ContentInfographicImage: React.FC = ({ }) => {


    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const infographicImageLink = useSelector((state: any) => state.reducer.infographicImageLink)

    // Gesture handler for pinch-to-zoom
    const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
        onActive: (event) => {
            scale.value = event.scale;
        },
        onEnd: () => {
            scale.value = withSpring(1); // Reset scale to original size
        },
    });

    // Gesture handler for pan/drag
    const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onActive: (event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        },
        onEnd: () => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        },
    });

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (

        <View style={styles.container}>

            <Header infographic={true} back={true} />

            <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <PanGestureHandler onGestureEvent={panHandler}>
                        <Animated.Image
                            source={{ uri: infographicImageLink }}
                            style={[{
                                width: config.getWidth(100),
                                height: config.getHeight(70),

                            }, animatedStyle]}
                            resizeMode="contain"
                        />
                    </PanGestureHandler>
                </Animated.View>
            </PinchGestureHandler>




        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    },
    modalBackground: {
        width: config.getWidth(80),
        height: config.getHeight(35),
        backgroundColor: 'rgba(255, 255, 255, 0)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center'
    },
    modalContent: {
        backgroundColor: commonColors.white,
        width: config.getWidth(80),
        height: config.getHeight(35),
        //flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: commonColors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalSubContent: {
        flex: 1,
        alignItems: 'center',
        width: config.getWidth(78)
    },
})

export default ContentInfographicImage