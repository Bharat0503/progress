import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Share, ActivityIndicator, Alert, Platform, } from 'react-native'
import config from '../../../utils/config'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import Header from '@/src/components/header';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_BROWSE_CONTENT_MOBILE } from '@/src/services/QueryMethod';
import { useDispatch } from 'react-redux';
import SearchContent from '@/src/components/searchContent';
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
import { commonColors } from '@/src/utils/colors';
import * as Clipboard from 'expo-clipboard';
import Search from '@/src/components/search';
import Analytics from '@/src/services/Analytics';


const Browse: React.FC = (props) => {
    const [searchItemsData, setSearchItemsData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const PAGE_SIZE = 10;
    const [search, setSearch] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true);

    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);

    const [getBrowseData, { loading: searchContentLoading, error: searchContentError }] =
        useLazyQuery(GET_BROWSE_CONTENT_MOBILE, {
            onError: (error) => {
                console.error('Search content error:', error);
                setHasMoreData(false);
                setIsLoadingMore(false);
            },
        });

    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentPage(1);
        setSearchItemsData([]);
        // setHasMoreData(true);
        fetchSearchResults(1, search ? search : "");
    }, [],);

    const fetchSearchResults = async (page: number, search: string) => {
        try {
            let input = {}
            if (search !== "") {
                input = {
                    page,
                    page_size: PAGE_SIZE,
                    keyword: search
                }
            }
            else {
                input = {
                    page,
                    page_size: PAGE_SIZE,
                }
            }
            const response = await getBrowseData({
                variables: {
                    input: input,
                },
            });
            console.log('response?.dataresponse?.data' + JSON.stringify(response?.data))
            if (response?.data?.getBrowseData?.browseData) {
                const newData = response?.data?.getBrowseData?.browseData;
                // const totalPages = response?.data?.getBrowseData?.pagination?.page_size || 1;

                const pagination = response?.data?.getBrowseData?.pagination || {};



                setSearchItemsData((prevData) =>
                    page === 1 ? newData : [...prevData, ...newData]
                );
                // setHasMoreData(page < totalPages);
                setHasMoreData(
                    pagination?.total_records > page * PAGE_SIZE
                );

                if (search !== "") {
                    Analytics.loadFeedEvent(`Search: ${search}`, page)
                }
                else {
                    Analytics.loadFeedEvent("Feed", page)
                }

                setCurrentPage(page);
                setIsLoading(false)
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const loadMoreData = () => {
        if (hasMoreData && !isLoadingMore) {
            setIsLoadingMore(true);
            fetchSearchResults(currentPage + 1, search ? search : "");
            setCurrentPage(currentPage + 1);
        }
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
                setSearchItemsData(prevItems =>
                    prevItems.map(item =>
                        item.id === contentId
                            ? { ...item, is_liked: !item.is_liked }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling like:', error);
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

    const renderNoData = () => (
        <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
                {searchContentError
                    ? 'Error loading results. Please try again.'
                    : 'No data found'}
            </Text>
        </View>
    );

    const redirectOnItemClick = (item: string) => {
        console.log('itemitemitemitem' + item);
        dispatch(setContentId(Number(item)));
        dispatch(setContent(null))
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


    const onSearch = async (value: string) => {

        setSearch(value)
        setIsLoading(true)
        setTimeout(() => {
            fetchSearchResults(1, value)
            setCurrentPage(1)
        }, 1000)



    }
    return (
        <View style={styles.container}>
            <Header
                profile={true}
            />
            <Search isSearchOnKeyboardButton={true} onSearch={onSearch} isSearchIconVisible={true} initialSearchText={search} />

            {isLoading
                ?

                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
                :
                searchItemsData.length === 0 ? (
                    renderNoData()
                ) : (
                    <FlatList
                        data={searchItemsData}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
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
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        marginBottom: config.getHeight(2),
        justifyContent: 'flex-start', alignItems: 'center'
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    searchContainer: {
        padding: 14,
        backgroundColor: '#f8f8f8',
    },
    listContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        backgroundColor: 'white',
        marginLeft: 16,
        marginRight: 16
    },
    listItems: {
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: commonColors.white,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        marginBottom: config.getHeight(16),
        fontSize: 18,
        color: 'gray',
    },
    loader: {
        marginTop: 10,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});


export default Browse;
