import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '@/src/components/header';
import ContentHeader from '@/src/components/contentHeader';
import ContentTabBar from '@/src/components/contectTabBar';
import VideoPlayer from '@/src/components/videoPlayer';
import ContentDescription from '@/src/components/contentDescription';
import InfographicImageDisplay from '@/src/components/infographicImageDisplay';
import GuidelinePdfDisplay from '@/src/components/guidelinePdfDisplay';
import { commonColors } from '@/src/utils/colors';
import ContentType from '@/src/utils/contentTypeIds';

const DownloadedContent: React.FC = () => {
    const route = useRoute();
    const { downloadedData, isOffline } = route.params || {};

    if (!downloadedData) {
        return (
            <View style={styles.container}>
                <Header content={true} profile={true} back={true} />
                <ContentHeader title="No Data Available" />
            </View>
        );
    }

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

    // Extract necessary fields from downloadedData
    const { name, title, description, localPath, id } = downloadedData;
    const content_type_id = getContentTypeId(name);
    const content_title = title;
    const file = localPath;
    const renderData = {
        id: id,
        file: file,
    }

    return (
        <View style={styles.container}>
            <Header content={true} profile={true} back={true} />

            <ContentTabBar type={content_type_id} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    
                    <ContentHeader title={content_title} />

                    {/* Render different content types */}
                    {content_type_id === ContentType.VIDEOS || content_type_id === ContentType.PODCASTS ? (
                        <VideoPlayer data={renderData} />
                    ) : null}

                    {content_type_id === ContentType.INFOGRAPHICS && <InfographicImageDisplay data={renderData} />}

                    {content_type_id === ContentType.GUIDELINES && <GuidelinePdfDisplay data={renderData} />}

                    {content_type_id === ContentType.ARTICLES && <GuidelinePdfDisplay data={renderData} /> }

                    {content_type_id === ContentType.STORYCASTS && <InfographicImageDisplay data={renderData} />}

                    {/* Show description if available */}
                    {description && <ContentDescription description={description} />}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: commonColors.white,
    },
});

export default DownloadedContent;
