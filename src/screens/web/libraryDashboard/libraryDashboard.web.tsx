import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, Alert, ActivityIndicator, FlatList, } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderWeb from '@/src/components/headerWeb';
import Header from '@/src/components/header';
import { useDispatch, useSelector } from 'react-redux';
import { setContentId, setCurrentTab, setSpace, setTempToken, setTempUserId, setToken, setUserId } from '@/src/redux/action';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import LogoText from '@/src/components/logoText';
import Search from '@/src/components/search';
import WebBaseLayout from '@/src/components/webBaseLayout';
import MostSearchItems from '@/src/components/mostSearchItem';
import { useQuery } from '@apollo/client';
import { GET_LIBRARY_FAVORITES_DATA, GET_SUBSCRIBED_SPACES_HUB_MOBILE } from '@/src/services/QueryMethod';
import ExpandableButton from '@/src/components/expandableButton';
import Icons from '@/src/assets/icons';
import FileDownloadService from '@/src/services/FileDownloadService';
import FeatureSpacesContainer from '@/src/components/featuredSpacesContainer';
import ChannelContainer from '@/src/components/collapsableList';
import alert from '@/src/utils/alert';



const LibraryDashboard: React.FC = (props) => {
    const dispatch = useDispatch()
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const [searchText, setSearchText] = useState('');
    const [searchItemsData, setSearchItemsData] = useState([]);
    const [featuredSpaces, setFeaturedSpaces] = useState([]);
    const [subscribedSpaces, setSubscribedSpaces] = useState<{ id: number; imageUrl: string }[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDefaultIsExpanded, setDefaultIsExpanded] = useState(true);
    const [downloadedFile, setDownloadedFile] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);

    const { data: favoritesData, loading: favoritesLoading } = useQuery(GET_LIBRARY_FAVORITES_DATA, {
        variables: {
            input: {
                page: 1,
                page_size: 10
            }
        },
        fetchPolicy: 'network-only'
    });

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

    const handleExpandToggle = (expanded: boolean) => {
        setIsExpanded(expanded);
    };

    const onSearch = async (search: string) => {
        //console.log('tttttttttttttttttt')
        navigationService.navigate(RouteNames.SearchResult, { initialSearch: search })
    }

    const handleItemClick = (item: string) => {
        onSearch(item);
    };

    // useEffect(() => {
    //     // alert(dimension.width)
    // }, [dimension]);
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    const {
        data: dashBoardData,
        loading: dashBoardDataLoading,
        error: dashBoardDataError,
        refetch: dashBoardDataRefetch
    } = useQuery(GET_SUBSCRIBED_SPACES_HUB_MOBILE)

    useEffect(() => {
        if (!dashBoardDataLoading) {
            arrangeDashboardData(dashBoardData)
        }
    }, [dashBoardDataLoading]);

    const arrangeDashboardData = (data: any) => {
        const dataSet = data?.getDashboardData?.dashboardData?.most_searched_items
        setSearchItemsData(dataSet)
        // console.log('Searched Items-->', JSON.stringify(dataSet));
        const spaces = data?.getDashboardData?.dashboardData?.featured_spaces?.map((space: { id: { toString: () => any; }; name: any; logo_path: any; }) => ({
            id: space?.id.toString(),
            text: space?.name,
            imageUrl: space?.logo_path,
        }));
        const subscribedSpaces = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces?.map((space: any) => ({
            id: space?.id,
            name: space?.name,
            imageUrl: space?.logo_path,
        }));
        setFeaturedSpaces(spaces);
        setSubscribedSpaces(subscribedSpaces);
    }


    const MostSearchedTerms = () => {
        return (
            <View style={styles.mostSearchContainer}>
                <MostSearchItems
                    title="Most searched terms"
                    searchItems={searchItemsData}
                    onItemClick={handleItemClick}
                />
            </View>
        );
    };

    const handleFeatureClick = (item: any) => {
        console.log("OnCLICKFeatureSPACES", item.id)
        dispatch(setSpace({ ...item, id: parseInt(item.id, 10) }));
        if (config.isWeb) {
            navigationService.navigate(RouteNames.SpaceDashBoard)
            dispatch(setCurrentTab("Spaces"))
        }
        else {
            navigationService.navigate(RouteNames.SpaceNavigator, { screen: RouteNames.SpaceDashBoard });
        }
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
            <Text style={[styles.emptyText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>No Featured Spaces</Text>
        </View>
    );

    const handleItemPress = (item: string) => {
        switch (item) {
            case 'Subscribed Spaces':
                // alert('Coming Soon', 'Stay tuned');
                // navigationService.navigate(RouteNames.History);
                navigationService.navigate(RouteNames.Spaces)
                // navigationService.navigate(RouteNames.SpaceNavigator)
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

                navigationService.navigate(RouteNames.Spaces)
                // navigationService.navigate(RouteNames.SpaceNavigator)
                dispatch(setCurrentTab("Spaces"))
                break;
            case 'Favorites':
                navigationService.navigate(RouteNames.Favorites);
                break;
            default:
                alert("Coming Soon", "Stay tuned for updates.");
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
                    navigationService.navigate(RouteNames.Content);
                }
                break;

            case 'Subscribed Spaces':
                const subscribedSpace = subscribedSpaces.find(space => space.id === numericId);
                if (subscribedSpace) {
                    dispatch(setSpace(subscribedSpace));
                    navigationService.navigate(RouteNames.SpaceDashBoard)
                    dispatch(setCurrentTab("Spaces"))
                }
                break;

            case 'Favorites':
                const favoriteItem = favorites.find(item => item.id === numericId);
                if (favoriteItem) {
                    dispatch(setContentId(numericId));
                    navigationService.navigate(RouteNames.Content);
                }
                break;
        }
    };

    const getDownloadedFiles = async () => {
        try {
            const fileSystemFiles = await FileDownloadService?.getAllDownloadedFiles();
            //console.log('Retrieved files from File System:', fileSystemFiles);
            const asyncFiles = await AsyncStorage?.getItem('downloadedFiles');
            const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
            //console.log('Retrieved Downloaded Files from AsyncStorage:', storedFiles);
            // Compare files based on fileId
            const filteredFiles = storedFiles.filter((asyncFile: { fileId: string; }) =>
                fileSystemFiles.some(file => file.id === asyncFile.fileId)
            );
            console.log('Filtered Downloaded Files:', filteredFiles);
            setDownloadedFile(filteredFiles);
        } catch (error) {
            console.error('Error retrieving downloaded files:', error);
        }
    };

    useEffect(() => {
        getDownloadedFiles();
    }, []);

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
            <WebBaseLayout showSearch={false} leftContent={CreateGroup}>
                <View style={[styles.container, { width: getWidth(60) }]}>
                    <View style={[styles.expandContainer, { marginVertical: isExpanded ? config.getHeight(5) : null }]}>
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
                    {/* {
                        dashBoardData?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces?.length !== 0 &&

                        !isExpanded &&
                        < View style={styles.channelList}>
                            <ChannelContainer />
                        </View>
                    } */}
                    {/* {
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
                                    <Text style={[styles.featuredTitle, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>Featured Spaces</Text>
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
                    } */}

                </View>
            </WebBaseLayout>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink'
    },
    mostSearchContainer: {
        justifyContent: 'flex-start', alignItems: 'center', marginTop: 20,
    },
    expandContainer: {
        justifyContent: 'flex-start', alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(20),
    },
    emptyText: {
        width: config.getWidth(50),
        color: '#707070',
        textAlign: 'center',
    },
    flatList: {
        paddingHorizontal: 8,
        paddingVertical: 16,

    },
    featuredTitle: {

        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
    channelList: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,

    },
    errorText: {
        color: 'red',
        fontSize: 16,
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
    createGrpButtonContainer: {
        borderWidth: 1,
        borderColor: commonColors.black,

    },
    createButtonText: {
        fontFamily: 'bold',

        color: commonColors.black,
        textAlign: 'center'
    },
    
})

export default LibraryDashboard