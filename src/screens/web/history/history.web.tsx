import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Share, ScrollView } from 'react-native';
import config from '../../../utils/config';
import { GET_CONTENT_DETAILS_BY_ID_MOBILE } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { commonColors } from '@/src/utils/colors';

import CardHistory from '@/src/components/cardHistory';
import FileDownloadService from '@/src/services/FileDownloadService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import WebBaseLayout from '@/src/components/webBaseLayout';
import alert from '@/src/utils/alert';
import Analytics from '@/src/services/Analytics';
import { BASE_API_URL_DEEPLINK_PROD } from '@/src/components/GlobalConstant';
import ContentType from '@/src/utils/contentTypeIds';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import * as Clipboard from 'expo-clipboard';


interface HistoryItem {
    id: number;
    type: number;
    title: string;
    views: string;
    imageSource: any;
    org: string;
}


const HistoryWeb: React.FC = () => {

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
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
    const [selectedContentData, setSelectedContentData] = useState<HistoryItem>();
    const historyData: HistoryItem[] = [
        { id: 1, type: 2, title: 'Neuroblastoma', views: '323M', org: 'CCMH', imageSource: 'https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68' },
        { id: 2, type: 1, title: 'Appendicitis', views: '323M', org: 'CCMH', imageSource: null },
        { id: 24, type: 6, title: 'Brain Tumor', views: '100M', org: 'CCMH', imageSource: 'https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA' },
        { id: 27, type: 1, title: 'Heart Surgery', views: '50M', org: 'CCMH', imageSource: null },
    ];

    const [fetchContentDetails, { data: contentData, loading: contentLoading, error: contentError }] =
        useLazyQuery(GET_CONTENT_DETAILS_BY_ID_MOBILE);


    const filteredData = historyData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadedFile, setDownloadedFile] = useState<any>();


    const handleDownload = async (contentId: number, item: HistoryItem) => {
        setSelectedContentId(contentId);
        setSelectedContentData(item);
        setDownloadingId(contentId);
        try {
            await Analytics.logDownloadEvent(contentId?.toString());
        } catch (error) {
            console.error("Download event logging failed:", error);
        }
        fetchContentDetails({ variables: { input: { content_id: contentId } } });
    };

    useEffect(() => {
        if (contentData && selectedContentId) {
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
                    type: selectedContentData?.type,
                    title: selectedContentData?.title,
                    views: selectedContentData?.views,
                    imageSource: selectedContentData?.imageSource,
                    org: selectedContentData?.org,
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
            console.log('Filtered Downloaded Files:', filteredFiles);
            setDownloadedFile(filteredFiles);
        } catch (error) {
            console.error('Error retrieving downloaded files:', error);
        }
    };

    useEffect(() => {
        getDownloadedFiles();
    }, []);

    const handleCardPress = (itemId: number) => {
        console.log('Content Id-->', typeof itemId);
        // dispatch(setContentId(itemId));
        dispatch(setContentId(Number(itemId)))
        dispatch(setSpaceDashBoard(false))
        dispatch(setStartfromSpaceDashBoard(false))
        navigationService.navigate(RouteNames.Content)
    }

    //   const handleRetrieveFiles = async () => {
    //     const files = await FileDownloadService.getAllDownloadedFiles();
    //     console.log('Retrieved file:', files);
    //     setDownloadedFile(files);
    //   };

    //   const handleDeleteFil = async () => {
    //     // console.log('Downloaded File in state:', downloadedFile);
    //     // await FileDownloadService.deleteDownloadedFile('1737749645014');
    //   };

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


    const MainContent = (

        <View style={[styles.subcontainer, { width: getWidth(60), }]}>
            {filteredData.length === 0 ? (
                <Text style={[styles.noResults, { fontSize: getFontSize(16), }]}>No results found</Text>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={({ item }) => {
                        const isDownloaded = Array.isArray(downloadedFile) && downloadedFile.some((file) => file.id === item.id);
                        const downloadedFileData = isDownloaded ? downloadedFile.find((file) => file.id === item.id) : null;
                        return (
                            <CardHistory
                                type={item.type}
                                //type={getContentTypeId(item.type)}
                                title={item.title}
                                views={item.views}
                                imageSource={item.imageSource}
                                org={item.org}
                                onPress={() => handleCardPress(item.id)}
                                onDownloadPress={() =>
                                    isDownloaded && downloadedFileData
                                        ? handleDeleteFile(downloadedFileData.fileId)
                                        : handleDownload(item.id, item)
                                }
                                isLoading={downloadingId === item.id}
                                progress={downloadingId === item.id ? downloadProgress : 0}
                                isDownloaded={isDownloaded}
                                fromHistory={true}
                                onSharePress={() => handleItemShareClick(item)}
                            />
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: config.getHeight(25) }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );

    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} showSearch onSearch={setSearchQuery} />
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
        fontFamily: 'regular',
        color: 'gray',
    },
});

export default HistoryWeb;
