import React, { } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import config from '../utils/config'
import { textColors } from '../utils/colors'
import Icons from '../assets/icons'
import { useSelector } from 'react-redux'



const LogoText: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)

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
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{
                    height: config.isWeb ? getHeight(14) : config.getHeight(13),
                    width: config.isWeb ? getWidth(10) : config.getWidth(24),
                }}
                source={Icons.logoTM}
                resizeMode='contain'
            />
            {/* <Text style={[styles.logoText, {
                fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(18),
                letterSpacing: config.isWeb ? config.getWidth(0.2) : config.getWidth(0.4),
                fontFamily: 'regular',
            }]}>StayCurrent<Text style={[styles.logoText, {
                fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(18),
                letterSpacing: config.isWeb ? config.getWidth(0.2) : config.getWidth(0.4),
                fontFamily: 'bold'
            }]}>MD</Text></Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    logoImage: {
        height: config.isWeb ? config.getHeight(11) : config.getHeight(13),
        width: config.isWeb ? config.getWidth(7) : config.getWidth(24),
    },
    logoText: {

        color: textColors.stayCurrentMD,

    }

})

export default LogoText