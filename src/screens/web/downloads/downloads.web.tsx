import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Share, ScrollView } from 'react-native';
import config from '../../../utils/config';

import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';


import CardHistory from '@/src/components/cardHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileDownloadService from '@/src/services/FileDownloadService';
import { useDispatch, useSelector } from 'react-redux';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import WebBaseLayout from '@/src/components/webBaseLayout';
import alert from '@/src/utils/alert';
import { BASE_API_URL_DEEPLINK_PROD } from '@/src/components/GlobalConstant';
import ContentType from '@/src/utils/contentTypeIds';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import * as Clipboard from 'expo-clipboard';

interface HistoryItem {
    id: number;
    type: string;
    title: string;
    views: string;
    imageSource: any;
    org: string;
}

const DownloadsWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();
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
        return dimension.height * (height / 100)
    }
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadedFile, setDownloadedFile] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
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
        // console.log('filterDatafilterDatafilterData' + filterData);
        setFilteredData(filterData);
    }, [searchQuery, downloadedFile]);

    const getContentTypeId = (type: string): number => {
        console.log('filterDatafilterDatafilterData' + type);
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
            const fileSystemFiles = await FileDownloadService?.getAllDownloadedFiles();
            //console.log('Retrieved files from File System:', fileSystemFiles);
            const asyncFiles = await AsyncStorage?.getItem('downloadedFiles');
            const storedFiles = asyncFiles ? JSON.parse(asyncFiles) : [];
            //console.log('Retrieved Downloaded Files from AsyncStorage:', storedFiles);
            // Compare files based on fileId
            const filteredFiles = storedFiles?.filter((asyncFile: { fileId: string; }) =>
                fileSystemFiles?.some(file => file?.id === asyncFile?.fileId)
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
            const message = ``;

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


    const MainContent = (
        <View style={[styles.subcontainer, { width: getWidth(60), }]}>
            {filteredData.length === 0 ? (
                <Text style={[styles.noResults, {
                    fontSize: config.isWeb ? getFontSize(4) : 16,
                }]}>No results found</Text>
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
            <WebBaseLayout rightContent={MainContent} showSearch={false} leftContent={CreateGroup} />
        </ScrollView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white,
    },
    subcontainer: {
        //padding: config.getWidth(5),
        //backgroundColor: 'pink'
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,

        color: 'gray',
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

export default DownloadsWeb;
