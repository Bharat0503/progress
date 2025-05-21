import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Share, Platform } from 'react-native';
import config from '../../../utils/config';
import HeaderBack from '@/src/components/headerBack';
import { commonColors } from '@/src/utils/colors';
import CardHistory from '@/src/components/cardHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileDownloadService from '@/src/services/FileDownloadService';
import { useDispatch } from 'react-redux';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { BASE_API_URL_DEEPLINK_PROD } from '@/src/components/GlobalConstant';
import ContentType from '@/src/utils/contentTypeIds';
import * as Clipboard from 'expo-clipboard';

const Downloads: React.FC = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadedFile, setDownloadedFile] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [contentTypeId, setContentTypeId] = useState();
    const [isOnline, setIsOnline] = useState<boolean | null | undefined>(null);

    useEffect(() => {
        const checkConnection = async () => {
            const connected = await FileDownloadService.checkInternetConnection();
            setIsOnline(connected);
        };

        checkConnection();
    }, []);

    useEffect(() => {
        getDownloadedFiles();
    }, []);

    useEffect(() => {
        const filterData = downloadedFile.filter((item) =>
            item?.cardData?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filterData);
        console.log('filterDatafilterDatafilterData' + JSON.stringify(filterData));
    }, [searchQuery, downloadedFile]);

    const getContentTypeId = (type: string): number => {
        const contentTypeMap: { [key: string]: number } = {
            "Infographics": ContentType.INFOGRAPHICS,
            "Podcasts": ContentType.PODCASTS,
            "Videos": ContentType.VIDEOS,
            "Collections": ContentType.COLLECTIONS,
            "Articles": ContentType.ARTICLES,
            "Guidelines": ContentType.GUIDELINES,
            "Storycasts": ContentType.STORYCASTS,
            "Quiz": ContentType.QUIZ,
            "Documents": ContentType.DOCUMENTS,
        };

        return contentTypeMap[type];
    };


    const getDownloadedFiles = async () => {
        try {
            const fileSystemFiles = await FileDownloadService.getAllDownloadedFiles();
            const asyncFiles = await AsyncStorage.getItem('downloadedFiles');
            const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
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
        Alert.alert(
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
                            console.log('File deleted successfully:', fileId);
                            await getDownloadedFiles();
                        } catch (error) {
                            console.error('Error deleting file:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleCardPress = (item: { id: any; }) => {
        dispatch(setContentId(item.id));
        dispatch(setContent(null))
        dispatch(setSpaceDashBoard(false))
        dispatch(setStartfromSpaceDashBoard(false))
        // navigationService.navigate(RouteNames.Content, {
        //     spaceDashboard: false
        // })

        if (isOnline) {
            navigationService.navigate(RouteNames.Content);
        } else {
            navigationService.navigate(RouteNames.DownloadedContent, {
                isOffline: isOnline,
                downloadedData: item,
            });
        }

    }

    const handleItemShareClick = async (item: any) => {
        try {
            const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`;
            const message = Platform.OS === 'android' ? `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}` : ``;;

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
            <HeaderBack title='Downloaded Contents' border backgroundColor={commonColors.white} />
            <View style={styles.searchContainer}>
                {/* <SearchBar onSearch={setSearchQuery} /> */}
            </View>
            <View style={styles.subcontainer}>
                {filteredData.length === 0 ? (
                    <Text style={styles.noResults}>No results found</Text>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <CardHistory
                                type={getContentTypeId(item?.cardData?.type)}
                                title={item?.cardData?.title}
                                views={item?.cardData?.views}
                                imageSource={item?.cardData?.imageSource}
                                org={item?.cardData?.org}
                                onPress={() => handleCardPress(item)}
                                onDownloadPress={() => handleDeleteFile(item.fileId)}
                                isDownloaded={true}
                                fromHistory={false}
                                onSharePress={() => handleItemShareClick(item)}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: config.getHeight(25) }}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white,
    },
    subcontainer: {
        padding: config.getWidth(5),
        marginTop: config.getHeight(2)
    },
    noResults: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray',
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(3),
        marginTop: config.getWidth(-4)
    },
});

export default Downloads;
