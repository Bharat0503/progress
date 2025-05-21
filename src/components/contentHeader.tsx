import React, { } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import config from '../utils/config'


import { borderColors, commonColors } from '../utils/colors'
import { useDispatch, useSelector } from 'react-redux'


interface ContentHeaderProps {
    title: string
}



const ContentHeader: React.FC<ContentHeaderProps> = ({ title }) => {


    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const dispatch = useDispatch()


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
    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(55) : config.getWidth(90),
            height: config.isWeb ? null : config.getHeight(8),
            borderRadius: config.isWeb ? getWidth(0.88) : config.getWidth(3.5),
            marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(1),
            borderColor: borderColors.profileImage, borderWidth: 1,
            paddingVertical: config.isWeb ? getHeight(2) : null,
        }}>
            <Text numberOfLines={2} style={{
                fontFamily: config.isWeb ? 'bold' : 'regular',
                fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                color: commonColors.black, textAlign: 'center',
                marginHorizontal: config.isWeb ? getWidth(1.25) : config.getWidth(5)
            }}>
                {title}
            </Text>

        </View >


    )

}

const styles = StyleSheet.create({

})


export default ContentHeader