
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Share, Alert, Platform } from 'react-native';
import Header from '@/src/components/header';
import Search from '@/src/components/search';
import SearchContent from '@/src/components/searchContent';
import { GET_SEARCH_CONTENT_MOBILE } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import config from '@/src/utils/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';
import { useDispatch } from 'react-redux';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import { BASE_API_URL_DEEPLINK_PROD, REMOVE_HTML_REGEX, stripHtmlTags } from '@/src/components/GlobalConstant';
import { backgroundColors, commonColors } from '@/src/utils/colors';
import Analytics from '@/src/services/Analytics';
import * as Clipboard from 'expo-clipboard';

const SearchResult: React.FC = () => {
    const [searchItemsData, setSearchItemsData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const PAGE_SIZE = 10;

    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);

    const [getContent, { loading: searchContentLoading, error: searchContentError }] =
        useLazyQuery(GET_SEARCH_CONTENT_MOBILE, {
            onError: (error) => {
                console.error('Search content error:', error);
                setHasMoreData(false);
                setIsLoadingMore(false);
            },
        });

    const route = useRoute();
    const initialSearch = route.params?.initialSearch || '';
    const dispatch = useDispatch();

    const onSearch = async (search: string) => {
        setSearchText(search);
        console.log('searchsearchsearchsearch' + search);
        if (search === '') {
            setSearchItemsData([]);
            setCurrentPage(1);
            setHasMoreData(true);
        } else {
            setCurrentPage(1);
            setSearchItemsData([]);
            setHasMoreData(true);
            fetchSearchResults(search, 1);
        }
    };

    const fetchSearchResults = async (search: string, page: number) => {
        try {
            const response = await getContent({
                variables: {
                    input: {
                        keyword: search,
                        page: page,
                        page_size: PAGE_SIZE,
                    },
                },
            });


            if (response?.data && response?.data?.getContent) {
                const newData = response?.data?.getContent?.content || [];
                const pagination = response?.data?.getContent?.pagination || {};
                setSearchItemsData(prevData =>
                    page === 1 ? newData : [...prevData, ...newData]
                );
                setHasMoreData(
                    pagination?.total_records > page * PAGE_SIZE
                );


                Analytics.loadFeedEvent(`Search: ${search}`, page)


                setCurrentPage(page);

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
        console.log('loadMoreDataloadMoreDataloadMoreData' + searchText);
        if (hasMoreData && !isLoadingMore && searchText) {
            setIsLoadingMore(true);
            fetchSearchResults(searchText, currentPage + 1);
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

    useEffect(() => {
        if (initialSearch) {
            setSearchText(initialSearch);
            onSearch(initialSearch);
            Analytics.logSearchEvent(initialSearch)
        }
    }, [initialSearch]);

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


    return (
        <View style={styles.container}>
            <Header
                profile={true}
                back={true}
            />
            <View style={styles.searchContainer}>
                <Search
                    isAutoFocus={true}
                    isSearchIconVisible={false}
                    isMicIconVisible={false}
                    onSearch={onSearch}
                    initialSearchText={searchText}
                    isSearchOnKeyboardButton={true}
                />
                {searchContentLoading && currentPage === 1 && (
                    <ActivityIndicator style={styles.loader} />
                )}
            </View>

            {searchItemsData?.length === 0 ? (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: backgroundColors.offWhite
    },
    searchContainer: {
        padding: 14,
        backgroundColor: backgroundColors.offWhite,
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
        fontFamily: 'regular',
    },
    loader: {
        marginTop: 10,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default SearchResult;
