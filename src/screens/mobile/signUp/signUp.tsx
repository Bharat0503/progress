import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { commonColors, backgroundColors } from '@/src/utils/colors'
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';
import LogoText from '@/src/components/logoText';
import { handleRequestSignupOtpAPI } from '@/src/api/commonApiMethod';
import EmailMobileInput from '@/src/components/emailMobileInput';
import { useDispatch } from 'react-redux';
import { setEmail, setLoading } from '@/src/redux/action';



const SignUp: React.FC = () => {

    const opacity = useSharedValue(0);
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()


    useEffect(() => {
        setTimeout(() => {
            opacity.value = 1;
        }, 500)
    }, []);

    const errorHandling = (errorMessage: any) => {
        setErrorMessage(errorMessage)
        dispatch(setLoading(false))
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    const handleRequestOtpAPIResponse = async (requestOtp: any, email: string) => {
        Keyboard.dismiss()
        dispatch(setLoading(true))
        dispatch(setEmail(email))
        const response = await handleRequestSignupOtpAPI(requestOtp, email, errorHandling)
        console.log("handleRequestOtpAPIResponse", response)
        if (response?.data) {
            setMessage(response?.data?.requestSignupOtp?.message)
            dispatch(setLoading(false))
            setTimeout(() => {
                navigationService.navigate(RouteNames.Otp, { signUp: true })
            }, 1500)
            setTimeout(() => {
                setMessage("")
            }, 4000)
        }
    }

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, { duration: 500 }),
    }));

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColors.offWhite }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        // position: 'absolute',
                        top: config.getHeight(10),
                        transform: [{ translateY: -config.getHeight(30) }]
                    }}>
                        <LogoText />
                    </View>
                    <Animated.View style={[{
                        top: -config.getHeight(10),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }, animatedTextStyle]}>
                        <EmailMobileInput signUp={true} handleRequestOtpAPI={handleRequestOtpAPIResponse} />
                    </Animated.View>
                </View>
            </KeyboardAvoidingView >
            {
                message &&
                <Text style={[styles.messageText, { color: commonColors.darKGreen }]}>{message}</Text>
            }
            {
                errorMessage &&
                <Text style={[styles.messageText, { color: commonColors.red }]}>{errorMessage}</Text>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: backgroundColors.offWhite
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        top: config.getHeight(7),
        transform: [{ translateY: -config.getHeight(30) }]
    },
    EmailMobileInputConatainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // position: 'absolute',
        // top: config.getHeight(35)
        marginTop: -config.getHeight(8),
        justifyContent: 'center',
        alignItems: 'center'

    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        position: 'absolute',
        bottom: config.getHeight(20),
        // marginTop: config.getHeight(45)
    }
})

export default SignUp