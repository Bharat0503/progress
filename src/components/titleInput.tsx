import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import config from '../utils/config'
import { textColors, borderColors, commonColors, backgroundColors } from '../utils/colors'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { REQUEST_LOGIN_OTP, REQUEST_OTP, REQUEST_SIGNUP_OTP } from '@/src/services/MutationMethod';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux'

// import BaseText from './atoms/BaseText/BaseText'
// import styled from 'styled-components/native'
// import BaseInput from './atoms/BaseInput/BaseInput'

interface TitleInputProps {
    title: string
    initialData?: any
    editable?: boolean
    maxLength?: number
    notImp?: any
    setInput: (value: any) => void | undefined
}

const TitleInput: React.FC<TitleInputProps> = ({ title, initialData, editable, maxLength, notImp, setInput }) => {

    // console.log("INITIALDATA", title, initialData)
    const [value, setvalue] = useState<any>(initialData)
    const dimension = useSelector((state: any) => state.reducer.dimentions)

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
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }



    useEffect(() => {

        return (() => {

        })

    }, []);
    return (


        <View style={{
            marginTop: config.isWeb ? getWidth(0.5) : config.getHeight(2),
            width: config.isWeb ? getWidth(19) : config.getWidth(90),
            zIndex: -1,
            // backgroundColor: 'pink'

        }}>
            <Text style={{
                color: commonColors.black,
                fontFamily: 'regular',
                fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                alignSelf: 'flex-start',
                marginBottom: config.isWeb ? getHeight(0.5) : config.getHeight(1)
            }}>
                {title}
                {!notImp &&
                    <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                        marginBottom: config.isWeb ? getHeight(1) : config.getHeight(1)

                    }}>*</Text>
                }

            </Text>

            {
                editable
                    ?
                    <TextInput
                        allowFontScaling={false}
                        style={{
                            height: config.isWeb ? getHeight(5) : config.getHeight(7),
                            width: config.isWeb ? getWidth(19) : config.getWidth(90),
                            borderColor: borderColors.textInputBorder,
                            borderWidth: config.isWeb ? 0.1 : 1,
                            borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(5),
                            paddingHorizontal: 10,
                            backgroundColor: '#fff',
                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                            fontFamily: 'regular',
                        }}
                        maxLength={maxLength}
                        editable={editable}
                        value={value}
                        onChangeText={(value) => {
                            setvalue(value)
                            setInput(value)
                        }
                        }
                        keyboardType={title === "Years of practice" ? "numeric" : "email-address"}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    :
                    <View style={{
                        height: config.isWeb ? getHeight(5) : config.getHeight(7),
                        width: config.isWeb ? getWidth(19) : config.getWidth(90),
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(5),
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: backgroundColors.offWhite,
                    }}>
                        <Text numberOfLines={1} style={{ backgroundColor: backgroundColors.offWhite, fontFamily: 'regular', fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16) }}>
                            {initialData}
                        </Text>
                    </View>

            }


        </View>



    )

}

const styles = StyleSheet.create({


})


export default TitleInput