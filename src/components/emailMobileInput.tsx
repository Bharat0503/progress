import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import config from '../utils/config'
import { textColors, borderColors, commonColors, backgroundColors } from '../utils/colors'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { REQUEST_LOGIN_OTP, REQUEST_SIGNUP_OTP } from '@/src/services/MutationMethod';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux'

interface EmailMobileInputProps {
    login?: boolean;
    signUp?: boolean;
    handleRequestOtpAPI?: (requestOtp: any, email: string) => void
}

const EmailMobileInput: React.FC<EmailMobileInputProps> = ({ login, signUp, handleRequestOtpAPI }) => {
    const [email, setEmail] = useState('');
    const [requestLoginOtp] = useMutation(REQUEST_LOGIN_OTP);
    const [requestSignUpOtp] = useMutation(REQUEST_SIGNUP_OTP);
    const isLoading = useSelector((state: any) => state.reducer.loading)
    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        if (config.isWeb) {
            if (dimension?.height > 820) {
                return dimension.height * (height / 100)
            }
            else {
                return 820 * (height / 100)
            }
        }
        else {
            return dimension.height * (height / 100)
        }
    }

    useEffect(() => {
        return (() => {

        })
    }, []);

    return (
        <View style={styles.container}>
            {
                login &&
                <Text style={[styles.HeaderText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14) }]}>
                    Sign in with your phone number or your email
                </Text>
            }

            {signUp &&
                <Text style={[styles.HeaderText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14) }]}>
                    Enter your phone number or your email
                </Text>
            }
            <TextInput
                allowFontScaling={false}
                style={[styles.EmailPhoneInput, { height: config.isWeb ? getHeight(5) : config.getHeight(7), width: config.isWeb ? getWidth(20) : config.getWidth(90), borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4), marginVertical: config.isWeb ? getHeight(1) : config.getHeight(2) }]}
                maxLength={100}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={'eg: +1 XXX XXX XXX or abc@domain.com'}
                placeholderTextColor={borderColors.lightGray}
            />
            <TouchableOpacity onPress={() => {
                signUp ?
                    handleRequestOtpAPI(requestSignUpOtp, email)
                    :
                    handleRequestOtpAPI(requestLoginOtp, email)

            }} style={[styles.SignInSignUpButton, {
                borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4), width: config.isWeb ? getWidth(8) : config.getWidth(40),
                height: config.isWeb ? getHeight(5) : config.getHeight(7)
            }]}>
                {
                    login ?
                        isLoading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator />
                            </View>
                            :
                            <Text style={[styles.SignInSignUpText, { fontSize: config.isWeb ? getFontSize(4.5) : config.generateFontSizeNew(18) }]}>
                                Sign in
                            </Text>
                        : null
                }
                {signUp ?

                    isLoading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator />
                        </View>
                        :
                        <Text style={[styles.SignInSignUpText, { fontSize: config.isWeb ? getFontSize(4.5) : config.generateFontSizeNew(18) }]}>
                            Sign Up
                        </Text>
                    : null
                }

            </TouchableOpacity>
            {
                login &&
                <Text style={[styles.bottomText, { color: commonColors.black, fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), marginTop: config.isWeb ? getHeight(1.25) : config.getHeight(2.5) }]}>
                    Don't have an account? <Text onPress={() => { navigationService.navigate(RouteNames.SignUp) }} style={[styles.bottomText, { color: textColors.signUp, fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), marginTop: config.isWeb ? getHeight() : config.getHeight(2.5) }]}>
                        Sign Up
                    </Text>
                </Text>
            }
            {
                signUp &&
                <Text style={[styles.bottomText, { color: commonColors.black, fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), marginTop: config.isWeb ? getHeight(1.25) : config.getHeight(2.5) }]}>
                    Already have an account? <Text onPress={() => {
                        navigationService.goBack()
                    }} style={[styles.bottomText, { color: textColors.signUp, fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), marginTop: config.isWeb ? getHeight(1.25) : config.getHeight(2.5) }]}>
                        Sign In
                    </Text>
                </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    HeaderText: {
        color: commonColors.black,
        fontFamily: 'regular'
    },
    EmailPhoneInput: {
        borderColor: borderColors.textInputBorder,
        borderWidth: config.isWeb ? 0.1 : 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    SignInSignUpButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColors.signInButton
    },
    SignInSignUpText: {
        color: commonColors.white,
        fontFamily: 'regular'
    },
    bottomText: {
        fontFamily: 'regular',
    }
})
export default EmailMobileInput