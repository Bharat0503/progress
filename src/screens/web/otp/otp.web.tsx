import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator, Modal } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { backgroundColors, borderColors, commonColors, textColors } from '../../../utils/colors'
import navigationService from '../../../navigation/navigationService';
import RouteNames from '../../../navigation/routes/index';
import LogoText from '../../../components/logoText';
import OtpInput from '../../../components/otpInput';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { REQUEST_LOGIN_OTP, REQUEST_SIGNUP_OTP, VALIDATE_OTP } from '../../../services/MutationMethod';
import { setEmail, setLoading, setTempToken, setTempUserId, setToken, setUserId } from '../../../redux/action';
import { handleOtpVerifyAPI, handleRequestLoginOtpAPI, handleRequestSignupOtpAPI } from '../../../api/commonApiMethod';
import { setAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';

const Otp: React.FC = (props) => {
    const otpOpacity = useSharedValue(0);
    const signUp = props?.route?.params?.signUp
    const login = props?.route?.params?.login
    const [otp, setOtp] = useState('')
    const isLoading = useSelector((state: any) => state.reducer.loading)
    const email = useSelector((state: any) => state.reducer.email)
    const [verifyOtp] = useMutation(VALIDATE_OTP);
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()
    const [requestLoginOtp] = useMutation(REQUEST_LOGIN_OTP);
    const [requestSignUpOtp] = useMutation(REQUEST_SIGNUP_OTP);
    const [resendClicked, setResendClicked] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState(false);
    const dimension = useSelector((state: any) => state.reducer.dimentions);

    useEffect(() => {
        setTimeout(() => {
            otpOpacity.value = 1;
        }, 500)
    }, []);

    const animatedOtpStyle = useAnimatedStyle(() => ({
        opacity: withTiming(otpOpacity.value, { duration: 500 }),
    }));
    const setOTP = (otp: string) => {
        setOtp(otp)
    }

    const errorHandling = (errorMessage: any) => {
        setErrorMessage(errorMessage)
        dispatch(setLoading(false))
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    const getFontSize = (size: number) => {


        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {

        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {

        return dimension.height * (height / 100)
    }

    const handleOtpVerifyAPIResponse = async () => {
        Keyboard.dismiss()
        dispatch(setLoading(true))
        const response = await handleOtpVerifyAPI(verifyOtp, otp, email, errorHandling)
        // console.log("handleOtpVerifyAPIResponse", response)
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
                // navigationService.navigate(RouteNames.DashBoard)
            }
            setTimeout(() => {
                setMessage("")
            }, 4000)
        }
    }

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
     const showDialogContact = () => {
                return (
                    <Modal
                        visible={showDialog}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowDialog(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.alertView}>
                                <Text style={styles.alertTitle}>
                                    Have feedback or suggestions? Reach out to us at Info@globalcastmd.com. We appreciate hearing from you!
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.okButton}
                                        onPress={() => {
                                            setShowDialog(false);
                                        }}
                                    >
                                        <Text style={styles.buttonText}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                );
            };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <LogoText />
            </View>
            <Animated.View style={[styles.subContainer, animatedOtpStyle]}>
                <OtpInput setOTP={setOTP} />
                <TouchableOpacity onPress={() =>
                    signUp ? handleOtpVerifyAPIResponse() : handleOtpVerifyAPIResponse()
                } style={styles.signUpSignIncontainer}>
                    {
                        isLoading ?
                            <ActivityIndicator />
                            :
                            signUp
                                ?
                                <Text style={styles.signUpSignInText}>
                                    Sign Up
                                </Text>
                                : <Text style={styles.signUpSignInText}>
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
            {
                message &&
                <Text style={[styles.messageText, { color: commonColors.darKGreen }]}>{message}</Text>
            }
            {
                errorMessage &&
                <Text style={[styles.messageText, { color: commonColors.red }]}>{errorMessage}</Text>
            }
             {/* CONTACT US Button */}
                        <TouchableOpacity
                            onPress={() => setShowDialog(true)}
                            style={{
                                position: 'absolute', // Absolute positioning
                                top: getHeight(10),    // Position from the top
                                left: getWidth(10),    // Position from the left
                                backgroundColor: backgroundColors.headerTitle,
                                borderWidth: 1,
                                borderColor: borderColors.profileImage,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: getWidth(1),
                                paddingVertical: getHeight(0.5), // Optional padding adjustment
                                borderRadius: getHeight(1.8),
                            }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: commonColors.black
                            }}>
                                CONTACT US
                            </Text>
                        </TouchableOpacity>
                        {showDialog && (
                            <View>
                                {showDialogContact()}
                            </View>
                        )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center', flex: 1
    },
    logoContainer: {
        alignItems: 'center', justifyContent: 'center', position: 'absolute',
        top: config.getHeight(40), transform: [{ translateY: -config.getHeight(20) }]
    },
    subContainer: {
        justifyContent: 'center', alignItems: 'center', position: 'absolute',
        top: config.getHeight(40)
    },
    signUpSignIncontainer: {
        borderRadius: config.getWidth(0.7),
        justifyContent: 'center', alignItems: 'center',
        width: config.getWidth(8), height: config.getHeight(5),
        backgroundColor: '#231F20'
    },
    signUpSignInText: {
        color: commonColors.white,
        fontSize: config.generateFontSizeNew(3.5),
        fontFamily: 'regular'
    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        position: 'absolute',
        bottom: config.getHeight(20),

    },
    bottomText: {
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        fontFamily: 'regular',
        marginTop: config.getHeight(2.5)
    },
    modalOverlay: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
            },
            alertView: {
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 20,
                alignItems: 'center',
                width: '30%',
                borderColor: commonColors.black,
                borderWidth: 1,
            },
            alertTitle: {
                fontSize: config.generateFontSize(4),
                fontWeight: 'regular',
                color: commonColors.black,
                marginBottom: 10,
                textAlign: 'center',
            },
            buttonContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: config.getHeight(2),
            },
            okButton: {
                backgroundColor: backgroundColors.requestAccess,
                paddingVertical: 10,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                width: config.getWidth(5),
            },
            buttonText: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
            }
})

export default Otp