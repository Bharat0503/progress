import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import config from '../../../utils/config'


import { borderColors, commonColors, textColors } from '../../../utils/colors'

import { useDispatch, useSelector } from 'react-redux'
import Icons from '@/src/assets/icons'
import { backgroundColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService'
import RouteNames from '@/src/navigation/routes'
import { setContent, setContentId, setContentIdList, setCurrentTab, setRefresh, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action'
import Analytics from '@/src/services/Analytics'
import { GET_SPACE_CONTENT_ID } from '@/src/services/QueryMethod'
import { useLazyQuery } from '@apollo/client'
import ContentType from '@/src/utils/contentTypeIds'
interface ContentIconProps {
    lastRow?: boolean
    item: any,
    spaceColor?: string
    // setCountryDropDown?: (value: string, valueId: number, country_code: string, calling_code: string) => void | undefined
}


const ContentIcon: React.FC<ContentIconProps> = ({ lastRow, item, spaceColor }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const refresh = useSelector((state: any) => state.reducer.refresh)
    const [getSpaceContentId] = useLazyQuery(GET_SPACE_CONTENT_ID)
    const contentIdList = useSelector((state: any) => state.reducer.contentIdList)

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
        <TouchableOpacity
            onPress={async () => {
                console.log("setContent", item);
                Analytics.logSpaceMenuButtonEvent(item?.space_id);

                if (item?.content_type_id === ContentType.DIRECTORY) {
                    dispatch(setRefresh(!refresh));
                    dispatch(setContent(item));
                    dispatch(setContentId(null));
                    dispatch(setSpaceDashBoard(false));
                    dispatch(setStartfromSpaceDashBoard(false));
                    navigationService.navigate(RouteNames.Content);
                } else {
                    const responseGetSpaceContentId = await getSpaceContentId({
                        variables: {
                            input: {
                                card_id: item?.card_id,
                                content_type_id: item?.content_type_id,
                                space_id: item?.space_id,
                            },
                        },
                    });

                    const content = responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.content;
                    setContentId(content?.[0]?.id);

                    if (content?.length > 1) {
                        dispatch(setContent(item));
                        dispatch(setContentId(null));
                        dispatch(setCurrentTab("Spaces"))
                        navigationService.navigate(RouteNames.FeaturedContentListing);
                    } else {
                        dispatch(setContent(null));
                        dispatch(setRefresh(!refresh));
                        dispatch(setContentId(content?.[0]?.id));
                        dispatch(setSpaceDashBoard(false));

                        const contentIdListUpdated = contentIdList?.length ? contentIdList : [];
                        contentIdListUpdated.push(content?.[0]?.id);
                        dispatch(setContentIdList(contentIdListUpdated));
                        dispatch(setStartfromSpaceDashBoard(false));
                        navigationService.navigate(RouteNames.Content);
                    }
                }
            }}
            style={{
                paddingHorizontal: config.isWeb ? getWidth(2) : getWidth(0.1),
                paddingVertical: config.isWeb ? getHeight(1) : getHeight(0.5),
                alignItems: 'center',
                flex: config.isWeb ? null : 0.34,

            }}
        >
            <View
                style={{

                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: config.isWeb ? getWidth(1) : config.getWidth(6),
                    backgroundColor: backgroundColors.content,
                    borderWidth: 1,
                    borderColor: spaceColor,
                    borderRadius: config.isWeb ? getWidth(0.5) : getWidth(3),
                    marginBottom: config.isWeb ? getHeight(2) : getHeight(0.5), // Ensures consistent spacing between items
                }}
            >
                <Image
                    style={{
                        width: config.isWeb ? getWidth(5) : getWidth(10),
                        height: config.isWeb ? getWidth(5) : getWidth(10),
                        tintColor: spaceColor,
                    }}
                    source={item?.title === "Directory" ? item?.icon : { uri: item?.icon }}
                    resizeMode="contain"
                />
            </View>
            <Text
                numberOfLines={2}
                style={{
                    width: config.isWeb ? getWidth(10) : getWidth(26),
                    textAlign: 'center',
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                    color: textColors.spaceName,
                    marginTop: config.isWeb ? getHeight(0.5) : getHeight(0.1), // Uniform margin above text
                    marginBottom: config.isWeb ? getHeight(2) : getHeight(0.5), // Uniform margin below text
                }}
            >
                {item?.title}
            </Text>
        </TouchableOpacity>
    );


}



export default ContentIcon