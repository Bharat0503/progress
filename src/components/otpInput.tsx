import React, { useState, useEffect, useRef } from 'react'
import { Platform, View, Text, TextInput, StyleSheet } from 'react-native'
import config from '../utils/config'
import { borderColors, commonColors } from '../utils/colors'
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import useFetchDimention from '../customHooks/customDimentionHook';

interface OtpInputProps {
    setOTP: (OTP: string) => void
}


const OtpInput: React.FC<OtpInputProps> = ({ setOTP }) => {

    const [clearIntervals, setClearIntervals] = useState<boolean>(false)
    let interval = null as any

    let autoFill = ""


    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputs = useRef([]);
    const hiddenInputRef = useRef(null);

    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();

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




    const handleChange = (text: string, index: number) => {

        console.log("OTPTEXT", text)
        if (text.length === 6) {
            // Autofill or Paste
            const otpArray = text.split("").slice(0, 6);
            setOtp(otpArray);
            otpArray.forEach((num, i) => {
                if (inputs.current[i]) {
                    inputs.current[i].setNativeProps({ text: num });
                }
            });
            inputs.current[5].focus();
        } else {
            const newOtp = [...otp];

            if (!newOtp[index] || text === "") {
                newOtp[index] = text;
                setOtp(newOtp);
            }





            if (text && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {

        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();





        }
    };



    const isSixDigitNumber = (str) => {
        return /^\d{6}$/.test(str);
    }

    useEffect(() => {

        const clearClipboard = async () => {
            // await Clipboard.setStringAsync(""); // Clear clipboard by setting an empty string
            // console.log("Clipboard cleared!");
            interval = setInterval(async () => {
                const content = await Clipboard.getStringAsync();
                console.log("OTPCONTENT11", content)
                if (content != "" && isSixDigitNumber(content)) {

                    const otpArray = content.split("").slice(0, 6);
                    setOtp(otpArray);
                    otpArray.forEach((num, i) => {
                        if (inputs.current[i]) {
                            inputs.current[i].setNativeProps({ text: num });
                        }
                    });
                    inputs.current[5].focus();


                    await Clipboard.setStringAsync("");
                    setClearIntervals(true)
                }

            }, 2000)
        };
        clearClipboard()

        return () => clearInterval(interval); // Cleanup on unmount
    }, [])



    useEffect(() => {
        if (clearIntervals) {
            clearInterval(interval);
        }

    }, [clearIntervals])

    useEffect(() => {
        // Trigger the slide animation based on `isVisible`


        if (otp.length === 6) {
            const otpString = otp.join("");
            setOTP(otpString)

        }

        return (() => {

        })

    }, [otp]);


    return (
        <View style={styles.btn1View}>

            <Text style={[styles.HeaderText, {
                fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),
            }]}>
                Enter the code you got via email/phone

            </Text>

            <View style={styles.otpContainer}>

                <TextInput
                    ref={hiddenInputRef}
                    style={styles.hiddenInput}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    onChangeText={(text) => handleChange(text, 0)}
                />
                {otp.map((digit, index) => (
                    <View style={[styles.otpInputStyle, {
                        width: Platform.OS === 'web' ? getWidth(3.25) : config.getWidth(13),
                        height: Platform.OS === 'web' ? getWidth(3.25) : config.getHeight(7.5),

                        borderWidth: Platform.OS === 'web' ? 0.1 : 1,
                        borderRadius: Platform.OS === 'web' ? getWidth(1) : config.getWidth(4),
                        marginVertical: Platform.OS === 'web' ? getHeight(1) : config.getHeight(2),
                        marginHorizontal: Platform.OS === 'web' ? getWidth(0.375) : config.getWidth(1.5),

                    }]}>
                        <TextInput allowFontScaling={false}
                            ref={(el) => (inputs.current[index] = el)}
                            key={index}
                            value={digit}


                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            style={[styles.otpInput, {
                                width: Platform.OS === 'web' ? getWidth(3.25) : config.getWidth(13),
                                height: Platform.OS === 'web' ? getWidth(3.25) : config.getHeight(7.5),
                                borderWidth: Platform.OS === 'web' ? 0.1 : 1,
                                borderRadius: Platform.OS === 'web' ? getWidth(1) : config.getWidth(4),

                            }]}
                            maxLength={digit ? 1 : 6}
                            keyboardType='number-pad'
                            textContentType="oneTimeCode"


                        />


                    </View>
                ))}




            </View>




        </View >

    )

}


const styles = StyleSheet.create({
    HeaderText: {
        color: commonColors.black,
        fontFamily: 'regular',


    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        height: 0,
        width: 0,
    },
    otpContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn1View: {
        alignSelf: 'center',
        alignItems: 'center',


    },
    otpInputStyle: {

        justifyContent: 'center',
        borderColor: borderColors.textInputBorder,
        alignItems: 'center',


    },
    otpInput: {


        alignSelf: 'center',
        borderColor: borderColors.textInputBorder,

        textAlign: 'center',
        backgroundColor: '#fff',
        color: '#000'
    },
})



export default OtpInput