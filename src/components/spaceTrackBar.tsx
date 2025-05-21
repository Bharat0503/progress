import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import config from '../utils/config'


import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import { useSelector } from 'react-redux'

interface SpaceTrackBarProps {
    spaceName?: string
    // filter?: boolean
    // onSelect?: (filter: string) => void | undefined
    // onSearch?: (search: string) => void | undefined
}

const SpaceTrackBar: React.FC<SpaceTrackBarProps> = ({ spaceName }) => {

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
    return (
        <View style={{
            flexDirection: 'row',
            height: getHeight(7),
            width: getWidth(60),
            justifyContent: 'flex-start',
            alignItems: 'center',
            // backgroundColor: 'pink'

        }}>
            <View style={{
                backgroundColor: commonColors.black,
                borderRadius: getWidth(1),
                paddingHorizontal: getWidth(1.5),
                paddingVertical: getHeight(1.5),
                justifyContent: 'center', alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: 'regular',
                    color: commonColors.white,
                    fontSize: getFontSize(2.5)
                }}>
                    Spaces
                </Text>

            </View>
            {
                spaceName &&


                <View style={{
                    width: getWidth(3),
                    height: getWidth(2),
                    justifyContent: 'center', alignItems: 'center',
                }}>
                    <Image
                        style={{
                            width: getWidth(3),
                            height: getWidth(2),
                        }}
                        source={Icons.spaceArrow}
                        resizeMode='contain'

                    />
                </View>
            }
            {
                spaceName &&


                <View style={{
                    backgroundColor: backgroundColors.spaceTrack,
                    borderRadius: getWidth(1),
                    paddingHorizontal: getWidth(1.5),
                    paddingVertical: getHeight(1.5),
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: 'regular',
                        color: commonColors.white,
                        fontSize: getFontSize(2.5)
                    }}>
                        {spaceName}
                    </Text>

                </View>
            }



        </View>

    )

}



export default SpaceTrackBar