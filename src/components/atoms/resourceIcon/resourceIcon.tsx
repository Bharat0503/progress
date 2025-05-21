import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import config from '../utils/config'


import { borderColors, commonColors, textColors } from '../../../utils/colors'

import { useSelector } from 'react-redux'
import Icons from '@/src/assets/icons'
import { backgroundColors } from '@/src/utils/colors'
interface ContentIconProps {
    item: any
    // setCountryDropDown?: (value: string, valueId: number, country_code: string, calling_code: string) => void | undefined
}


const ResourceIcon: React.FC<ContentIconProps> = ({ item }) => {



    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }




    return (

        <View style={{
            padding: getWidth(1),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: commonColors.white
        }}>
            <View style={{
                width: getWidth(80),
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: getWidth(5),
                backgroundColor: backgroundColors.otherResource, borderWidth: 1, borderColor: borderColors.profileImage,
                borderRadius: getWidth(3), flexDirection: 'row'
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: 'regular',
                    fontSize: getFontSize(14),
                    color: textColors.spaceName,
                    marginVertical: getHeight(2)

                }}>
                    {item?.title}
                </Text>
                <Image
                    style={{
                        width: getWidth(2),
                        height: getHeight(3),
                    }}

                    // tintColor={commonColors.red}
                    source={Icons.rightArrow}
                    resizeMode='contain'

                />
            </View>






        </View>


    )

}



export default ResourceIcon