import React, { useState, useEffect } from 'react'
import { Platform, View, ScrollView, KeyboardAvoidingView } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import LogoText from '@/src/components/logoText';
import SignupForm from '@/src/components/signupForm';
const SignUpForm: React.FC = () => {

    const signUpOpacity = useSharedValue(0);


    useEffect(() => {
        setTimeout(() => {
            signUpOpacity.value = 1;
        }, 500)
        return () => {

        }
    }, []);

    const animatedSignUpStyle = useAnimatedStyle(() => ({
        opacity: withTiming(signUpOpacity.value, { duration: 500 }),
    }));

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', }} style={{ padding: 10, height: config.getHeight(100) }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, alignSelf: 'center', marginTop: config.getHeight(17) }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <LogoText />
                    </View>
                    <Animated.View style={[{ justifyContent: 'center', alignItems: 'center', }, animatedSignUpStyle]}>
                        <SignupForm />
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>






    )

}

export default SignUpForm