import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Keyboard } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { commonColors, backgroundColors } from '@/src/utils/colors'
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';
import LogoText from '@/src/components/logoText';
import EmailMobileInput from '@/src/components/emailMobileInput';
import { GET_CONFIG } from '@/src/services/MutationMethod';
import { useQuery } from '@apollo/client';
import { useDispatch, } from 'react-redux';
import { setAffiliations, setLoading, setSpecialities, setTitles, setEmail, setToken } from '@/src/redux/action';
import { configAPIDataHandling } from '@/src/api/commonDataHandling';
import { handleRequestLoginOtpAPI } from '@/src/api/commonApiMethod';
import { getAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';



const Login: React.FC = (props) => {
    const translateY = useSharedValue(0); // start off-screen
    const opacity = useSharedValue(0);
    const animation = props?.route?.params?.animation
    const dispatch = useDispatch()
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const { loading, error, data } = useQuery(GET_CONFIG);

    useEffect(() => {
        if (!loading) {
            // console.log("CONFIG DATA", data, loading)
            const { affiliation, specialities, titles } = configAPIDataHandling(data)
            //console.log("CONFIG DATA", specialities)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setTitles(titles))

        }
    }, [loading])

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
        const response = await handleRequestLoginOtpAPI(requestOtp, email, errorHandling)
        // console.log("handleRequestOtpAPIResponse", response)
        if (response?.data) {

            setMessage(response?.data?.requestLoginOtp?.message)
            dispatch(setLoading(false))
            setTimeout(() => {
                navigationService.navigate(RouteNames.Otp, { login: true })
            }, 1500)
            setTimeout(() => {
                setMessage("")
            }, 4000)
        }
    }

    useEffect(() => {
        if (animation) {
            setTimeout(() => {
                translateY.value = -config.getHeight(30);
            }, 2000)
        }
        setTimeout(() => {
            opacity.value = 1;
        }, animation ? 2500 : 500)
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: withTiming(translateY.value, { duration: 500 }) }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, { duration: 500 }),
    }));

    return (
        <View style={styles.container}>
            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}> */}
            <View style={styles.subContainer}>
                {
                    animation ?
                        <Animated.View style={[styles.animationLogo, animatedLogoStyle]}>
                            <LogoText />
                        </Animated.View>
                        :
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            // position: 'absolute',
                            top: config.getHeight(10),
                            transform: [{ translateY: -config.getHeight(30) }]
                        }}>
                            <LogoText />
                        </View>
                }
                <Animated.View style={[{
                    marginTop: animation ? -config.getHeight(20) : -config.getHeight(5),
                    justifyContent: 'center',
                    alignItems: 'center'
                }, animatedTextStyle]}>
                    <EmailMobileInput login={true} handleRequestOtpAPI={handleRequestOtpAPIResponse} />
                </Animated.View>
            </View>
            {/* </KeyboardAvoidingView> */}
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
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColors.offWhite
    },
    subContainer: {
        alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: backgroundColors.offWhite
    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        position: 'absolute',
        bottom: config.getHeight(20),
    },
    animationLogo: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: config.getHeight(40),
        transform: [{ translateY: -config.getHeight(30) }]
    },

})

export default Login