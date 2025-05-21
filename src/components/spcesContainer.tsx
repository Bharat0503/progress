import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import config from '../utils/config'
import { borderColors, commonColors, textColors } from '../utils/colors'
import { useDispatch, useSelector } from 'react-redux'
import { setImageLoading } from '../redux/action'

interface SpaceContainerProps {
    isLoadingMore?: boolean
    totalData?: number
    onLoadMore: () => void
    subscribed?: boolean
    hub?: boolean
    spaces?: boolean
    data: any
    title?: string,
    loading?: boolean
    onClick?: (id: number) => void | undefined
}

const SpaceContainer: React.FC<SpaceContainerProps> = ({ isLoadingMore, totalData, onLoadMore, subscribed, hub, spaces, data, title, loading, onClick }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const dispatch = useDispatch()

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

    type ItemProps = { image: string, id: number, item: any, index: number };
    const LoadBottomButtons = (item: any) => {

        return (
            <View style={{
                position: 'absolute', bottom: config.isWeb ? 2 : 2, right: config.isWeb ? 1 : 1,
                flexDirection: 'row',
            }}>
                {
                    item?.item?.request_status === 0 &&
                    <View style={{
                        paddingVertical: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',

                        marginBottom: config.isWeb ? 1 : 3,
                        marginHorizontal: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),

                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(8),
                            fontFamily: 'regular',
                            color: commonColors.black,
                        }}>
                            Pending
                        </Text>
                    </View>
                }
                {
                    item?.item?.request_status === 1
                    &&
                    <View style={{
                        paddingVertical: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',

                        marginBottom: config.isWeb ? 1 : 3,
                        marginHorizontal: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),

                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(8),
                            fontFamily: 'regular', color: commonColors.black,
                        }}>
                            Denied
                        </Text>
                    </View>
                }
                {
                    item?.item?.request_status === 2 &&
                    <View style={{
                        paddingVertical: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(1) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',

                        marginBottom: config.isWeb ? 1 : 3,
                        marginHorizontal: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),

                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(8),
                            fontFamily: 'regular', color: commonColors.black,
                        }}>
                            Subscribed
                        </Text>
                    </View>

                }
                {/*
                {
                    item?.item?.request_status === 1 || item?.item?.request_status === 0
                        ? */}

                {
                    (item?.item?.request_status === 1 || item?.item?.request_status === 0 || item?.item?.request_status == null) && item?.item?.space_type === 1
                        ? <View style={{
                            // flex: 1,
                            paddingVertical: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),
                            padding: config.isWeb ? getWidth(0.25) : config.getWidth(0.5),
                            borderRadius: config.isWeb ? getWidth(1) : config.getWidth(3),
                            borderWidth: 1,
                            borderColor: borderColors.profileImage,
                            justifyContent: 'center', alignItems: 'center',

                            marginBottom: config.isWeb ? 1 : 3,
                            marginHorizontal: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),

                            backgroundColor: commonColors.white
                        }}>
                            <Text style={{
                                fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(8),
                                fontFamily: 'regular', color: commonColors.black,
                            }}>
                                Public
                            </Text>
                        </View>
                        :
                        null
                }
                {
                    (item?.item?.request_status === 1 || item?.item?.request_status === 0 || item?.item?.request_status == null) && item?.item?.space_type === 2
                        ? <View style={{
                            paddingVertical: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),
                            padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                            borderRadius: config.isWeb ? getWidth(1) : config.getWidth(3),
                            borderWidth: 1,
                            borderColor: borderColors.profileImage,
                            justifyContent: 'center', alignItems: 'center',

                            marginBottom: config.isWeb ? 1 : 3,
                            marginHorizontal: config.isWeb ? getWidth(0.12) : config.getWidth(0.5),

                            backgroundColor: commonColors.white
                        }}>
                            <Text style={{
                                fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(8),
                                fontFamily: 'regular', color: commonColors.black
                            }}>
                                Private
                            </Text>
                        </View>
                        : null
                }
            </View >
        )
    }

    const handleImageLoad = (index: number) => {
        let status = loadingStates
        if (!status?.includes(index)) {
            console.log("loadingStates", index)
            status.push(index)
            dispatch(setImageLoading(status))
        }
    };

    const Item = ({ image, id, item, index }: ItemProps) => {
        const [loadingStates, setLoadingstate] = useState<boolean>(item?.isLoading)
        return (
            <TouchableOpacity onPress={() => {
                onClick ?
                    onClick(item)
                    : null
            }} style={{
                width: config.isWeb ? getWidth(8) : config.getWidth(25),
                height: config.isWeb ? getWidth(8) : config.getHeight(12),
                marginHorizontal: config.isWeb ? getWidth(0.5) : config.getWidth(2),
                marginVertical: config.isWeb ? getHeight(0.25) : config.getHeight(1),

                justifyContent: 'center', alignItems: 'center',
                borderColor: borderColors.spacesImage, borderWidth: 1,
                borderRadius: config.isWeb ? getWidth(0.5) : config.getWidth(2)
            }}>
                {
                    image ?
                        <>
                            {
                                loadingStates ?

                                    <ActivityIndicator
                                        size='small'
                                        style={{
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    :
                                    null
                            }
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Image
                                    style={{
                                        width: config.isWeb ? getWidth(7.5) : config.getWidth(24.5),
                                        height: config.isWeb ? getWidth(7.5) : config.getHeight(11),
                                        justifyContent: 'center', alignItems: "center",


                                    }}
                                    source={{ uri: image }}

                                    resizeMode='contain'
                                    onLoadEnd={() => {

                                        setLoadingstate(false)
                                        item["isLoading"] = false
                                    }
                                    }

                                />
                                {title === 'Spaces' || !title
                                    ?
                                    <LoadBottomButtons item={item} />
                                    : null
                                }
                            </View>
                        </>
                        :
                        <View style={{
                            width: config.isWeb ? getWidth(7.5) : config.getWidth(24.5),
                            height: config.isWeb ? getWidth(7.5) : config.getHeight(12),
                            justifyContent: 'center', alignItems: "center",

                        }}>
                            <Text numberOfLines={2} style={{
                                width: config.isWeb ? getWidth(7.5) : config.getWidth(24.5),
                                height: config.isWeb ? getWidth(7.5) : config.getHeight(11),
                                color: textColors.spaceName,
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                            }}>
                                {item?.name}
                            </Text>

                            {title === 'Spaces' &&
                                <LoadBottomButtons item={item} />
                            }
                        </View>
                }
            </TouchableOpacity>
        )
    };

    return (
        <View style={{
            backgroundColor: commonColors.white,
            justifyContent: 'center',
            alignItems: config.isWeb ? 'center' : 'flex-start',
            padding: config.isWeb ? getWidth(0.5) : config.getWidth(2),
            paddingBottom: config.isWeb ? getWidth(1) : config.getWidth(5),
            width: config.isWeb ? getWidth(40) : config.getWidth(90),
            marginTop: config.isWeb ? getWidth(1) : config.getWidth(5),
            borderWidth: 1, borderColor: commonColors.black,
            borderRadius: config.isWeb ? getWidth(1) : config.getWidth(5),
            minHeight: config.isWeb ? getHeight(3) : config.getHeight(10)
        }}>
            <Text style={{ marginBottom: config.isWeb ? getHeight(3) : 10, marginLeft: config.isWeb ? 0 : 6, fontFamily: 'bold', fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14) }}>
                {title}
            </Text>
            {
                loading ?
                    <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                    :
                    data?.length !== 0
                        ?

                        <FlatList
                            scrollEnabled={false}
                            data={data}
                            renderItem={({ item, index }) => <Item image={item.logo} id={item.id} item={item} index={index} />}
                            numColumns={3}
                            keyExtractor={item => item.id}
                        // contentContainerStyle={{ backgroundColor: 'pink', justifyContent: 'center', alignItems: 'center' }}
                        />
                        :
                        <Text
                            style={{
                                textAlign: 'center',
                                marginTop: config.isWeb ? getHeight(1.25) : config.getHeight(5),
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                                color: commonColors.black,
                                alignSelf: 'center'
                            }}
                        >
                            No data available
                        </Text>
            }
            {
                isLoadingMore &&
                <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ActivityIndicator />
                </View>
            }
            {
                !loading
                    ?
                    totalData && totalData > data?.length
                        ?
                        <TouchableOpacity onPress={
                            () => {
                                onLoadMore()
                            }
                        } disabled={loading || isLoadingMore ? true : false} style={{ alignSelf: 'flex-end', marginRight: getWidth(5) }}>
                            <Text style={{
                                color: textColors.chapterTileText,
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(2.5) : config.generateFontSizeNew(12),
                            }}>
                                see more...
                            </Text>
                        </TouchableOpacity>
                        : null
                    : null
            }
        </View>
    )
}

export default SpaceContainer