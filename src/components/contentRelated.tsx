import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Share, Alert, Platform } from 'react-native'
import config from '../utils/config'
import { borderColors, textColors } from '../utils/colors'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { useDispatch, useSelector } from 'react-redux'
import { setContent, setContentId, setContentIdList, setRefresh, setSpaceDashBoard } from '../redux/action'
import SearchContent from './searchContent'
import { TOGGLE_CONTENT_LIKE } from '../services/MutationMethod'
import { useMutation } from '@apollo/client'
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from './GlobalConstant'
import ContentType from '../utils/contentTypeIds'
import * as Clipboard from 'expo-clipboard';

interface ContentRelatedProps {
    data?: any
    onClickToggleLikeContentRelated?: (id: number) => void
    onScrollMore?: () => void
    relatedContent?: boolean
    hasMoreData?: boolean

}



const ContentRelated: React.FC<ContentRelatedProps> = ({ data, onClickToggleLikeContentRelated, onScrollMore, relatedContent, hasMoreData }) => {


    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const contentIdList = useSelector((state: any) => state.reducer.contentIdList)
    const refresh = useSelector((state: any) => state.reducer.refresh)


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
    const redirectOnItemClick = (id: number) => {
        dispatch(setContentId(id))
        dispatch(setContent(null))
        dispatch(setRefresh(!refresh))
        const contentIdListUpdated = contentIdList?.length !== 0 ? contentIdList : []
        contentIdListUpdated?.push(id)
        dispatch(setContentIdList(contentIdListUpdated))
        dispatch(setSpaceDashBoard(false))
        navigationService.navigate(RouteNames.Content)
    };

    const toggleLike = async (contentId: string) => {
        if (onClickToggleLikeContentRelated) {
            onClickToggleLikeContentRelated(Number(contentId));
        }
    };

    const handleItemLikeClick = (item: string) => {
        toggleLike(item)
    };

    const handleItemChatClick = (id: string) => {
        console.log('handleItemChatClickhandleItemChatClickhandleItemChatClickhandleItemChatClick');
        navigationService.navigate(RouteNames.CommentsScreen, { commentsID: id })
    };

    const handleItemShareClick = async (item: any) => {

        try {
            const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`;
            const message = Platform.OS === 'android' ? `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}` : ``

            if (config.isWeb && !navigator.share) {
                // Web fallback: Copy to clipboard
                Clipboard.setStringAsync(urlToShare);
                Alert.alert('Link copied to clipboard!');
                return;
            }

            const result = await Share.share({
                message,
                url: urlToShare,
                title: item?.content_type_info?.name,
            });

            if (result.action === Share.sharedAction) {
                console.log('Content shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Content sharing dismissed');
            }
        } catch (error) {
            console.error('Error sharing content:', error);
        }
    };


    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(55) : config.getWidth(90),
            marginVertical: config.isWeb ? getHeight(1) : config.getHeight(2),
            borderRadius: config.isWeb ? getWidth(0.88) : config.getWidth(3.5),
            marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(1),
            overflow: 'hidden',
            borderColor: borderColors.signInBorder, borderWidth: 1
        }}>
            <Text style={{
                alignSelf: 'flex-start',
                fontFamily: 'bold',
                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                color: textColors.relatedContent,
                marginLeft: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(1)
            }}>
                Related Content
            </Text>

            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                style={{ marginVertical: config.isWeb ? getHeight(0.5) : getHeight(1) }}

                renderItem={({ item }) => (
                    item?.content_type_info?.is !== ContentType.DIRECTORY
                        ?
                        <SearchContent
                            width={getWidth(55)}
                            itemTitle={item?.content_type_info?.name}
                            title={item?.content_title}
                            subtitle={stripHtmlTags(item?.description)}
                            is_liked={item?.is_liked}
                            contentIconSource={item?.content_type_info?.content_icon}
                            itemIconSource={item?.associated_content_files?.[0]?.thumbnail}
                            contentType={item?.content_type_info?.id}
                            onLikePress={() => handleItemLikeClick(item.id)}
                            onChatPress={() => handleItemChatClick(item.id)}
                            onSharePress={() => handleItemShareClick(item)}
                            onItemClick={() => redirectOnItemClick(item.id)}
                        />
                        : null

                )}

            />
            {
                relatedContent
                    ?

                    hasMoreData

                        ?
                        <Text onPress={
                            () => {
                                onScrollMore()
                            }
                        } style={{
                            color: textColors.chapterTileText,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(2.5) : config.generateFontSizeNew(14),
                            alignSelf: 'flex-end',
                            marginRight: config.isWeb ? getWidth(1.25) : config.getWidth(4),
                            padding: config.isWeb ? getWidth(1) : config.getWidth(3),
                            marginBottom: config.isWeb ? getHeight(1) : config.getHeight(1),
                        }}>
                            see more...
                        </Text>
                        : null

                    : null
            }


        </View >


    )

}

const styles = StyleSheet.create({
    listContainer: {
        margin: 16,
        backgroundColor: 'green'
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
})


export default ContentRelated