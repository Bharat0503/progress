import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import LogoText from '../../../components/logoText';
import EmailMobileInput from '../../../components/emailMobileInput';
import { handleRequestSignupOtpAPI } from '../../../api/commonApiMethod'
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setLoading } from '@/src/redux/action';
import navigationService from '../../../navigation/navigationService';
import RouteNames from '../../../navigation/routes';
import { backgroundColors, borderColors, commonColors } from '../../../utils/colors';

const SignUp: React.FC = () => {
    const signUpOpacity = useSharedValue(0);
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()
    const [showDialog, setShowDialog] = useState(false);

    const dimension = useSelector((state: any) => state.reducer.dimentions);

    const getFontSize = (size: number) => {


        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {

        return dimension.width * (width / 100)
    }

    const getViewWidth = (width: number) => {

        return dimension.width * (width / 100)
    }
    const getViewHeight = (height: number) => {

        return dimension.height * (height / 100)
    }

    const getHeight = (height: number) => {

        return dimension.height * (height / 100)
    }

    useEffect(() => {
        setTimeout(() => {
            signUpOpacity.value = 1;
        }, 500)
    }, []);
    const animatedSignUpStyle = useAnimatedStyle(() => ({
        opacity: withTiming(signUpOpacity.value, { duration: 500 }),
    }));

    const errorHandling = (errorMessage: any) => {
        setErrorMessage(errorMessage)
        dispatch(setLoading(false))
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    const handleRequestOtpAPIResponse = async (requestOtp: any, email: string) => {
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
            <View style={[styles.logoContainer, {
                top: config.isWeb ? getHeight(40) : config.getHeight(40), transform: [{ translateY: config.isWeb ? -getHeight(20) : -config.getHeight(20) }]
            }]}>
                <LogoText />
            </View>
            <Animated.View style={[styles.subContainer, animatedSignUpStyle, { top: config.isWeb ? getHeight(40) : config.getHeight(40) }]}>
                <EmailMobileInput signUp={true} handleRequestOtpAPI={handleRequestOtpAPIResponse} />
            </Animated.View>
            {
                message &&
                <Text style={[styles.messageText, {
                    color: commonColors.darKGreen,
                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),

                    bottom: config.isWeb ? getHeight(20) : config.getHeight(20),
                }]}>{message}</Text>
            }
            {
                errorMessage &&
                <Text style={[styles.messageText, {
                    color: commonColors.red, fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),

                    bottom: config.isWeb ? getHeight(20) : config.getHeight(20),
                }]}>{errorMessage}</Text>
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

    },
    subContainer: {
        justifyContent: 'center', alignItems: 'center', position: 'absolute',

    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),

        bottom: config.getHeight(20),
        position: 'absolute',
        // marginTop: config.getHeight(45)
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

export default SignUp