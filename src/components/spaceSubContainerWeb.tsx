import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import config from '../utils/config'


import { borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import ContentIcon from './atoms/contentIcon/contentIcon'

interface SpaceSubContainerWebProps {
    item: any
    title?: string
    // subscribed?: boolean
    // hub?: boolean
    // spaces?: boolean
    // data: any
    // title?: string,
    // loading?: boolean
    // onClick?: (id: number) => void | undefined
}

const SpaceSubContainerWeb: React.FC<SpaceSubContainerWebProps> = ({ title, item }) => {


    const [featuredContentData, setFeaturedContentData] = useState<any>(item?.space_cards)

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    // useFetchDimention();

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

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



    // useEffect(() => {
    //     console.log(hub)
    // }, [])




    return (

        <View style={{
            //backgroundColor: 'red',
            height: getHeight(37),
            width: getWidth(18),
            marginTop: getHeight(2),
            justifyContent: 'flex-start', alignItems: 'center',
            marginRight: getWidth(1),

            borderRadius: getWidth(1), borderColor: borderColors.profileImage, borderWidth: 1
        }}>
            <View style={{
                // backgroundColor: 'pink',
                // paddingHorizontal: getWidth(0.5),
                // paddingVertical: getHeight(0.5),
                borderTopRightRadius: getWidth(1),
                borderTopLeftRadius: getWidth(1),

                width: getWidth(17.90),
                height: getHeight(6),
                borderBottomWidth: 1,
                borderBottomColor: borderColors.profileImage,
                overflow: 'hidden',
                justifyContent: 'center', alignItems: 'center'
                // marginHorizontal: getWidth(10)
            }}>
                <Text numberOfLines={2} style={{
                    fontFamily: 'bold', fontSize: getFontSize(2.5), color: commonColors.black, textAlign: 'center',
                    marginHorizontal: getWidth(2),
                    marginVertical: getHeight(1),
                    // backgroundColor: 'green'
                }}>
                    {item.name}
                </Text>

            </View>

            {/* <View style={{ backgroundColor: 'red', flex: 1 }}>

            </View> */}

            <View style={{
                // flex: 1,
                flexDirection: 'row',
                //backgroundColor: 'red',
                width: getWidth(17.90),
                height: getHeight(24.90),
                justifyContent: 'center', alignItems: 'center',

            }}>
                <FlatList
                    data={featuredContentData}
                    renderItem={({ item }) => <ContentIcon item={item} />}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    scrollEnabled={false}
                    style={{}}

                />

            </View>


            {
                title === "HUBs" &&
                <View style={{
                    // backgroundColor: 'green',
                    // paddingHorizontal: getWidth(0.5),
                    // paddingVertical: getHeight(0.5),
                    borderBottomRightRadius: getWidth(1),
                    borderBottomLeftRadius: getWidth(1),

                    width: getWidth(17.90),
                    height: getHeight(6),
                    borderTopWidth: 1,
                    borderTopColor: borderColors.profileImage,
                    overflow: 'hidden',
                    justifyContent: 'center', alignItems: 'center'
                    // marginHorizontal: getWidth(10)
                }}>
                    <Text numberOfLines={2} style={{
                        fontFamily: 'bold', fontSize: getFontSize(2.5), color: commonColors.black, textAlign: 'center',
                        marginHorizontal: getWidth(1),
                        marginVertical: getHeight(1),
                        // backgroundColor: 'green'
                    }}>
                        Go to Hub's Homepage
                    </Text>
                </View>
            }


            {
                item?.request_status === 2 &&
                <View style={{
                    // backgroundColor: 'green',
                    // paddingHorizontal: getWidth(0.5),
                    // paddingVertical: getHeight(0.5),
                    borderBottomRightRadius: getWidth(1),
                    borderBottomLeftRadius: getWidth(1),

                    width: getWidth(17.90),
                    height: getHeight(6),
                    borderTopWidth: 1,
                    borderTopColor: borderColors.profileImage,
                    overflow: 'hidden',
                    justifyContent: 'center', alignItems: 'center'
                    // marginHorizontal: getWidth(10)
                }}>
                    <Text numberOfLines={2} style={{
                        fontFamily: 'bold', fontSize: getFontSize(2.5), color: commonColors.black, textAlign: 'center',
                        marginHorizontal: getWidth(1),
                        marginVertical: getHeight(1),
                        // backgroundColor: 'green'
                    }}>
                        Go to Space's Homepage
                    </Text>
                </View>
            }

            {
                item?.request_status === 1 &&
                <View style={{
                    // backgroundColor: 'green',
                    // paddingHorizontal: getWidth(0.5),
                    // paddingVertical: getHeight(0.5),
                    borderBottomRightRadius: getWidth(1),
                    borderBottomLeftRadius: getWidth(1),

                    width: getWidth(17.90),
                    height: getHeight(6),
                    borderTopWidth: 1,
                    borderTopColor: borderColors.profileImage,
                    overflow: 'hidden',
                    justifyContent: 'center', alignItems: 'center'
                    // marginHorizontal: getWidth(10)
                }}>
                    <Text numberOfLines={2} style={{
                        fontFamily: 'bold', fontSize: getFontSize(2.5), color: commonColors.black, textAlign: 'center',
                        marginHorizontal: getWidth(1),
                        marginVertical: getHeight(1),
                        // backgroundColor: 'green'
                    }}>
                        Request Denied
                    </Text>
                </View>
            }
            {
                item?.request_status === 0 &&
                <View style={{
                    // backgroundColor: 'green',
                    // paddingHorizontal: getWidth(0.5),
                    // paddingVertical: getHeight(0.5),
                    borderBottomRightRadius: getWidth(1),
                    borderBottomLeftRadius: getWidth(1),

                    width: getWidth(17.90),
                    height: getHeight(6),
                    borderTopWidth: 1,
                    borderTopColor: borderColors.profileImage,
                    overflow: 'hidden',
                    justifyContent: 'center', alignItems: 'center'
                    // marginHorizontal: getWidth(10)
                }}>
                    <Text numberOfLines={2} style={{
                        fontFamily: 'bold', fontSize: getFontSize(2.5), color: commonColors.black, textAlign: 'center',
                        marginHorizontal: getWidth(1),
                        marginVertical: getHeight(1),
                        // backgroundColor: 'green'
                    }}>
                        Request Access
                    </Text>
                </View>
            }


        </View>




    )

}

export default SpaceSubContainerWeb