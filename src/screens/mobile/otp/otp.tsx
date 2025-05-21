import React, { useState, useEffect } from 'react'
import { Platform, View, Text, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator, Image } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { commonColors, backgroundColors, textColors } from '@/src/utils/colors'
import OtpInput from '@/src/components/otpInput';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import LogoText from '@/src/components/logoText';
import { REQUEST_LOGIN_OTP, REQUEST_SIGNUP_OTP, VALIDATE_OTP } from '@/src/services/MutationMethod';
import { useMutation } from '@apollo/client';
import { handleOtpVerifyAPI, handleRequestSignupOtpAPI } from '@/src/api/commonApiMethod';
import { useSelector } from 'react-redux';
import { setEmail, setLoading, setTempToken, setTempUserId, setToken, setUserId } from '@/src/redux/action';
import { useDispatch } from 'react-redux';
import { setAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';
import { handleRequestLoginOtpAPI } from '@/src/api/commonApiMethod';
import Icons from '@/src/assets/icons';



const Otp: React.FC = (props) => {
    const opacity = useSharedValue(0);
    const email = useSelector((state: any) => state.reducer.email)
    const [verifyOtp] = useMutation(VALIDATE_OTP);
    const [otp, setOtp] = useState('')
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()
    const isLoading = useSelector((state: any) => state.reducer.loading)
    const signUp = props?.route?.params?.signUp
    const login = props?.route?.params?.login
    const [requestLoginOtp] = useMutation(REQUEST_LOGIN_OTP);
    const [requestSignUpOtp] = useMutation(REQUEST_SIGNUP_OTP);
    const [resendClicked, setResendClicked] = useState<boolean>(false)



    // const readClipboard = async () => {
    //     const clipboardContent = await Clipboard.getStringAsync();
    //     if (/^\d{4,6}$/.test(clipboardContent)) { // Regex for 4-6 digit OTP
    //         console.log("clipboardContent", clipboardContent)
    //         // setOtp(clipboardContent);
    //         // setMessage('OTP detected from clipboard!');
    //     }
    // };

    useEffect(() => {

        // const interval = setInterval(() => {
        //     readClipboard();
        // }, 1000);









        setTimeout(() => {
            opacity.value = 1;
        }, 500)







    }, []);



    const setOTP = (otp: string) => {
        console.log("OTPCONTENT", otp)
        setOtp(otp)
    }

    const errorHandling = (errorMessage: any) => {
        setErrorMessage(errorMessage)
        dispatch(setLoading(false))
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    const handleOtpVerifyAPIResponse = async () => {
        Keyboard.dismiss()
        dispatch(setLoading(true))
        const response = await handleOtpVerifyAPI(verifyOtp, otp, email, errorHandling)
        if (response?.data) {

            setMessage(response?.data?.verifyOtp?.message)
            dispatch(setEmail(""))
            dispatch(setLoading(false))
            if (!response?.data?.verifyOtp?.isUserRegistered) {
                dispatch(setTempToken(response?.data?.verifyOtp?.token))
                dispatch(setTempUserId(response?.data?.verifyOtp?.userId))
                setAsyncData(keys.tempUserToken, response?.data?.verifyOtp?.token)
                setAsyncData(keys.tempUserId, response?.data?.verifyOtp?.userId)
                setTimeout(() => {
                    navigationService.navigate(RouteNames.SignUpForm)
                }, 1500)
            }
            else {

                dispatch(setToken(response?.data?.verifyOtp?.token))
                dispatch(setUserId(response?.data?.verifyOtp?.userId))
                setAsyncData(keys.userToken, response?.data?.verifyOtp?.token)
                setAsyncData(keys.userId, response?.data?.verifyOtp?.userId)

                // navigationService.navigate(RouteNames.Main)
            }
            setTimeout(() => {
                setMessage("")
            }, 4000)
        }
    }

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, { duration: 500 }),
    }));

    const handleRequestOtpAPIResponseSignIn = async (requestOtp: any, email: string) => {

        const response = await handleRequestLoginOtpAPI(requestOtp, email, errorHandling)
        // console.log("handleRequestOtpAPIResponse", response)
        if (response?.data) {

            setMessage(response?.data?.requestLoginOtp?.message)
            setTimeout(() => {
                setMessage("")
                setResendClicked(false)
            }, 4000)
        }
    }

    const handleRequestOtpAPIResponseSignUp = async (requestOtp: any, email: string) => {

        const response = await handleRequestSignupOtpAPI(requestOtp, email, errorHandling)
        console.log("handleRequestOtpAPIResponse", response)
        if (response?.data) {
            setMessage(response?.data?.requestSignupOtp?.message)

            setTimeout(() => {
                setMessage("")
                setResendClicked(false)
            }, 4000)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => {
                            navigationService.goBack()
                        }}
                        style={{
                            position: 'absolute',
                            top: config.getHeight(8), left: config.getWidth(2),
                            width: config.getWidth(7), height: config.getWidth(6),
                            justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        <Image
                            style={{
                                width: config.getWidth(5), height: config.getWidth(5),

                            }}
                            source={Icons.backIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

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


                        <OtpInput setOTP={setOTP} />
                        <TouchableOpacity onPress={() =>
                            signUp ? handleOtpVerifyAPIResponse() : handleOtpVerifyAPIResponse()
                        } style={styles.signUpSignInButton}>
                            {
                                isLoading ?
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator />
                                    </View>
                                    :
                                    signUp ?
                                        <Text style={{ color: '#FFF', fontSize: config.generateFontSizeNew(18), fontFamily: 'regular' }}>
                                            Sign Up
                                        </Text>
                                        :
                                        <Text style={{ color: '#FFF', fontSize: config.generateFontSizeNew(18), fontFamily: 'regular' }}>
                                            Sign in
                                        </Text>

                            }
                        </TouchableOpacity>


                        <TouchableOpacity disabled={resendClicked} onPress={() => {
                            setResendClicked(true)
                            signUp ?
                                handleRequestOtpAPIResponseSignUp(requestSignUpOtp, email)
                                :
                                handleRequestOtpAPIResponseSignIn(requestLoginOtp, email)
                        }}>
                            <Text style={[styles.bottomText, { color: resendClicked ? textColors.chapterTileTextNotSelected : textColors.signUp }]}>
                                Resend OTP
                            </Text>
                        </TouchableOpacity>





                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
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
    bottomText: {
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        fontFamily: 'regular',
        marginTop: config.getHeight(2.5)
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: config.getHeight(40),
        transform: [{ translateY: -config.getHeight(30) }]
    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        position: 'absolute',
        bottom: config.getHeight(20),
        // marginTop: config.getHeight(45)
    },
    signUpSignInButton: {
        borderRadius: config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
        width: config.getWidth(40),
        height: config.getHeight(7),
        backgroundColor: backgroundColors.signInButton
    }
})

export default Otp