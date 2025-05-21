// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Alert, ScrollView } from 'react-native';
// import { SearchBar } from '@/src/components/searchbar';
// import HeaderBack from '@/src/components/headerBack';
// import config from '../../../utils/config';
// import { borderColors, commonColors } from '@/src/utils/colors';
// import Icons from '@/src/assets/icons';
// import { Menu, MenuItem } from 'react-native-material-menu';
// import { GET_CONTENT_DETAILS_BY_ID_MOBILE, GET_LIBRARY_FAVORITES_DATA } from '@/src/services/QueryMethod';
// import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
// import { useDispatch, useSelector } from 'react-redux';
// import { setContentId } from '@/src/redux/action';
// import navigationService from '@/src/navigation/navigationService';
// import RouteNames from '@/src/navigation/routes';
// import { TOGGLE_CONTENT_FAV, TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
// import ContentCard from './contentCard';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FileDownloadService from '@/src/services/FileDownloadService';
// import WebBaseLayout from '@/src/components/webBaseLayout';
// import useFetchDimention from '@/src/customHooks/customDimentionHook';
// import alert from '@/src/utils/alert';

// const FavoritesWeb: React.FC = () => {
//     const dimension = useSelector((state: any) => state.reducer.dimentions)
//     useFetchDimention();
//     const [searchQuery, setSearchQuery] = useState('');
//     const [page, setPage] = useState(1);
//     const [hasMoreData, setHasMoreData] = useState(true);
//     // console.log(`Has More Data?`, hasMoreData);
//     const PAGE_SIZE = 10;
//     const [allFavorites, setAllFavorites] = useState<any[]>([]);
//     const [downloadingId, setDownloadingId] = useState<number | null>(null);
//     const [downloadProgress, setDownloadProgress] = useState(0);
//     const [isDownloading, setIsDownloading] = useState(false);
//     const [downloadedFile, setDownloadedFile] = useState<any>();
//     const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
//     const [selectedContentData, setSelectedContentData] = useState();
//     const [isLiked, setIsLiked] = useState(false);
//     const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);
//     const prevContentIdRef = useRef<number | null>(null);

//     const getFontSize = (size: number) => {
//         return (dimension.width / 320) * size
//     }
//     const getWidth = (width: number) => {
//         return dimension.width * (width / 100)
//     }

//     const getHeight = (height: number) => {
//         return dimension.height * (height / 100)
//     }

//     const [fetchContentDetails, { data: contentData, loading: contentLoading, error: contentError }] =
//         useLazyQuery(GET_CONTENT_DETAILS_BY_ID_MOBILE);

//     const getQueryVariables = (pageNum: number, search?: string) => {
//         const variables: any = {
//             input: {
//                 page: pageNum,
//                 page_size: PAGE_SIZE,
//             }
//         };
//         // Only add keyword if search query exists
//         if (search) {
//             variables.input.keyword = search;
//         }
//         return variables;
//     };

//     const { loading, error, refetch } = useQuery(GET_LIBRARY_FAVORITES_DATA, {
//         variables: getQueryVariables(1),
//         fetchPolicy: 'network-only',
//         onCompleted: (data) => {
//             const newData = data?.getMyLibraryData?.libraryData?.favourites?.data || [];
//             const totalPages = data?.getMyLibraryData?.libraryData?.favourites?.total_pages || 1;
//             console.log(`Initial Data Loaded:`, newData);
//             // console.log(`Total Pages:`, totalPages);
//             setAllFavorites(newData);
//             //setHasMoreData(page < totalPages);
//             setHasMoreData(newData.length === PAGE_SIZE);
//         },
//     });

//     const [searchFavorites, {
//         loading: searchLoading,
//         error: searchError,
//         data: searchData
//     }] = useLazyQuery(GET_LIBRARY_FAVORITES_DATA, {
//         onCompleted: (data) => {
//             const newData = data?.getMyLibraryData?.libraryData?.favourites?.data || [];
//             const totalPages = data?.getMyLibraryData?.libraryData?.favourites?.total_pages || 1;

//             setAllFavorites(newData);
//             setHasMoreData(1 < totalPages);
//         }
//     });

//     const handleSearch = useCallback((query: string) => {
//         setSearchQuery(query);
//         setPage(1);

//         if (query) {
//             searchFavorites({
//                 variables: getQueryVariables(1, query)
//             });
//         } else {
//             // If search is cleared, refetch original data
//             refetch(getQueryVariables(1));
//         }
//     }, [searchFavorites, refetch]);

//     const loadMoreData = useCallback(async () => {
//         if (!hasMoreData || loading || searchLoading) return;
//         // console.log('Pagination Triggered: Fetching more data...');
//         const nextPage = page + 1;
//         try {
//             const result = await refetch(getQueryVariables(nextPage, searchQuery));
//             const newData = result.data?.getMyLibraryData?.libraryData?.favourites?.data || [];
//             const totalPages = result.data?.getMyLibraryData?.libraryData?.favourites?.total_pages || 1;
//             // console.log(`Loaded Page ${nextPage}:`, newData.length);
//             // console.log(`Total Pages Available:`, totalPages);
//             setAllFavorites(prev => [...prev, ...newData]);
//             setHasMoreData(nextPage < totalPages);
//             setPage(nextPage);
//         } catch (err) {
//             console.error('Error loading more data:', err);
//         }
//     }, [page, hasMoreData, loading, searchLoading, searchQuery, refetch]);

//     const handleLoadMore = () => {
//         if (!hasMoreData) {
//             // console.log('No more pages to load.');
//             return;
//         }
//         // console.log(`Requesting Page ${page + 1}...`);
//         loadMoreData();
//     };

//     const handleRefresh = useCallback(async () => {
//         try {
//             const result = await refetch(getQueryVariables(1, searchQuery || undefined));
//             const newData = result.data?.getMyLibraryData?.libraryData?.favourites?.data || [];
//             const totalPages = result.data?.getMyLibraryData?.libraryData?.favourites?.total_pages || 1;

//             setPage(1);
//             setAllFavorites(newData);
//             setHasMoreData(1 < totalPages);
//         } catch (err) {
//             console.error('Error refreshing data:', err);
//         }
//     }, [refetch, searchQuery]);

//     const renderError = () => (
//         <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>
//                 {(error || searchError)?.message || 'An error occurred'}
//             </Text>
//             <TouchableOpacity
//                 style={styles.retryButton}
//                 onPress={handleRefresh}
//             >
//                 <Text style={[styles.retryText,{ fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),}]}>Retry</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     // if (error || searchError) return renderError();

//     const favorites = searchQuery ?
//         searchData?.getMyLibraryData?.libraryData?.favourites?.data || [] :
//         allFavorites;

//     const getDownloadedFiles = async () => {
//         try {
//             const fileSystemFiles = await FileDownloadService.getAllDownloadedFiles();
//             //console.log('Retrieved files from File System:', fileSystemFiles);
//             const asyncFiles = await AsyncStorage.getItem('downloadedFiles');
//             const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
//             //console.log('Retrieved Downloaded Files from AsyncStorage:', storedFiles);
//             // Compare files based on fileId
//             const filteredFiles = storedFiles.filter((asyncFile: { fileId: string; }) =>
//                 fileSystemFiles.some(file => file.id === asyncFile.fileId)
//             );
//             console.log('Filtered Downloaded Files:', filteredFiles);
//             setDownloadedFile(filteredFiles);
//         } catch (error) {
//             console.error('Error retrieving downloaded files:', error);
//         }
//     };

//     const handleDeleteFile = async (fileId: string) => {
//         alert(
//             "Delete Download",
//             "Are you sure you want to remove this file?",
//             [
//                 { text: "Cancel", style: "cancel" },
//                 {
//                     text: "Delete",
//                     onPress: async () => {
//                         try {
//                             const existingDownloads = await AsyncStorage.getItem('downloadedFiles');
//                             let downloadsArray = existingDownloads ? JSON.parse(existingDownloads) : [];
//                             const updatedDownloads = downloadsArray.filter((file: { fileId: string }) => file.fileId !== fileId);
//                             await AsyncStorage.setItem('downloadedFiles', JSON.stringify(updatedDownloads));
//                             await FileDownloadService.deleteDownloadedFile(fileId);
//                             // console.log('File deleted successfully:', fileId);
//                             await getDownloadedFiles();
//                         } catch (error) {
//                             console.error('Error deleting file:', error);
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     useEffect(() => {
//         getDownloadedFiles();
//     }, []);

//     const handleDownload = (contentId: number, item: any) => {
//         // console.log('Item in handleDownload-->', item);
//         setSelectedContentId(contentId);
//         setSelectedContentData(item);
//         setDownloadingId(contentId);
//         fetchContentDetails({ variables: { input: { content_id: contentId } } });
//     };

//     useEffect(() => {
//         // console.log('Recurring-->');
//         if (contentData && selectedContentId && prevContentIdRef.current !== selectedContentId) {
//             prevContentIdRef.current = selectedContentId;
//             const fileUrl = contentData?.getContentInfoById?.contentInfo?.associated_content_files[0]?.file;
//             if (!fileUrl) {
//                 alert("Error", "No file available for download.");
//                 setDownloadingId(null);
//                 return;
//             }
//             type FileType = "video" | "image" | "pdf";
//             const typeMap: Record<string, FileType> = {
//                 Podcast: "video",
//                 Infographic: "image",
//                 Guideline: "pdf",
//                 Video: "video",
//             };
//             const type: FileType = typeMap[contentData?.getContentInfoById?.contentInfo?.content_type_info?.name as keyof typeof typeMap] || "pdf";
//             FileDownloadService.downloadFile(
//                 fileUrl,
//                 type,
//                 `${contentData?.getContentInfoById?.contentInfo?.content_type_info?.name}_${selectedContentId}`,
//                 (progress) => setDownloadProgress(progress)
//             ).then(async (downloadedFile) => {
//                 if (downloadedFile) {
//                     console.log('Downloaded File:', downloadedFile);
//                     await saveFileToStorage(downloadedFile);
//                 }
//                 setDownloadingId(null);
//                 setDownloadProgress(0);
//             }).catch(() => {
//                 setDownloadingId(null);
//                 setDownloadProgress(0);
//             });
//         }
//     }, [contentData, selectedContentId]);

//     const saveFileToStorage = async (downloadedFile: any) => {
//         try {
//             if (!downloadedFile) return;
//             const contentInfo = contentData?.getContentInfoById?.contentInfo;
//             if (!contentInfo) return;

//             // Create JSON structure for saving
//             const fileData = {
//                 id: selectedContentId,
//                 name: contentInfo?.content_type_info?.name,
//                 title: contentInfo?.content_title,
//                 description: contentInfo?.description,
//                 icon: contentInfo?.content_type_info?.content_icon,
//                 localPath: downloadedFile.uri,
//                 type: downloadedFile.type,
//                 fileId: downloadedFile.id,
//                 downloadDate: new Date().toISOString(),
//                 cardData: {
//                     type: contentInfo?.content_type_info?.name,
//                     title: contentInfo?.content_title,
//                     views: contentInfo?.total_likes,
//                     imageSource: contentInfo?.associated_content_files[0]?.thumbnail,
//                     org: contentInfo?.description,
//                 }
//             };
//             // console.log('File saved to storage:', fileData);
//             // Retrieve existing downloads
//             const existingDownloads = await AsyncStorage.getItem('downloadedFiles');
//             let downloadsArray = existingDownloads ? JSON.parse(existingDownloads) : [];
//             downloadsArray.push(fileData);
//             await AsyncStorage.setItem('downloadedFiles', JSON.stringify(downloadsArray));
//             console.log('File saved to storage:', fileData);
//             await getDownloadedFiles();
//         } catch (error) {
//             console.error('Error saving file to storage:', error);
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
//                 console.log('Success toggling like:', responseToggleLiked?.data?.toggleContentLike?.success);

//                 setAllFavorites(prevItems =>
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

//     const MainContent = (
//         <View style={[styles.subcontainer,{width: getWidth(60)}]}>
//             {(loading || searchLoading) && <ActivityIndicator />}
//             {/* {(error || searchError) && renderError()} */}
//             <FlatList
//                 data={favorites}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => {
//                     const isDownloaded = Array.isArray(downloadedFile) && downloadedFile.some((file) => file.id === item.id);
//                     const downloadedFileData = isDownloaded ? downloadedFile.find((file) => file.id === item.id) : null;
//                     return (
//                         <ContentCard
//                             item={item}
//                             refetch={handleRefresh}
//                             isDownloaded={isDownloaded}
//                             onDownloadPress={() =>
//                                 isDownloaded && downloadedFileData
//                                     ? handleDeleteFile(downloadedFileData.fileId)
//                                     : handleDownload(item.id, item)
//                             }
//                             onLikedPress={() => toggleLike(item.id)}
//                             isLoading={downloadingId === item.id}
//                             progress={downloadingId === item.id ? downloadProgress : 0}
//                         />
//                     );
//                 }}
//                 contentContainerStyle={[
//                     styles.listContainer,
//                     favorites.length === 0 && { flex: 1 },
//                 ]}
//                 showsVerticalScrollIndicator={false}
//                 onEndReached={handleLoadMore}
//                 onEndReachedThreshold={0.3}
//                 refreshing={loading || searchLoading}
//                 onRefresh={handleRefresh}
//                 ListEmptyComponent={() => (
//                     (loading || searchLoading) ? (
//                         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                             {/* <ActivityIndicator /> */}
//                         </View>
//                     ) : (
//                         <View style={styles.emptyContainer}>
//                             <Text style={[styles.emptyText,{fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),}]}>
//                                 No favorites found
//                             </Text>
//                         </View>
//                     )
//                 )}
//             />
//         </View>
//     );

//     return (
//         <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: config.getHeight(100) }}>
//             <WebBaseLayout rightContent={MainContent} showSearch onSearch={handleSearch} />
//         </ScrollView>
//     );

// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: commonColors.white,
//     },
//     subcontainer: {
//         flex: 1,
//         padding: config.getWidth(3),
//         gap: config.getWidth(2),
//         backgroundColor: commonColors.white,

//     },
//     card: {
//         borderWidth: config.getWidth(0.3),
//         borderColor: borderColors.profileImage,
//         borderRadius: config.getWidth(5),
//         padding: config.getWidth(3),
//         backgroundColor: commonColors.white,
//         gap: config.getWidth(3),
//         marginBottom: config.getHeight(3)
//     },
//     cardHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     searchContainer: {
//         paddingHorizontal: config.getWidth(0.5),
//         marginTop: config.getWidth(-4)
//     },
//     typeIcon: {
//         width: config.getWidth(8),
//         height: config.getHeight(3.5),
//         marginRight: config.getWidth(2),
//     },
//     threeIcon: {
//         width: config.getWidth(8),
//         height: config.getHeight(2.5),
//     },
//     typeText: {
//         fontSize: config.generateFontSizeNew(16),
//         fontFamily: 'regular',
//         textAlign: 'left',
//         flex: 1,
//     },
//     moreButton: {
//         padding: 5,
//     },
//     moreButtonText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     contentContainer: {
//         flexDirection: 'row',
//         gap: config.getWidth(6),
//         paddingHorizontal: config.getWidth(3),
//     },
//     iconContainer: {
//         flex: 0.7,
//         borderWidth: config.getWidth(0.3),
//         borderColor: borderColors.profileImage,
//         borderRadius: config.getWidth(4),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     contentIcon: {
//         width: config.getWidth(20),
//         height: config.getHeight(8),
//         borderRadius: config.getWidth(2),
//     },
//     textContainer: {
//         flex: 1,
//     },
//     title: {
//         fontSize: config.generateFontSizeNew(16),
//         fontFamily: 'bold',
//         textAlign: 'left',
//         marginBottom: config.getHeight(1),
//     },
//     description: {
//         fontSize: config.generateFontSizeNew(12),
//         fontFamily: 'regular',
//         textAlign: 'left',
//     },
//     actionButtons: {
//         flexDirection: 'row',
//         gap: config.getWidth(4),
//         paddingHorizontal: config.getWidth(8),
//     },
//     actionIcon: {
//         width: config.getWidth(5),
//         height: config.getHeight(2),
//     },
//     menuStyle: {
//         marginTop: config.getHeight(3),
//         marginLeft: config.getWidth(1),
//         borderWidth: 1,
//         borderColor: borderColors.profileImage,
//         borderRadius: 16,
//         elevation: 0,
//     },

//     menuIcon: {
//         width: 20,
//         height: 20,
//         marginRight: 5
//     },
//     closeMenuItem: {
//         alignItems: 'flex-start',
//     },


//     icon: {
//         width: 20,
//         height: 20,
//         marginRight: 5
//     },
//     loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     errorText: { textAlign: 'center', margin: 20, color: commonColors.red },
//     listContainer: {},
//     footerLoader: {
//         paddingVertical: config.getHeight(2),
//         alignItems: 'center',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: config.getWidth(5),
//     },
//     retryButton: {
//         marginTop: config.getHeight(2),
//         padding: config.getWidth(1),
//         backgroundColor: commonColors.black,
//         borderRadius: config.getWidth(1),
//     },
//     retryText: {
//         color: commonColors.white,
//         fontFamily: 'bold',
//         fontSize: config.generateFontSizeNew(14),
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: config.getHeight(10),
//     },
//     emptyText: {
//         fontFamily: 'regular',

//         color: commonColors.black,
//     },
// });

// export default FavoritesWeb;





































import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Alert, ScrollView } from 'react-native';
import { SearchBar } from '@/src/components/searchbar';
import HeaderBack from '@/src/components/headerBack';
import config from '../../../utils/config';
import { borderColors, commonColors } from '@/src/utils/colors';
import Icons from '@/src/assets/icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { GET_CONTENT_DETAILS_BY_ID_MOBILE, GET_LIBRARY_FAVORITES_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setContentId } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { TOGGLE_CONTENT_FAV, TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import ContentCard from './contentCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileDownloadService from '@/src/services/FileDownloadService';
import WebBaseLayout from '@/src/components/webBaseLayout';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import alert from '@/src/utils/alert';

const FavoritesWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const PAGE_SIZE = 10;
    const [favorites, setFavorites] = useState<any[]>([]);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadedFile, setDownloadedFile] = useState<any>();
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
    const [selectedContentData, setSelectedContentData] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);
    const prevContentIdRef = useRef<number | null>(null);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    const [fetchContentDetails, { data: contentData, loading: contentLoading, error: contentError }] =
        useLazyQuery(GET_CONTENT_DETAILS_BY_ID_MOBILE);

    const [getFavoritesData] = useLazyQuery(GET_LIBRARY_FAVORITES_DATA);

    const getQueryVariables = (pageNum: number, search?: string) => {
        const variables: any = {
            input: {
                page: pageNum,
                page_size: PAGE_SIZE,
            }
        };
        // Only add keyword if search query exists
        if (search) {
            variables.input.keyword = search;
        }
        return variables;
    };

    const fetchFavoritesData = async (page: number, search?: string) => {
        try {
            setIsLoadingMore(true);
            const response = await getFavoritesData({
                variables: getQueryVariables(page, search)
            });

            if (response?.data?.getMyLibraryData?.libraryData?.favourites) {
                const newData = response?.data?.getMyLibraryData?.libraryData?.favourites?.data || [];
                const pagination = response?.data?.getMyLibraryData?.libraryData?.favourites?.pagination || {};
                const totalRecords = pagination.total_records || 0;

                setFavorites(prevData =>
                    page === 1 ? newData : [...prevData, ...newData]
                );

                setHasMoreData(
                    totalRecords > page * PAGE_SIZE
                );

                setIsLoading(false);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchFavoritesData(currentPage);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        setIsLoading(true);
        setFavorites([]);
        fetchFavoritesData(1, query);
    }, []);

    const loadMoreData = () => {
        console.log('Pagination hitting');
        if (hasMoreData && !isLoadingMore) {
            setIsLoadingMore(true);
            const nextPage = currentPage + 1;
            fetchFavoritesData(nextPage, searchQuery);
            setCurrentPage(nextPage);
        }
    };

    const handleRefresh = useCallback(() => {
        setCurrentPage(1);
        setIsLoading(true);
        setFavorites([]);
        fetchFavoritesData(1, searchQuery);
    }, [searchQuery]);

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    const renderError = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
                An error occurred while fetching favorites
            </Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
            >
                <Text style={[styles.retryText, { fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14) }]}>Retry</Text>
            </TouchableOpacity>
        </View>
    );

    const getDownloadedFiles = async () => {
        try {
            const fileSystemFiles = await FileDownloadService.getAllDownloadedFiles();
            const asyncFiles = await AsyncStorage.getItem('downloadedFiles');
            const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
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

    const handleDeleteFile = async (fileId: string) => {
        alert(
            "Delete Download",
            "Are you sure you want to remove this file?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const existingDownloads = await AsyncStorage.getItem('downloadedFiles');
                            let downloadsArray = existingDownloads ? JSON.parse(existingDownloads) : [];
                            const updatedDownloads = downloadsArray.filter((file: { fileId: string }) => file.fileId !== fileId);
                            await AsyncStorage.setItem('downloadedFiles', JSON.stringify(updatedDownloads));
                            await FileDownloadService.deleteDownloadedFile(fileId);
                            await getDownloadedFiles();
                        } catch (error) {
                            console.error('Error deleting file:', error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        getDownloadedFiles();
    }, []);

    const handleDownload = (contentId: number, item: any) => {
        setSelectedContentId(contentId);
        setSelectedContentData(item);
        setDownloadingId(contentId);
        fetchContentDetails({ variables: { input: { content_id: contentId } } });
    };

    useEffect(() => {
        if (contentData && selectedContentId && prevContentIdRef.current !== selectedContentId) {
            prevContentIdRef.current = selectedContentId;
            const fileUrl = contentData?.getContentInfoById?.contentInfo?.associated_content_files[0]?.file;
            if (!fileUrl) {
                alert("Error", "No file available for download.");
                setDownloadingId(null);
                return;
            }
            type FileType = "video" | "image" | "pdf";
            const typeMap: Record<string, FileType> = {
                Podcast: "video",
                Infographic: "image",
                Guideline: "pdf",
                Video: "video",
            };
            const type: FileType = typeMap[contentData?.getContentInfoById?.contentInfo?.content_type_info?.name as keyof typeof typeMap] || "pdf";
            FileDownloadService.downloadFile(
                fileUrl,
                type,
                `${contentData?.getContentInfoById?.contentInfo?.content_type_info?.name}_${selectedContentId}`,
                (progress) => setDownloadProgress(progress)
            ).then(async (downloadedFile) => {
                if (downloadedFile) {
                    console.log('Downloaded File:', downloadedFile);
                    await saveFileToStorage(downloadedFile);
                }
                setDownloadingId(null);
                setDownloadProgress(0);
            }).catch(() => {
                setDownloadingId(null);
                setDownloadProgress(0);
            });
        }
    }, [contentData, selectedContentId]);

    const saveFileToStorage = async (downloadedFile: any) => {
        try {
            if (!downloadedFile) return;
            const contentInfo = contentData?.getContentInfoById?.contentInfo;
            if (!contentInfo) return;

            // Create JSON structure for saving
            const fileData = {
                id: selectedContentId,
                name: contentInfo?.content_type_info?.name,
                title: contentInfo?.content_title,
                description: contentInfo?.description,
                icon: contentInfo?.content_type_info?.content_icon,
                localPath: downloadedFile.uri,
                type: downloadedFile.type,
                fileId: downloadedFile.id,
                downloadDate: new Date().toISOString(),
                cardData: {
                    type: contentInfo?.content_type_info?.name,
                    title: contentInfo?.content_title,
                    views: contentInfo?.total_likes,
                    imageSource: contentInfo?.associated_content_files[0]?.thumbnail,
                    org: contentInfo?.description,
                }
            };
            // Retrieve existing downloads
            const existingDownloads = await AsyncStorage.getItem('downloadedFiles');
            let downloadsArray = existingDownloads ? JSON.parse(existingDownloads) : [];
            downloadsArray.push(fileData);
            await AsyncStorage.setItem('downloadedFiles', JSON.stringify(downloadsArray));
            console.log('File saved to storage:', fileData);
            await getDownloadedFiles();
        } catch (error) {
            console.error('Error saving file to storage:', error);
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
                console.log('Success toggling like:', responseToggleLiked?.data?.toggleContentLike?.success);

                setFavorites(prevItems =>
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

    const MainContent = (
        <View style={[styles.subcontainer, { width: getWidth(60), }]}>
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const isDownloaded = Array.isArray(downloadedFile) && downloadedFile.some((file) => file.id === item.id);
                        const downloadedFileData = isDownloaded ? downloadedFile.find((file) => file.id === item.id) : null;
                        return (
                            <ContentCard
                                item={item}
                                refetch={handleRefresh}
                                isDownloaded={isDownloaded}
                                onDownloadPress={() =>
                                    isDownloaded && downloadedFileData
                                        ? handleDeleteFile(downloadedFileData.fileId)
                                        : handleDownload(item.id, item)
                                }
                                onLikedPress={() => toggleLike(item.id)}
                                isLoading={downloadingId === item.id}
                                progress={downloadingId === item.id ? downloadProgress : 0}
                            />
                        );
                    }}
                    contentContainerStyle={[
                        styles.listContainer,
                        favorites.length === 0 && { flex: 1 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={renderFooter}
                    refreshing={false}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14) }]}>
                                No favorites found
                            </Text>
                        </View>
                    )}
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
        <ScrollView
            // onScroll={({ nativeEvent }) => {
            //     const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            //     if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50 &&
            //         hasMoreData && !isLoadingMore && !isLoading) {
            //         loadMoreData();
            //     }
            // }}
            // scrollEventThrottle={400}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} showSearch onSearch={handleSearch} leftContent={CreateGroup}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white,
    },
    subcontainer: {
        flex: 1,
        padding: config.getWidth(3),
        gap: config.getWidth(2),
        //backgroundColor: commonColors.white,
    },
    card: {
        borderWidth: config.getWidth(0.3),
        borderColor: borderColors.profileImage,
        borderRadius: config.getWidth(5),
        padding: config.getWidth(3),
        backgroundColor: commonColors.white,
        gap: config.getWidth(3),
        marginBottom: config.getHeight(3)
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(0.5),
        marginTop: config.getWidth(-4)
    },
    typeIcon: {
        width: config.getWidth(8),
        height: config.getHeight(3.5),
        marginRight: config.getWidth(2),
    },
    threeIcon: {
        width: config.getWidth(8),
        height: config.getHeight(2.5),
    },
    typeText: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'regular',
        textAlign: 'left',
        flex: 1,
    },
    moreButton: {
        padding: 5,
    },
    moreButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentContainer: {
        flexDirection: 'row',
        gap: config.getWidth(6),
        paddingHorizontal: config.getWidth(3),
    },
    iconContainer: {
        flex: 0.7,
        borderWidth: config.getWidth(0.3),
        borderColor: borderColors.profileImage,
        borderRadius: config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentIcon: {
        width: config.getWidth(20),
        height: config.getHeight(8),
        borderRadius: config.getWidth(2),
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'bold',
        textAlign: 'left',
        marginBottom: config.getHeight(1),
    },
    description: {
        fontSize: config.generateFontSizeNew(12),
        fontFamily: 'regular',
        textAlign: 'left',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: config.getWidth(4),
        paddingHorizontal: config.getWidth(8),
    },
    actionIcon: {
        width: config.getWidth(5),
        height: config.getHeight(2),
    },
    menuStyle: {
        marginTop: config.getHeight(3),
        marginLeft: config.getWidth(1),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        borderRadius: 16,
        elevation: 0,
    },
    menuIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    closeMenuItem: {
        alignItems: 'flex-start',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        textAlign: 'center',
        margin: 20,
        color: commonColors.red
    },
    listContainer: {},
    footerLoader: {
        paddingVertical: config.getHeight(2),
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: config.getWidth(5),
    },
    retryButton: {
        marginTop: config.getHeight(2),
        padding: config.getWidth(1),
        backgroundColor: commonColors.black,
        borderRadius: config.getWidth(1),
    },
    retryText: {
        color: commonColors.white,
        fontFamily: 'bold',
        fontSize: config.generateFontSizeNew(14),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: config.getHeight(10),
    },
    emptyText: {
        fontFamily: 'regular',
        color: commonColors.black,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
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

export default FavoritesWeb;
