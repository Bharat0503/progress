import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'



import { borderColors, commonColors, textColors } from '../../../utils/colors'

import { useDispatch, useSelector } from 'react-redux'
import Icons from '@/src/assets/icons'
import { backgroundColors } from '@/src/utils/colors'
import { Image } from 'expo-image'
import config from '@/src/utils/config'
import Analytics from '@/src/services/Analytics'
import { setRefresh, setSpace } from '@/src/redux/action'
import navigationService from '@/src/navigation/navigationService'
import RouteNames from '@/src/navigation/routes'
interface ContentIconProps {
    item: any
    spaceColor?: string
    onClickPoratslSpace: (item: any) => void
    // setCountryDropDown?: (value: string, valueId: number, country_code: string, calling_code: string) => void | undefined
}


const PortalIcon: React.FC<ContentIconProps> = ({ item, spaceColor, onClickPoratslSpace }) => {



    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const refresh = useSelector((state: any) => state.reducer.refresh)


    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const dispatch = useDispatch()


    // const onClickPoratslSpace = (item: any) => {
    //     // console.log("OnCLICKSPACES", item)
    //     // setSpaceId(item.id)







    //     let space = {
    //         id: item?.id,
    //         logo: item?.logo_path,
    //         name: item?.name,
    //     }
    //     dispatch(setSpace(space))
    //     dispatch(setRefresh(!refresh))
    //     // setFeaturedContentData(null)
    //     // setPortalsContentData(null)
    //     // setOtherResourceContentData(null)
    //     // setVisibleFeaturedContent(true)
    //     // setVisiblePortalContent(false)
    //     // setVisibleOtherResourcesContent(false)
    //     // setVisibleFCSpacesContent(false)



    //     navigationService.navigate(RouteNames.SpaceDashBoard)
    //     // setRequestModalVisible(true)
    // }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }




    return (

        <TouchableOpacity onPress={() => {
            Analytics.logPortalEvent(item?.id)
            onClickPoratslSpace(item)
        }} style={{
            padding: getWidth(1),
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'green',
            flex: 0.34,


        }}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                // padding: getWidth(5),
                width: config.isWeb ? getWidth(10) : config.getWidth(20),
                height: config.isWeb ? getWidth(10) : config.getWidth(20),
                backgroundColor: backgroundColors.content,
                borderWidth: 1,
                overflow: 'hidden',
                borderColor: spaceColor,
                borderRadius: getWidth(10)
            }}>
                <Image
                    style={{
                        width: config.isWeb ? getWidth(10) : getWidth(20),
                        height: config.isWeb ? getWidth(10) : getWidth(20),
                        borderRadius: getWidth(10)
                        // backgroundColor: "pink"
                        // tintColor: "#AD63A7"
                    }}

                    // tintColor={commonColors.red}
                    source={{ uri: item?.logo_path }}
                    contentFit='contain'

                />
            </View>

            <Text style={{ textAlign: 'center', fontFamily: 'regular', fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(14), color: textColors.spaceName, marginTop: getHeight(0.5), marginBottom: getHeight(1.5) }}>
                {item?.name}
            </Text>




        </TouchableOpacity>


    )

}



export default PortalIcon