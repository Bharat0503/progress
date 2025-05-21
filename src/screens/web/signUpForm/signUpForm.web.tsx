import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import LogoText from '../../../components/logoText';
import SignupForm from '../../../components/signupForm';
import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';
import { useSelector } from 'react-redux';

const SignUpForm: React.FC = () => {
    const signUpOpacity = useSharedValue(0);
    const [showDialog, setShowDialog] = useState(false);
    const dimension = useSelector((state: any) => state.reducer.dimentions);

    useEffect(() => {
        setTimeout(() => {
            signUpOpacity.value = 1;
        }, 500)
    }, []);

    const animatedSignUpStyle = useAnimatedStyle(() => ({
        opacity: withTiming(signUpOpacity.value, { duration: 500 }),
    }));
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
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
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollStyle}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <LogoText />
                </View>
                <Animated.View style={[styles.formContainer, animatedSignUpStyle]}>
                    <SignupForm />
                </Animated.View>
               
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: { flex:1, justifyContent: 'center', alignItems: 'center'},
    scrollStyle: {
        padding: 10, height: config.getHeight(100)
    },
    container: {
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: config.getWidth(100), paddingVertical: config.getHeight(5), marginTop: config.getHeight(7)
    },
    logoContainer: {
        alignItems: 'center', justifyContent: 'center'
    },
    formContainer: {
        justifyContent: 'center', alignItems: 'center'
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

export default SignUpForm