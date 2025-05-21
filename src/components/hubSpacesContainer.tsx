import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import config from '../utils/config'
import { borderColors, commonColors, textColors } from '../utils/colors'
import { useSelector } from 'react-redux'

interface HubSpaceContainerProps {
    subscribed?: boolean
    hub?: boolean | any
    spaces?: boolean
    data: any
    title?: string,
    loading?: boolean
    onClick?: (id: any) => void | undefined
}

const HubSpacesContainer: React.FC<HubSpaceContainerProps> = React.memo(({ subscribed, hub, spaces, data, title, loading, onClick }) => {

    const [imageLoading, setLoading] = useState(false)

    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const getFontSize = useCallback((size: number) => {
        return (dimension.width / 320) * size
    }, [dimension.width])

    const getWidth = useCallback((width: number) => {
        return dimension.width * (width / 100)
    }, [dimension.width])

    const getHeight = useCallback((height: number) => {
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
    }, [dimension.height])

    const handleItemClick = useCallback((item: any) => {
        if (onClick) {
            onClick(item)
        }
    }, [onClick])

    const handleLoadStart = useCallback(() => {
        setLoading(true);
    }, []);

    const handleLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

    const LoadBottomButtons = useCallback((itemObj: any) => {
        // Fix: Correctly handle the item structure
        const item = itemObj.item || itemObj;

        return (
            <View style={{
                position: 'absolute', bottom: 2, right: 1,
                flexDirection: 'row'
            }}>

                {
                    item?.request_status === 0 &&
                    <View style={{
                        paddingVertical: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',
                        marginBottom: 3,
                        marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(1.75) : config.generateFontSizeNew(7),
                            fontFamily: 'regular',
                            color: commonColors.black,
                        }}>
                            Pending
                        </Text>
                    </View>
                }
                {
                    item?.request_status === 1
                    &&
                    <View style={{
                        //  flex: 1,
                        paddingVertical: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',
                        marginBottom: 3,
                        marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(1.75) : config.generateFontSizeNew(7),
                            fontFamily: 'regular', color: commonColors.black,
                        }}>
                            Denied
                        </Text>
                    </View>

                }

                {
                    item?.request_status === 2 &&
                    <View style={{
                        // flex: 1,
                        paddingVertical: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                        borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        borderWidth: 1,
                        borderColor: borderColors.profileImage,
                        justifyContent: 'center', alignItems: 'center',
                        marginBottom: 3,
                        marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                        backgroundColor: commonColors.white
                    }}>
                        <Text style={{
                            fontSize: config.isWeb ? getFontSize(1.75) : config.generateFontSizeNew(7),
                            fontFamily: 'regular', color: commonColors.black,
                        }}>
                            Subscribed
                        </Text>
                    </View>

                }
                {
                    (item?.request_status === 1 || item?.request_status === 0 || item?.request_status == null) && item?.space_type === 1
                        ? <View style={{
                            // flex: 1,
                            paddingVertical: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                            padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                            borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                            borderWidth: 1,
                            borderColor: borderColors.profileImage,
                            justifyContent: 'center', alignItems: 'center',
                            marginBottom: 3,
                            marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                            backgroundColor: commonColors.white
                        }}>

                            <Text style={{
                                marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                                fontSize: config.isWeb ? getFontSize(1.75) : config.generateFontSizeNew(7),
                                fontFamily: 'regular', color: commonColors.black,
                            }}>
                                Public
                            </Text>
                        </View>
                        :
                        null
                }


                {
                    (item?.request_status === 1 || item?.request_status === 0 || item?.request_status == null) && item?.space_type === 2
                        ? <View style={{
                            // flex: 1,
                            paddingVertical: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                            padding: config.isWeb ? getWidth(0.25) : config.getWidth(1),
                            borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                            borderWidth: 1,
                            borderColor: borderColors.profileImage,
                            justifyContent: 'center', alignItems: 'center',
                            marginBottom: 3,
                            marginHorizontal: config.isWeb ? getWidth(0.125) : config.getWidth(0.5),
                            backgroundColor: commonColors.white
                        }}>


                            <Text style={{
                                fontSize: config.isWeb ? getFontSize(1.75) : config.generateFontSizeNew(7),
                                fontFamily: 'regular', color: commonColors.black
                            }}>
                                Private
                            </Text>
                        </View>
                        : null
                }
            </View >
        )
    }, [getWidth, getFontSize])

    const renderItem = useCallback(({ item }: { item: any }) => {
        const image = item.logo;
        const id = item.id;

        return (
            <TouchableOpacity
                onPress={() => handleItemClick(item)}
                activeOpacity={0.7}
                style={{
                    // borderRadius: config.getWidth(5),
                    width: config.isWeb ? getWidth(6.25) : config.getWidth(25),
                    height: config.isWeb ? getWidth(6.25) : config.getHeight(12),
                    marginHorizontal: config.isWeb ? getWidth(0.5) : config.getWidth(2),
                    marginVertical: config.isWeb ? getHeight(0.5) : config.getHeight(1),
                    borderColor: borderColors.spacesImage,
                    borderWidth: 1,
                    borderRadius: config.isWeb ? getWidth(0.5) : config.getWidth(2)
                }}>

                {
                    image ?
                        <ImageBackground
                            style={{
                                width: config.isWeb ? getWidth(6.125) : config.getWidth(24.5),
                                height: config.isWeb ? getWidth(6.125) : config.getHeight(12),
                                justifyContent: 'center', alignItems: "center",
                            }}
                            source={{ uri: image }}
                            resizeMode='contain'
                            onLoadStart={handleLoadStart}
                            onLoadEnd={handleLoadEnd}
                        >
                            {title === 'Spaces' || !title
                                ? <LoadBottomButtons item={item} />
                                : null
                            }
                        </ImageBackground>
                        :
                        <View style={{
                            width: config.isWeb ? getWidth(6.125) : config.getWidth(24.5),
                            height: config.isWeb ? getWidth(6.125) : config.getHeight(12),
                            justifyContent: 'center', alignItems: "center",
                        }}>
                            <Text numberOfLines={2} style={{
                                color: textColors.spaceName,
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                            }}>
                                {item?.name}
                            </Text>

                            {title === 'Spaces' &&
                                <LoadBottomButtons item={item} />
                            }
                        </View>
                }
            </TouchableOpacity>
        );
    }, [getWidth, getHeight, getFontSize, handleLoadStart, handleLoadEnd, title, LoadBottomButtons, handleItemClick]);

    // Memoize data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data || [], [data]);

    // Memoize extractKey function
    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
                fontFamily: 'bold',
                fontSize: config.isWeb ? getFontSize(6) : config.generateFontSizeNew(20),
                color: commonColors.black, textAlign: 'center', marginTop: config.getWidth(5)
            }}>
                {hub?.name}
            </Text>
            <View style={{
                backgroundColor: commonColors.white,
                justifyContent: 'center',
                alignItems: config.isWeb ? 'center' : 'flex-start',
                padding: config.isWeb ? getWidth(0.5) : config.getWidth(2),
                paddingBottom: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                width: config.isWeb ? getWidth(50) : config.getWidth(90),
                marginTop: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                borderWidth: 1, borderColor: commonColors.black,
                borderRadius: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                minHeight: config.isWeb ? getHeight(5) : config.getHeight(10)
            }}>
                {
                    loading
                        ?
                        <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <ActivityIndicator />
                        </View>
                        :
                        memoizedData?.length !== 0
                            ?
                            <FlatList
                                scrollEnabled={false}
                                data={memoizedData}
                                renderItem={renderItem}
                                numColumns={3}
                                keyExtractor={keyExtractor}
                                removeClippedSubviews={true}
                                initialNumToRender={9}
                                maxToRenderPerBatch={9}
                                windowSize={9}
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
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
})

export default HubSpacesContainer