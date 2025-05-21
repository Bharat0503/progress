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
import WebView from 'react-native-webview';



const ContentGuidelinePdf: React.FC = ({ }) => {


    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const guidelinePdfLink = useSelector((state: any) => state.reducer.guidelinePdfLink)

    // Gesture handler for pinch-to-zoom


    // Gesture handler for pan/drag


    // Animated styles


    return (

        <View style={styles.container}>

            <Header back={true} />


            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <WebView

                    source={{ uri: guidelinePdfLink }}
                    style={{
                        width: config.getWidth(84),
                        height: config.getHeight(30),
                        overflow: 'hidden',
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    setSupportMultipleWindows={false}
                    onShouldStartLoadWithRequest={(request) => {
                        if (request.url.endsWith(".pdf") || request.url.endsWith(".doc")) {
                            return false; // Prevent automatic downloading
                        }
                        return true;
                    }}
                />

            </View>





        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    }
})

export default ContentGuidelinePdf