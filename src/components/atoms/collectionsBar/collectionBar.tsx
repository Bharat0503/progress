import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import config from '../../../utils/config'


import { borderColors, commonColors, textColors } from '../../../utils/colors'

import { useDispatch, useSelector } from 'react-redux'
import Icons from '@/src/assets/icons'
import { backgroundColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService'
import RouteNames from '@/src/navigation/routes'
import { setCollection, setCollectionList, setContent, setContentId, setRefresh } from '@/src/redux/action'
import Analytics from '@/src/services/Analytics'
import { constgetContrastColor } from '../../GlobalConstant'
interface ContentIconProps {
    item: any,
    spaceColor?: string
    // setCountryDropDown?: (value: string, valueId: number, country_code: string, calling_code: string) => void | undefined
}


const CollectionBar: React.FC<ContentIconProps> = ({ item, spaceColor }) => {

    const collectionList = useSelector((state: any) => state.reducer.collectionList)
    const refresh = useSelector((state: any) => state.reducer.refresh)
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
    const dispatch = useDispatch()




    return (

        <TouchableOpacity onPress={() => {
            console.log("setContent", item)
            const collectionListUpdated = collectionList?.length !== 0 ? collectionList : []

            //alert(contentIdListUpdated)
            collectionListUpdated?.push(item)
            console.log("collectionListUpdated", collectionListUpdated)
            dispatch(setCollectionList(collectionListUpdated))
            dispatch(setCollection(item))
            dispatch(setRefresh(!refresh))
            const spaceId = item?.id?.toString();
            console.log("id.....", spaceId)
            Analytics.logSpaceCarouselGroupEvent(spaceId);
            navigationService.navigate(RouteNames.Collections, { spaceColor })
        }}

            style={{
                // padding: config.isWeb ? null : getWidth(1),
                // justifyContent: 'flex-start', alignItems: 'center',
                //backgroundColor: 'yellow',
                width: config.isWeb ? getWidth(40) : null,
                //flex: 1,


            }}>
            <View style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: config.isWeb ? getWidth(2) : getWidth(5),
                paddingHorizontal: config.isWeb ? getWidth(2) : getWidth(5),
                backgroundColor: spaceColor,
                borderRadius: config.getHeight(1.2), marginBottom: config.getHeight(1)

            }}>
                <Text numberOfLines={2} style={{

                    textAlign: 'left',
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                    marginRight: config.getWidth(6),
                    color: textColors.blackTextColor,
                }}>
                    {item?.name}
                </Text>

                <Image
                    source={Icons.rightArrow}
                    style={{
                        width: config.isWeb ? getWidth(1) : config.getWidth(3),
                        height: config.isWeb ? getWidth(1) : config.getWidth(3),
                        position: 'absolute',
                        right: getWidth(5),
                    }}
                    resizeMode='contain'
                />

            </View>






        </TouchableOpacity>


    )

}



export default CollectionBar