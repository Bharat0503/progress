import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Share, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import Header from '@/src/components/header';
import Search from '@/src/components/search';
import SearchContent from '@/src/components/searchContent';
import { GET_SEARCH_CONTENT_MOBILE } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import config from '@/src/utils/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { setContentId } from '@/src/redux/action';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
import WebBaseLayout from '@/src/components/webBaseLayout';
import Analytics from '@/src/services/Analytics';
import Icons from '@/src/assets/icons';
import * as Clipboard from 'expo-clipboard';
import { commonColors } from '@/src/utils/colors';

const SearchResultWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }
    const [searchItemsData, setSearchItemsData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
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
        if (search === '') {
            setSearchItemsData([]);
            setCurrentPage(1);
            setHasMoreData(true);
            setSearchPerformed(false);
        } else {
            setCurrentPage(1);
            setSearchItemsData([]);
            setHasMoreData(true);
            setSearchPerformed(true);
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

            if (response?.data?.getContent) {
                const newData = response.data.getContent.content || [];
                const totalRecords = response.data.getContent.pagination?.total_records || 0;

                setSearchItemsData(prevData =>
                    page === 1 ? newData : [...prevData, ...newData]
                );

                // Check if we have more data to load
                const currentTotal = page * PAGE_SIZE;
                setHasMoreData(totalRecords > currentTotal);

                Analytics.loadFeedEvent(`Search: ${search}`, page)

                // If no data returned, explicitly set hasMoreData to false
                if (newData.length === 0) {
                    setHasMoreData(false);
                }
            } else {
                // If response structure is invalid, assume no more data
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setHasMoreData(false);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const loadMoreData = () => {
        // Only load more if we're not already loading, have more data, and have search text
        if (!searchContentLoading &&
            hasMoreData &&
            !isLoadingMore &&
            searchText &&
            searchItemsData.length > 0) {
            setIsLoadingMore(true);
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchSearchResults(searchText, nextPage);
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
            setSearchPerformed(true);
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

    const renderNoData = () => {
        if (!searchPerformed) {
            return <EmptyComp />;
        }

        return (
            <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                    {searchContentError
                        ? searchContentError.message
                        : 'No data found'}
                </Text>
            </View>
        );
    };

    const redirectOnItemClick = (item: string) => {
        dispatch(setContentId(Number(item)));
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
            const message = ``

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

    const EmptyComp = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={Icons.search}
                style={[styles.searchIcon, {
                    width: getWidth(5),
                    height: getWidth(5),
                }]}
                resizeMode='contain'
            />
            <Text style={[styles.emptyText, {
                paddingHorizontal: getWidth(5),
                fontSize: getFontSize(4),
            }]}>
                {'To start your search, \n enter the characters.'}
            </Text>
        </View>
    );

    const CreateGroup = (
        <TouchableOpacity
            style={[styles.createGrpButtonContainer, {
                paddingHorizontal: getWidth(3),
                paddingVertical: getHeight(0.5),
                borderRadius: getWidth(5),
                marginTop: getHeight(4),
            }]}
            onPress={() => navigationService.navigate(RouteNames.SpaceCreation)}
        >
            <Text style={[styles.createButtonText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(13) }]}>
                {'Are you interested in a space?'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout showSearch onSearch={onSearch} searchText={searchText} leftContent={CreateGroup}>
                <View style={[styles.container, { width: getWidth(60) }]}>
                    <View style={styles.searchContainer}>
                        {searchContentLoading && currentPage === 1 && (
                            <ActivityIndicator style={styles.loader} />
                        )}
                    </View>
                    {searchItemsData.length === 0 && !searchContentLoading ? (
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
                                        subtitle={item?.description}
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
            </WebBaseLayout>
        </ScrollView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'pink',
    },
    searchContainer: {
        padding: 14,
        //backgroundColor: '#f8f8f8',
    },
    listContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        margin: 16,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    listItems: {
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    noDataText: {
        marginBottom: config.getHeight(16),
        fontSize: 18,
        color: 'gray',
        fontFamily: 'regular',
        textAlign: 'center'
    },
    loader: {
        marginTop: 10,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(20),
    },
    searchIcon: {
        marginBottom: config.getHeight(1),
    },
    emptyText: {
        color: '#707070',
        textAlign: 'center',
    },
    createGrpButtonContainer: {
        borderWidth: 1,
        borderColor: commonColors.black,

    },
    createButtonText: {
        fontFamily: 'bold',

        color: commonColors.black,
        textAlign: 'center'
    },
});

export default SearchResultWeb;