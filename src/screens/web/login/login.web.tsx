import React, { useEffect, useState } from 'react'
import { Keyboard, View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GET_CONFIG } from '@/src/services/MutationMethod';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setAffiliations, setEmail, setLoading, setSpecialities, setTitles } from '../../../redux/action';
import { configAPIDataHandling } from '../../../api/commonDataHandling';
import LogoText from '../../../components/logoText';
import EmailMobileInput from '../../../components/emailMobileInput';
import { handleRequestLoginOtpAPI } from '../../../api/commonApiMethod';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '../../../navigation/routes';
import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';

const Login: React.FC = (props) => {
    const translateY = useSharedValue(0); // start off-screen
    const loginOpacity = useSharedValue(0);
    const animation = props?.route?.params?.animation;
    const dispatch = useDispatch();
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const { loading, error, data } = useQuery(GET_CONFIG);
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    const [showDialog, setShowDialog] = useState(false);

    const getFontSize = (size: number) => {


        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {

        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {

        return dimension.height * (height / 100)
    }
    useEffect(() => {
        if (!loading) {
            //console.log("CONFIG DATA", data, loading)
            const { affiliation, specialities, titles } = configAPIDataHandling(data)
            console.log("CONFIG DATA", affiliation, specialities, titles)
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
                translateY.value = -config.getHeight(20);
            }, 2000)
        }
        setTimeout(() => {
            loginOpacity.value = 1;
        }, animation ? 2500 : 500)
        return () => {
        }
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: withTiming(translateY.value, { duration: 500 }) }],
    }));

    const animatedLoginStyle = useAnimatedStyle(() => ({
        opacity: withTiming(loginOpacity.value, { duration: 500 }),
    }));

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
            {
                animation ?
                    <Animated.View style={[styles.animatedLogoContainer, animatedStyle, { top: config.isWeb ? getHeight(40) : config.getHeight(40) }]}>
                        <LogoText />
                    </Animated.View>
                    :
                    <View style={[styles.logoContainer, {
                        top: config.isWeb ? getHeight(40) : config.getHeight(40),
                        transform: [{ translateY: config.isWeb ? -getHeight(20) : -config.getHeight(20) }]
                    }]}>
                        <LogoText />
                    </View>
            }
            <Animated.View style={[styles.inputContainer, animatedLoginStyle, { top: config.isWeb ? getHeight(40) : config.getHeight(40) }]}>
                <EmailMobileInput login={true} handleRequestOtpAPI={handleRequestOtpAPIResponse} />
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
                    color: commonColors.red,
                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),
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
    );


}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center', flex: 1
    },
    animatedLogoContainer: {
        alignItems: 'center',
        justifyContent: 'center', position: 'absolute',
        // top: config.getHeight(40)
    },
    logoContainer: {
        alignItems: 'center', justifyContent: 'center', position: 'absolute',
        // top: config.getHeight(40),
        // transform: [{ translateY: -config.getHeight(20) }]
    },
    inputContainer: {
        justifyContent: 'center', alignItems: 'center', position: 'absolute',
        // top: config.getHeight(40)
    },
    messageText: {
        fontFamily: 'regular',
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


export default Login