// import React, { useEffect, useState } from 'react'
// import { View, Text, StyleSheet, FlatList, Share, ActivityIndicator, ScrollView, } from 'react-native'
// import config from '../../../utils/config'
// import navigationService from '@/src/navigation/navigationService';
// import RouteNames from '@/src/navigation/routes';
// import Header from '@/src/components/header';
// import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
// import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
// import { useLazyQuery, useMutation } from '@apollo/client';
// import { GET_BROWSE_CONTENT_MOBILE } from '@/src/services/QueryMethod';
// import { useDispatch, useSelector } from 'react-redux';
// import SearchContent from '@/src/components/searchContent';
// import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
// import { commonColors } from '@/src/utils/colors';
// import WebBaseLayout from '@/src/components/webBaseLayout';
// import useFetchDimention from '@/src/customHooks/customDimentionHook';


// const BrowseWeb: React.FC = (props) => {
//     const dimension = useSelector((state: any) => state.reducer.dimentions)
//     useFetchDimention();

//     const getFontSize = (size: number) => {
//         return (dimension.width / 320) * size
//     }
//     const getWidth = (width: number) => {
//         return dimension.width * (width / 100)
//     }

//     const getHeight = (height: number) => {
//         return dimension.height * (height / 100)
//     }

//     const [searchItemsData, setSearchItemsData] = useState<any[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [hasMoreData, setHasMoreData] = useState(true);
//     const [isLoadingMore, setIsLoadingMore] = useState(false);
//     const PAGE_SIZE = 10;

//     const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);

//     const [getBrowseData, { loading: searchContentLoading, error: searchContentError }] =
//         useLazyQuery(GET_BROWSE_CONTENT_MOBILE, {
//             onError: (error) => {
//                 console.error('Search content error:', error);
//                 setHasMoreData(false);
//                 setIsLoadingMore(false);
//             },
//         });

//     const dispatch = useDispatch();

//     useEffect(() => {
//         setCurrentPage(1);
//         setSearchItemsData([]);
//         setHasMoreData(true);
//         fetchSearchResults(1);
//     }, [],);

//     const fetchSearchResults = async (page) => {
//         try {
//             const response = await getBrowseData({
//                 variables: {
//                     input: {
//                         page,
//                         page_size: PAGE_SIZE,
//                     },
//                 },
//             });
//             console.log('response?.dataresponse?.data' + JSON.stringify(response?.data))
//             if (response?.data?.getBrowseData?.browseData) {
//                 const newData = response?.data?.getBrowseData?.browseData;
//                 const totalPages = response?.data?.getBrowseData?.pagination?.page_size || 1;

//                 setSearchItemsData((prevData) =>
//                     page === 1 ? newData : [...prevData, ...newData]
//                 );
//                 setHasMoreData(page < totalPages);
//                 setCurrentPage(page);
//             } else {
//                 setHasMoreData(false);
//             }
//         } catch (error) {
//             console.error('Error fetching search results:', error);
//         } finally {
//             setIsLoadingMore(false);
//         }
//     };

//     const loadMoreData = () => {
//         if (hasMoreData && !isLoadingMore) {
//             setIsLoadingMore(true);
//             fetchSearchResults(currentPage + 1);
//         }
//     };

//     const toggleLike = async (contentId: string) => {
//         try {
//             const responseToggleLiked = await requestToggleLike({
//                 variables: {
//                     input: {
//                         content_id: contentId,
//                         like: true
//                     }
//                 }
//             });

//             if (responseToggleLiked?.data?.toggleContentLike?.success) {
//                 setSearchItemsData(prevItems =>
//                     prevItems.map(item =>
//                         item.id === contentId
//                             ? { ...item, is_liked: !item.is_liked }
//                             : item
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };

//     const renderFooter = () => {
//         if (!isLoadingMore) return null;

//         return (
//             <View style={styles.footerLoader}>
//                 <ActivityIndicator size="small" />
//             </View>
//         );
//     };

//     const renderNoData = () => (
//         <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>
//                 {searchContentError
//                     ? 'Error loading results. Please try again.'
//                     : 'No data found'}
//             </Text>
//         </View>
//     );

//     const redirectOnItemClick = (item: string) => {
//         console.log('itemitemitemitem' + item);
//         dispatch(setContentId(Number(item)));
//         dispatch(setContent(null))
//         dispatch(setSpaceDashBoard(false))
//         dispatch(setStartfromSpaceDashBoard(false))
//         navigationService.navigate(RouteNames.Content, {
//             spaceDashboard: false
//         });
//     };

//     const handleItemLikeClick = (item: string) => {
//         toggleLike(item);
//     };

//     const handleItemChatClick = (id: string) => {
//         navigationService.navigate(RouteNames.CommentsScreen, { commentsID: id });
//     };

//     const handleItemShareClick = async (item: any) => {
//         try {
//             const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`;
//             const message = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`

//             const result = await Share.share({
//                 message,
//                 url: urlToShare,
//                 title: item?.content_type_info?.name,
//             });

//             if (result.action === Share.sharedAction) {
//                 console.log('Content shared successfully');
//             }
//         } catch (error) {
//             console.error('Error sharing content:', error);
//         }
//     };

//     const MainContent = (
//         <View style={[styles.container, { width: getWidth(50), padding: config.isWeb ? getWidth(1) : 0 }]}>
//             <Header
//                 profile={true}
//             />

//             {searchContentLoading ? (
//                 <ActivityIndicator />
//             ) : (searchItemsData.length === 0) ? (
//                 renderNoData()
//             ) : (
//                 <FlatList
//                     data={searchItemsData}
//                     keyExtractor={(item, index) => `${item.id}-${index}`}
//                     showsHorizontalScrollIndicator={false}
//                     showsVerticalScrollIndicator={false}
//                     onEndReached={loadMoreData}
//                     onEndReachedThreshold={0.2}
//                     ListFooterComponent={renderFooter}
//                     renderItem={({ item }) => (
//                         <View style={styles.listItems}>
//                             <SearchContent
//                                 itemTitle={item?.content_type_info?.name}
//                                 title={item?.content_title}
//                                 subtitle={stripHtmlTags(item?.description)}
//                                 is_liked={item?.is_liked}
//                                 contentIconSource={item?.content_type_info?.content_icon}
//                                 itemIconSource={item?.associated_content_files?.[0]?.thumbnail}
//                                 contentType={item?.content_type_info?.id}
//                                 onLikePress={() => handleItemLikeClick(item.id)}
//                                 onChatPress={() => handleItemChatClick(item.id)}
//                                 onSharePress={() => handleItemShareClick(item)}
//                                 onItemClick={() => redirectOnItemClick(item.id)}
//                             />
//                         </View>
//                     )}
//                     contentContainerStyle={styles.listContainer}
//                 />
//             )}
//         </View>
//     );

//     return (
//         <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: config.getHeight(100) }}>
//             <WebBaseLayout rightContent={MainContent} showSearch={false} />
//         </ScrollView>

//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f8f8',
//         marginBottom: config.getHeight(2)
//     },
//     searchContainer: {
//         padding: 14,
//         backgroundColor: '#f8f8f8',
//     },
//     listContainer: {
//         borderWidth: 1,
//         borderColor: 'gray',
//         borderRadius: 20,
//         backgroundColor: 'white',
//         marginLeft: 16,
//         marginRight: 16
//     },
//     listItems: {
//         marginTop: 16,
//         marginBottom: 16,
//         backgroundColor: commonColors.white,
//     },
//     noDataContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noDataText: {
//         marginBottom: config.getHeight(16),
//         fontSize: 18,
//         color: 'gray',
//     },
//     loader: {
//         marginTop: 10,
//     },
//     footerLoader: {
//         paddingVertical: 20,
//         alignItems: 'center',
//     },
// });

// export default BrowseWeb;














import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Share, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import config from '../../../utils/config';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import Header from '@/src/components/header';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_BROWSE_CONTENT_MOBILE } from '@/src/services/QueryMethod';
import { useDispatch, useSelector } from 'react-redux';
import SearchContent from '@/src/components/searchContent';
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
import { commonColors } from '@/src/utils/colors';
import WebBaseLayout from '@/src/components/webBaseLayout';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import Analytics from '@/src/services/Analytics';

const BrowseWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    const [searchItemsData, setSearchItemsData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [search, setSearch] = useState<string>("")

    const PAGE_SIZE = 10;
    useFetchDimention();

    const getViewWidth = (width: number) => {

        return dimension.width * (width / 100)
    }
    const getViewHeight = (height: number) => {

        return dimension.height * (height / 100)
    }

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }
    const dispatch = useDispatch();



    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);
    const [getBrowseData, { loading, error }] = useLazyQuery(GET_BROWSE_CONTENT_MOBILE, {
        onError: (error) => {
            console.error('Search content error:', error);
            setErrorMessage(error.message);
            setHasMoreData(false);
            setIsLoadingMore(false);
        },
    });

    useEffect(() => {
        fetchSearchResults(1, search ? search : "");
    }, []);

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

            if (response?.data?.getBrowseData?.browseData) {
                const newData = response?.data?.getBrowseData?.browseData;
                const pagination = response?.data?.getBrowseData?.pagination || {};

                setSearchItemsData((prevData) =>
                    page === 1 ? newData : [...prevData, ...newData]
                );
                if (search !== "") {
                    Analytics.loadFeedEvent(`Search: ${search}`, page)
                }
                else {
                    Analytics.loadFeedEvent("Feed", page)
                }

                setHasMoreData(pagination.total_records > page * PAGE_SIZE);
                setCurrentPage(page);
                setIsLoading(false);
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

    const renderFooter = () => (
        isLoadingMore ? (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        ) : null
    );

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
            const message = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`
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

    const renderError = () => (
        <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { fontSize: config.isWeb ? getFontSize(18) : 18, }]}>
                {errorMessage || 'No data found'}
            </Text>
        </View>
    );

    const onSearch = async (value: string) => {

        setSearch(value)
        setIsLoading(true)
        setTimeout(() => {
            fetchSearchResults(1, value)
            setCurrentPage(1)
        }, 1000)
    }

    const MainContent = (
        <View style={[styles.container, { width: getWidth(50), padding: config.isWeb ? dimension.width * 0.01 : 0 }]}>
            {isLoading ? (
                <ActivityIndicator />
            ) :
                (error || searchItemsData.length === 0) ? (
                    renderError()
                ) : (
                    <FlatList
                        data={searchItemsData}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
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
                )}
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getViewHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} showSearch onSearch={onSearch} leftContent={CreateGroup} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#f8f8f8',
        marginBottom: config.getHeight(2)
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

        color: 'gray',
    },
    loader: {
        marginTop: 10,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
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

export default BrowseWeb;
