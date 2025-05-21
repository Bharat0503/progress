import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, RefreshControl, ActivityIndicator, Share, Alert, Platform } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { GET_SPACE_CONTENT_DETAILS, GET_SPACE_CONTENT_ID } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import SearchContent from '@/src/components/searchContent';
import { setContent, setContentId, setContentIdList, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { BASE_API_URL_DEEPLINK_PROD } from '@/src/components/GlobalConstant';
import * as Clipboard from 'expo-clipboard';
import Search from '@/src/components/search';
import Analytics from '@/src/services/Analytics';





const FeaturedContentListing: React.FC = (props) => {

    const contentdetails = useSelector((state: any) => state.reducer.content)
    const [getSpaceContentId] = useLazyQuery(GET_SPACE_CONTENT_DETAILS)
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [contentItems, setContentItems] = useState<any[]>([]);
    const contentIdList = useSelector((state: any) => state.reducer.contentIdList)

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const PAGE_SIZE = 10;
    const [search, setSearch] = useState<string>("")



    useEffect(() => {
        if (isFocused) {

            fetchSpaceContentDetails(1, search ? search : "")
        }

    }, [isFocused])


    const fetchSpaceContentDetails = async (page: number, search: string) => {
        try {

            let input = {}
            console.log("SEARCH", search)

            if (search !== "") {
                input = {
                    card_id: contentdetails?.card_id,
                    content_type_id: contentdetails?.content_type_id,
                    space_id: contentdetails?.space_id,
                    page: page,
                    page_size: PAGE_SIZE,
                    keyword: search
                }
            }
            else {
                input = {
                    card_id: contentdetails?.card_id,
                    content_type_id: contentdetails?.content_type_id,
                    space_id: contentdetails?.space_id,
                    page: page,
                    page_size: PAGE_SIZE,
                }
            }
            const responseGetSpaceContentId = await getSpaceContentId({
                variables: {
                    input: input
                }
            })

            console.log("responseGetSpaceContentId", input)
            //setContentItems(responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.content)
            if (responseGetSpaceContentId?.data && responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.content) {
                const newData = responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.content || [];
                const pagination = responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.pagination || {};

                setContentItems(prevData =>
                    page === 1 ? newData : [...prevData, ...newData]
                );
                setHasMoreData(
                    pagination?.total_records > page * PAGE_SIZE
                );
                if (search !== "") {
                    Analytics.loadFeedEvent(`Search: ${search}`, page)
                }
                else {
                    Analytics.loadFeedEvent("Feed", page)
                }
                setIsLoading(false)
            }
            else {
                setHasMoreData(false)
            }
        }

        catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoadingMore(false);
        }

    }



    const stripHtmlTags = (html: string) => {
        if (!html) return '';

        const removeHtmlTags = html.replace(/<\/?[^>]+(>|$)/g, '');
        const replaceHtmlEntities = removeHtmlTags.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
            const entitiesMap = {
                '&nbsp;': ' ',
                '&lt;': '<',
                '&gt;': '>',
                '&amp;': '&',
                '&quot;': '"',
                '&apos;': "'",
                '&#39;': "'",
                '&iacute;': 'í',
                '&oacute;': 'ó',
                '&eacute;': 'é',
                '&aacute;': 'á',
                '&uacute;': 'ú',
                '&ntilde;': 'ñ',
            };
            return entitiesMap[entity] || '';
        });

        return replaceHtmlEntities.replace(/\n/g, ' ').trim();
    };

    const toggleLike = async (contentId: string) => {
        try {
            const responseToggleLiked = await requestToggleLike({
                variables: {
                    input: {
                        content_id: contentId,
                        like: true
                    }
                }
            });

            if (responseToggleLiked?.data?.toggleContentLike?.success) {
                setIsLiked(!isLiked)
                fetchSpaceContentDetails(1, search ? search : "")
                setCurrentPage(1)
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };


    const redirectOnItemClick = (item: string) => {
        console.log("redirectOnItemClick", item)
        const contentIdListUpdated = contentIdList?.length !== 0 ? contentIdList : []

        //alert(contentIdListUpdated)
        contentIdListUpdated?.push(item)
        // console.log("contentIdListUpdated", contentIdListUpdated, id)
        dispatch(setContentIdList(contentIdListUpdated))
        dispatch(setContent(null))
        dispatch(setContentId(Number(item)));
        dispatch(setSpaceDashBoard(false))
        dispatch(setStartfromSpaceDashBoard(false))
        navigationService.navigate(RouteNames.Content);
    };

    const handleItemLikeClick = (item: string) => {
        toggleLike(item);
    };

    const handleItemChatClick = (id: string) => {
        navigationService.navigate(RouteNames.CommentsScreen, { commentsID: id });
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
            }
        } catch (error) {
            console.error('Error sharing content:', error);
        }
    };

    const renderFooter = () => {

        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );



    };

    const loadMoreData = () => {
        if (hasMoreData && !isLoadingMore) {
            setIsLoadingMore(true);

            fetchSpaceContentDetails(currentPage + 1, search ? search : "")
            setCurrentPage(currentPage + 1)
        }
    };

    const onSearch = async (value: string) => {

        setSearch(value)
        setIsLoading(true)
        setTimeout(() => {
            fetchSpaceContentDetails(1, value)
            setCurrentPage(1)
        }, 1000)
    }

    return (

        <View style={styles.container}>

            <Header back={true} profile={true}

            />
            <Search isSearchOnKeyboardButton={true} onSearch={onSearch} isSearchIconVisible={true} initialSearchText={search} />
            {isLoading
                ?

                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
                :

                <FlatList
                    data={contentItems}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={renderFooter}
                    renderItem={({ item }) => (
                        <View style={styles.listItems}>
                            <SearchContent
                                itemTitle={item?.content_type_info?.name}
                                title={item?.content_title}
                                spaceInfo={item?.space_info}
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
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            }



        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    },
    listContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        backgroundColor: 'white',
        marginLeft: 16,
        marginRight: 16
    },
    modalBackground: {
        width: config.getWidth(80),
        height: config.getHeight(35),
        backgroundColor: 'rgba(255, 255, 255, 0)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center'
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    listItems: {
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: commonColors.white,
    },
    modalContent: {
        backgroundColor: commonColors.white,
        width: config.getWidth(80),
        height: config.getHeight(35),
        //flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: commonColors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalSubContent: {
        flex: 1,
        alignItems: 'center',
        width: config.getWidth(78)
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
})

export default FeaturedContentListing
