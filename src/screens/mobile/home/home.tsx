import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator, ScrollView, Linking } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import Header from '@/src/components/header';
import { useDispatch } from 'react-redux';
import { setContent, setContentId, setCurrentTab, setLoading, setSpace, setSpaceDashBoard, setStartfromSpaceDashBoard, setTempToken, setTempUserId, setToken, setUserId } from '@/src/redux/action';
import Search from '@/src/components/search';
import SearchClick from '@/src/components/searchClick';
import MostSearchItems from '@/src/components/mostSearchItem';
import { useLazyQuery, useQuery } from '@apollo/client';
import FeatureSpacesContainer from '@/src/components/featuredSpacesContainer';
import { GET_CHANNEL_LIST, GET_LIBRARY_FAVORITES_DATA, GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE, GET_SUBSCRIBED_SPACES_HUB_HOME, GET_SUBSCRIBED_SPACES_HUB_MOBILE } from '@/src/services/QueryMethod';
import ChannelContainer from '@/src/components/collapsableList';
import ExpandableButton from '@/src/components/expandableButton';
import Icons from '@/src/assets/icons';
import FileDownloadService from '@/src/services/FileDownloadService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';
import Analytics from '@/src/services/Analytics';

const Home: React.FC = (props) => {
    const dispatch = useDispatch()
    const [searchItemsData, setSearchItemsData] = useState([]);
    const [featuredSpaces, setFeaturedSpaces] = useState([]);
    const [subscribedSpaces, setSubscribedSpaces] = useState<any>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const [isDefaultIsExpanded, setDefaultIsExpanded] = useState(false);
    const [downloadedFile, setDownloadedFile] = useState<any[]>([]);
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [favorites, setFavorites] = useState<any[]>([]);
    const deepLinkHandledRef = useRef(false);


    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [spaceCount, setSpaceCount] = useState<number>()

    const PAGE_SIZE = 10;
    const [getSubSpaces] = useLazyQuery(GET_SUBSCRIBED_SPACES_HUB_HOME, {
        fetchPolicy: "network-only", // Forces refetching
        //fetchPolicy: "no-cache",
    })
    // const { refetch: getSubSpaces } = useQuery(GET_SUBSCRIBED_SPACES_HUB_HOME, {
    //     variables: {
    //         inpput: {
    //             page: currentPage,
    //             page_size: PAGE_SIZE
    //         }
    //     },
    //     fetchPolicy: "network-only", // Forces refetching
    //     //fetchPolicy: "no-cache",
    // })

    const { data: favoritesData, loading: favoritesLoading } = useQuery(GET_LIBRARY_FAVORITES_DATA, {
        variables: {
            input: {
                page: 1,
                page_size: 10
            }
        },
        fetchPolicy: 'network-only'
    });





    const {
        data: dashBoardData,
        loading: dashBoardDataLoading,
        error: dashBoardDataError,
        refetch: dashBoardDataRefetch
    } = useQuery(GET_SUBSCRIBED_SPACES_HUB_MOBILE)


    useEffect(() => {
        const init = async () => {


            const subSpacesRes = await getSubSpaces({
                variables: {
                    input: {
                        page: 1,
                        page_size: PAGE_SIZE,
                        sort_option: "Alphabetically A-Z"
                    }
                }
            })

            fetchSubSpaces(subSpacesRes, 1)
        }

        init()
        // }
    }, [])


    useEffect(() => {
        if (favoritesData) {
            const favoriteItems = favoritesData?.getMyLibraryData?.libraryData?.favourites?.data || [];
            setFavorites(favoriteItems.map((item: any) => ({
                id: item.id,
                image: item.associated_content_files?.[0]?.thumbnail || '',
                title: item.content_title
            })));
        }
    }, [favoritesData]);

    useEffect(() => {
        const handleDeepLink = async (event: { url: string }) => {
            // Only process if coming directly from a deep link
            if (deepLinkHandledRef.current) return;

            console.log('Deep Link URL:', event.url);
            const targetDomain = "staycurrentmd.com";
            const urlObj = new URL(event.url);
            const contentId = Number(urlObj.searchParams.get('id'));

            if (!isNaN(contentId) && contentId !== 0) {
                const token = await getAsyncData(keys.userToken);
                if (token) {
                    // Mark deep link as handled across the session
                    dispatch(setContentId(contentId));
                    dispatch(setContent(null));
                    dispatch(setSpaceDashBoard(false));
                    dispatch(setStartfromSpaceDashBoard(false));

                    if (event.url.includes(targetDomain)) {
                        deepLinkHandledRef.current = true;
                        navigationService.navigate(RouteNames.Content, {
                            contentId: contentId,
                        });
                    }
                }
            } else {
                console.error('Invalid contentId in deep link');
            }
        };

        const checkInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                handleDeepLink({ url: initialUrl });
            }
        };

        // Only check the initial URL when the app is opened from a deep link
        checkInitialURL();

        // Add listener for deep linking events
        const unsubscribe = Linking.addEventListener('url', handleDeepLink);

        return () => {
            unsubscribe.remove();
        };
    }, []);




    const handleExpandToggle = (expanded: boolean) => {
        setIsExpanded(expanded);
    };

    const expandedData = [
        {
            id: 'Downloads',
            items: downloadedFile?.map(file => ({
                id: file?.fileId,
                image: file?.cardData?.imageSource
            }))
        },
        {
            id: 'Favorites',
            items: favorites.map(item => ({
                id: item.id,
                image: item.image
            }))
        },
        {
            id: 'Subscribed Spaces',
            items: subscribedSpaces?.map(space => ({
                id: space?.id,
                image: space?.imageUrl
            }))
        },
    ];

    const collapsedData = [
        {
            id: '1', items:
                [
                    { name: 'Downloads', icon: Icons.downloadContents },
                    { name: 'Favorites', icon: Icons.favoriteContents },
                    { name: 'My Directory', icon: Icons.myDirectory },
                    { name: 'Subscribed Spaces', icon: Icons.myCollections },

                ]
        }
    ];

    const fetchSubSpaces = async (subSpacesRes: any, page: number) => {
        if (subSpacesRes?.data?.getDashboardData?.success) {

            const newData = subSpacesRes?.data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces;
            const pagination = subSpacesRes?.data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.pagination || {};
            let subscribedSpaces = newData.map((space: any) => ({
                id: space?.id,
                name: space?.name,
                imageUrl: space?.logo_path,
                color: space.color,
            }));
            console.log("subscribedSpaces", subscribedSpaces)

            setSubscribedSpaces(prevData =>
                page === 1 ? subscribedSpaces : [...prevData, ...subscribedSpaces]
            );


            setHasMoreData(
                pagination?.total_records > pagination?.page * PAGE_SIZE
            );

            setSpaceCount(pagination?.total_records)
            setIsLoading(false)
        }
        else {
            setIsLoading(false)
        }

        setIsLoadingMore(false);
    }

    useEffect(() => {
        if (!dashBoardDataLoading) {
            arrangeDashboardData(dashBoardData)
        }
        else {
            setIsLoading(true)
        }
    }, [dashBoardDataLoading]);


    const onSearch = async (search: string) => {
        navigationService.navigate(RouteNames.SearchResult, { initialSearch: search })
    }

    const handleItemClick = (item: string) => {
        onSearch(item);
    };

    const handleFeatureClick = (item: any) => {
        // console.log("OnCLICKFeatureSPACES", item.id)
        dispatch(setSpace({ ...item, id: parseInt(item.id, 10) }));
        navigationService.navigate(RouteNames.SpaceNavigator, { screen: RouteNames.SpaceDashBoard });
    }

    const arrangeDashboardData = (data: any) => {
        const dataSet = data?.getDashboardData?.dashboardData?.most_searched_items
        setSearchItemsData(dataSet)
        const spaces = data?.getDashboardData?.dashboardData?.featured_spaces?.map((space: { id: { toString: () => any; }; name: any; logo_path: any; }) => ({
            id: space?.id.toString(),
            text: space?.name,
            imageUrl: space?.logo_path,
        }));
        setFeaturedSpaces(spaces);
        setIsLoading(false)
    }


    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleFeatureClick(item)}>
            <FeatureSpacesContainer
                text={item?.text}
                imageUrl={item?.imageUrl}
                backgroundColor={item?.backgroundColor}
            />
        </TouchableOpacity>
    );

    const EmptyComp = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Featured Spaces</Text>
        </View>
    );

    const handleItemPress = (item: string) => {
        switch (item) {
            case 'Subscribed Spaces':
                navigationService.reset([{ name: RouteNames.SpaceNavigator }]);
                dispatch(setCurrentTab("Spaces"))
                break;
            case 'Downloads':
                navigationService.navigate(RouteNames.Downloads);
                break;
            case 'Favorites':
                navigationService.navigate(RouteNames.Favorites);
                break;
            case 'My Directory':
                navigationService.navigate(RouteNames.MyDirectory);
                break;
            default:
                break;
        }
    };

    const handleTextClick = (sectionId: string) => {
        switch (sectionId) {
            case 'Downloads':
                navigationService.navigate(RouteNames.Downloads);
                break;
            case 'Subscribed Spaces':
                navigationService.navigate(RouteNames.SpaceNavigator);
                break;
            case 'Favorites':
                navigationService.navigate(RouteNames.Favorites);
                break;
            default:
                Alert.alert("Coming Soon", "Stay tuned for updates.");
                break;
        }
    };





    const handleListItemClick = (sectionId: string, itemId: string) => {
        const numericId = parseInt(itemId, 10);

        switch (sectionId) {
            case 'Downloads':
                const downloadedFiles = downloadedFile.find(file => file.fileId === itemId);
                if (downloadedFiles) {
                    dispatch(setContentId(downloadedFiles?.id));
                    dispatch(setContent(null))
                    navigationService.navigate(RouteNames.Content);
                }
                break;

            case 'Subscribed Spaces':
                const subscribedSpace = subscribedSpaces.find(space => space.id === numericId);
                if (subscribedSpace) {
                    dispatch(setSpace(subscribedSpace));
                    navigationService.navigate(RouteNames.SpaceNavigator, {
                        screen: RouteNames.SpaceDashBoard
                    });
                }
                break;

            case 'Favorites':
                const favoriteItem = favorites.find(item => item.id === numericId);
                if (favoriteItem) {
                    dispatch(setContentId(numericId));
                    dispatch(setContent(null))
                    navigationService.navigate(RouteNames.Content);
                }
                break;
        }
    };

    const getDownloadedFiles = async () => {
        try {
            const fileSystemFiles = await FileDownloadService.getAllDownloadedFiles();
            //console.log('Retrieved files from File System:', fileSystemFiles);
            const asyncFiles = await AsyncStorage.getItem('downloadedFiles');
            const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
            //console.log('Retrieved Downloaded Files from AsyncStorage:', storedFiles);
            // Compare files based on fileId
            const filteredFiles = storedFiles.filter((asyncFile: { fileId: string; }) =>
                fileSystemFiles.some(file => file.id === asyncFile.fileId)
            );
            //console.log('Filtered Downloaded Files:', filteredFiles);
            setDownloadedFile(filteredFiles);
        } catch (error) {
            console.error('Error retrieving downloaded files:', error);
        }
    };

    useEffect(() => {
        getDownloadedFiles();
    }, [downloadedFile]);

    const seeMoreClick = async () => {
        console.log("currentPage", currentPage)
        if (hasMoreData && !isLoadingMore) {

            setIsLoadingMore(true);

            const subSpacesRes = await getSubSpaces({
                variables: {
                    input: {
                        page: currentPage + 1,
                        page_size: PAGE_SIZE,
                        sort_option: "Alphabetically A-Z"
                    }
                }
            })

            fetchSubSpaces(subSpacesRes, currentPage + 1)
            setCurrentPage(currentPage + 1)
        }
    }



    return (
        <View style={styles.container}>
            <Header profile={true} />
            {
                isLoading
                    ?
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator />
                    </View>
                    :
                    <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>



                        {!isExpanded ? (
                            <View style={styles.searchContainer}>
                                <SearchClick onSearch={onSearch} />
                            </View>
                        ) : null}
                        {!isExpanded ?
                            searchItemsData?.length !== 0 ?
                                <View style={styles.mostSearchContainer}>
                                    <MostSearchItems
                                        title="Most searched terms"
                                        searchItems={searchItemsData}
                                        onItemClick={handleItemClick}
                                    />
                                </View>
                                : null
                            : null}
                        <View style={[styles.expandContainer, { marginVertical: isExpanded ? config.getHeight(5) : null, marginTop: searchItemsData?.length === 0 ? 20 : null, }]}>
                            <ExpandableButton
                                title="My Library"
                                data={isExpanded ? expandedData : collapsedData}
                                onPressExpandIcon={handleExpandToggle}
                                isDefaultIsExpanded={isDefaultIsExpanded}
                                isAllowExpandCollaps={true}
                                isExpandTopView={isExpanded}
                                onItemPress={handleItemPress}
                                onTextClick={handleTextClick}
                                onListItemPress={(sectionId, itemId) => handleListItemClick(sectionId, itemId)}
                            />
                        </View>
                        {
                            subscribedSpaces.length !== 0 &&

                            !isExpanded &&
                            < View style={styles.channelList}>
                                    <ChannelContainer subscribedSpaces={subscribedSpaces} isLoadingMore={isLoadingMore} seeMoreClick={seeMoreClick} spaceCount={spaceCount} />
                            </View>
                        }
                        {

                            dashBoardData?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces?.length === 0 &&
                            // If no subscribed hubs
                            !isExpanded &&
                            <>

                                {dashBoardDataLoading ? (
                                    <View style={{ alignSelf: 'center' }}>
                                        <ActivityIndicator />
                                    </View>
                                ) : (
                                    <View style={{}}>
                                        <Text style={styles.featuredTitle}>Featured Spaces</Text>
                                        <FlatList
                                            scrollEnabled={false}
                                            data={featuredSpaces}
                                            renderItem={renderItem}
                                            keyExtractor={(item) => item.id}
                                            numColumns={3}
                                            contentContainerStyle={styles.flatList}
                                            ListEmptyComponent={EmptyComp}
                                        />
                                    </View>
                                )}
                            </>
                        }

                    </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColors.offWhite
        // justifyContent: 'flex-start', alignItems: 'center'
        //alignItems: 'center'
    },
    searchContainer: {
        justifyContent: 'flex-start', alignItems: 'center', marginTop: config.getHeight(2),
    },
    mostSearchContainer: {
        justifyContent: 'flex-start', alignItems: 'center', marginTop: 20,
        // backgroundColor: 'pink'
    },
    expandContainer: {
        justifyContent: 'flex-start', alignItems: 'center',
    },
    logoutText: {
        color: commonColors.white,
        fontSize: config.isWeb ? config.generateFontSizeNew(3.5) : config.generateFontSizeNew(18),
        fontFamily: 'regular',
        zIndex: -1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    logoutTextContainer: {
        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -2,
        width: config.isWeb ? config.getWidth(8) : config.getWidth(40),
        height: config.isWeb ? config.getHeight(5) : config.getHeight(7),
        backgroundColor: backgroundColors.signInButton,
        marginTop: config.getHeight(4),
        marginBottom: config.getHeight(4)
    },
    flatList: {
        paddingHorizontal: 14,
        paddingVertical: 14,

    },
    featuredTitle: {
        fontSize: config.generateFontSizeNew(16),
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
    channelList: {
        justifyContent: 'flex-start',
        alignItems: 'center', marginTop: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(20),
    },
    emptyText: {
        width: config.getWidth(50),
        fontSize: config.generateFontSizeNew(16),
        color: '#707070',
        textAlign: 'center',
    },
    mainContainer: {
        // flex: 1,
        // padding: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#707070',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
})

export default Home
