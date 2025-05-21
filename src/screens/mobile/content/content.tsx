import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform, Share, Image, Linking, Alert, ActivityIndicator } from 'react-native'
import config from '../../../utils/config'
import { commonColors, borderColors } from '@/src/utils/colors'
import Header from '@/src/components/header';
import Icons from '@/src/assets/icons';

import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_COMMENT_DETAILS_BY_CONTENT_ID_MOBILE, GET_CONTENT_DETAILS_BY_ID_MOBILE, GET_RELATED_CONTENT_DETAILS_BY_ID_MOBILE, GET_SPACE_CONTENT_ID, GET_STAFF_DIRECTORY } from '@/src/services/QueryMethod';
import { POST_COMMENT, TOGGLE_COMMENT_LIKE, TOGGLE_CONTENT_FAV, TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoTime } from '@/src/redux/action';
import ContentHeader from '@/src/components/contentHeader';
import ContentTabBar from '@/src/components/contectTabBar';
import VideoPlayer from '@/src/components/videoPlayer';
import ContentActivityBar from '@/src/components/contentActivityBar';
import ContentChapterBar from '@/src/components/contentChapterBar';
import ContentDescription from '@/src/components/contentDescription';
import ContentComment from '@/src/components/contentComment';
import ContentRelated from '@/src/components/contentRelated';
import InfographicImageDisplay from '@/src/components/infographicImageDisplay';
import GuidelinePdfDisplay from '@/src/components/guidelinePdfDisplay';
import { SearchBar } from '@/src/components/searchbar';
import ContentStaffDirectory from '@/src/components/contentStaffDirectory';
import ContentType from '@/src/utils/contentTypeIds';
import OpenArticleLinkButton from '@/src/components/openLinkButton';
import Analytics from '@/src/services/Analytics';
import { BASE_API_URL_DEEPLINK_PROD } from '@/src/components/GlobalConstant';
import navigationService from '@/src/navigation/navigationService';
import * as Clipboard from 'expo-clipboard';




const Content: React.FC = (props: any) => {
    const [featuredContentData, setFeaturedContentData] = useState<any>()
    const [chapter, setChapter] = useState<any>(null)
    const [comments, setComments] = useState<any>(null)
    const [staffDirectoryData, setStaffDirectoryData] = useState<any>(null)
    const scrollViewRef = useRef<any>(null);
    const videoSegments = useSelector((state: any) => state.reducer.videoSegments)

    // console.log('Space Content Id-->', props?.route?.params?.spaceDashboard);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime, setCurrentTime] = useState<number>(0)
    const contentdetails = useSelector((state: any) => state.reducer.content)
    const spaceContentId = useSelector((state: any) => state.reducer.contentId)
    const [contentTypeId, setContentTypeId] = useState<number>()
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isContentLoading, setContentLoading] = useState<boolean>(true);
    const [isCommentLoading, setCommentLoading] = useState<boolean>(true);
    const [isRelatedContentLoading, setRelatedContentLoading] = useState<boolean>(true);

    //console.log('Space Content Id-->', spaceContentId);
    const [content, setContent] = useState<any>(null)

    const [totalComments, setTotalComments] = useState<number>(null)
    const [infographicData, setInfographicData] = useState<any>(null)
    const [articleData, setArticleData] = useState<any>(null)
    const [storyCastData, setStoryCastData] = useState<any>(null)
    const [videoPodcastData, setVideoPodcastData] = useState<any>(null)
    const [guidelineData, setGuidelineData] = useState<any>(null)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isFav, setIsFav] = useState<boolean>(false)
    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE)
    const [requestToggleFav] = useMutation(TOGGLE_CONTENT_FAV)
    const [postComment] = useMutation(POST_COMMENT)
    const [requestToggleCommentLike] = useMutation(TOGGLE_COMMENT_LIKE)
    const [comment, setComment] = useState<string>("")

    const dispatch = useDispatch()
    const [isStaffDirectoryVisible, setStaffDirectoryVisible] = useState(false)
    const [StaffDirectoryUser, setStaffDirectoryUser] = useState(false)
    const refresh = useSelector((state: any) => state.reducer.refresh)
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const PAGE_SIZE = 10;



    const [contentType, setContentType] = useState()
    const [miniSpaceLogo, setMiniSpaceLogo] = useState<string>()
    const [relatedContentData, setRelatedContentData] = useState<any[]>([]);


    const [currentPageSD, setCurrentPageSD] = useState(1);
    const [hasMoreDataSD, setHasMoreDataSD] = useState(true);
    const [isLoadingMoreSD, setIsLoadingMoreSD] = useState(false);
    const PAGE_SIZE_SD = 10;
    const [getStaffDirectory] = useLazyQuery(GET_STAFF_DIRECTORY)
    const [isutoFocusComment, setAutoFocusComment] = useState(false);


    const isFocused = useIsFocused()


    useEffect(() => {


        setLoading(true)

        // dispatch(setVideoTime(0))
        console.log('contentdetails-->', refresh, contentdetails);

        if (contentdetails !== null) {

            if (contentdetails?.content_type_id === ContentType.DIRECTORY) {

                setContentTypeId(contentdetails?.content_type_id)
                console.log("responseGetStaffDirectory", contentdetails)
                // setContentName(contentdetails?.title)
                const init = async () => {
                    const responseGetStaffDirectory = await getStaffDirectory({
                        variables: {
                            input: {
                                space_id: contentdetails?.space_id,
                                page_size: PAGE_SIZE_SD,
                                page: currentPageSD
                            }
                        }
                    })

                    if (responseGetStaffDirectory?.data?.getStaffDirectories?.success) {
                        const newData = responseGetStaffDirectory?.data?.getStaffDirectories?.staff_directories || [];
                        const pagination = responseGetStaffDirectory?.data?.getStaffDirectories?.pagination || {};
                        //  setStaffDirectoryData(responseGetStaffDirectory?.data?.getStaffDirectories?.staff_directories)
                        setStaffDirectoryData(newData);
                        setHasMoreDataSD(
                            pagination?.total_records > currentPageSD + 1 * PAGE_SIZE
                        );
                        setLoading(false)
                    }


                }

                init()
            }
        }

        // else {
        //     setContentId(spaceContentId)
        //     // setContentType(responseGetSpaceContentId?.data?.getContentBySpaceAndCard?.content[0]?.content_type_info?.name);
        //     console.log('Space Content Id-->', spaceContentId);
        // }
        return (() => {

        })

    }, [refresh])




    const [getContentData] = useLazyQuery(GET_CONTENT_DETAILS_BY_ID_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
        onError: (error) => {
            Alert.alert(
                "",
                error?.message,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigationService.goBack();
                        },
                    },
                ],
                { cancelable: false } // Ensures the alert can't be dismissed without clicking "OK"
            );
        }
    })

    const [getContentRelatedData] = useLazyQuery(GET_RELATED_CONTENT_DETAILS_BY_ID_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    }
    )

    const [getCommentData] = useLazyQuery(GET_COMMENT_DETAILS_BY_CONTENT_ID_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    })



    useEffect(() => {

        if (spaceContentId !== null) {
            console.log("CONTENTIDDDDD", spaceContentId)
            refetchContentAPI()
            refreshRelatedContentData(currentPage, 2)
            refetchCommentAPI()
            if (contentType) {
                Analytics.logViewContentEvent(spaceContentId, contentType);
            }
        }

    }, [spaceContentId])





    useEffect(() => {
        console.log("LOADING", isCommentLoading, isContentLoading, isRelatedContentLoading)
        if (!isCommentLoading && !isContentLoading && !isRelatedContentLoading) {
            setLoading(false)
        }

    }, [isCommentLoading, isContentLoading, isRelatedContentLoading])


    const refetchCommentAPI = async () => {
        setCommentLoading(true)
        const responseCommentRefetch = await getCommentData({
            variables: {
                input: {
                    content_id: spaceContentId
                }
            }

        })
        console.log("responseCommentRefetch", responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments, responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.total_comments)
        if (responseCommentRefetch?.data?.getContentInfoById?.success) {

            arrangeComments(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments, responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.total_comments)
        }
    }

    // useEffect(() => {
    //     if (!contentRelatedLoading) {



    //         //console.log("contentRelatedData", contentRelatedData?.getContentInfoById?.contentInfo?.related_content[0])
    //         setRelatedContentData(contentRelatedData?.getContentInfoById?.contentInfo?.related_content)
    //     }
    // }, [contentRelatedLoading])

    const arrangeChapter = (data: any) => {

        let chapters = []
        for (let key in data) {
            let chapter = {
                id: data[key]?.id,
                time: data[key]?.start_time,
                title: data[key]?.section_title
            }
            console.log("CONTENTCHAPTERS", chapter)
            chapters.push(chapter)
        }
        setChapter(chapters)

    }

    const extractDate = (isoString: string): string => {
        // Parse the ISO string into a Date object
        const date = new Date(isoString);

        // Extract the date components (YYYY-MM-DD)
        const day = date.getDate();
        const shortMonth = date.toLocaleString('en-US', { month: 'short' }); // Short month (e.g., "Jan")

        return `${day} ${shortMonth}`;
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollTo({
            y: config.getHeight(10), // Vertical scroll position (in pixels)
            animated: true,
        });
        setAutoFocusComment(true)
    };

    const isJSONString = (str: string) => {
        try {
            // Attempt to parse the string as JSON
            const parsed = JSON.parse(str);

            // Check if it results in an object or array (valid JSON types)
            if (typeof parsed === "object") {
                return true
            }
            else {
                return false
            }
        } catch (e) {
            // If parsing throws an error, it's not a JSON string
            return false;
        }
    };

    const getTagIds = (value: string) => {
        const regex = /<([^|]+)\|([^>]+)>/g;
        const textWithIds = value
        const idMatches = [...textWithIds.matchAll(regex)];

        const nameIdMap = idMatches.reduce((acc: any, match: any) => {
            acc[match[1]] = match[2]; // { "john": "123", "alice": "456" }
            return acc;
        }, {});

        const mentionRegex = /@(\w+)/; // Match @name
        const textWithMentions = value.replace(/<([^|]+)\|[^>]+>/g, '@$1')
        const textWithMentionsSplit = textWithMentions.split(" ")
        const indexes = textWithMentionsSplit.map((item, index) => {

            if (mentionRegex.test(item)) {
                // console.log("getTagIds22", item);
                const name = item.slice(1); // Remove '@' to get the name
                return { index, id: nameIdMap[name] || null }; // Store index & ID
            }
            return null; // Ignore non-mentions
        }).filter(index => index !== null);
        // console.log("getTagIds11", textWithMentionsSplit);
        // const mentionData = mentionMatches.map(match => ({
        //     name: match[1], // Extract name (e.g., "john")
        //     index: match.index, // Get position in the string
        //     id: nameIdMap[match[1]] || null, // Map to ID from nameIdMap
        // }));

        return indexes


    }

    const arrangeComments = (data: any, totalComments: number) => {
        setTotalComments(totalComments)
        const comments = []
        for (let key in data) {
            isJSONString(data[key]?.comment)

            let comment = {
                id: data[key]?.id,
                createdAt: extractDate(data[key]?.createdAt),
                //comment1: data[key]?.comment.replace(/<([^|]+)\|[^>]+>/g, '@$1'),
                comment: data[key]?.comment,
                commentor_name: data[key]?.commentor_info?.display_name,
                is_Liked: data[key]?.is_liked,
            }

            // comment?.comment.split(/<([^|]+)\|[^>]+>/g)
            //     .map((part: string, index: number) => {

            //     // const match = part.match(/<([^|]+)\|[^>]+>/);
            //     // return part
            // })
            console.log("ITEMCOMMENT11", comment?.comment.split(/(\<[^>]+\>)/).filter(Boolean))


            comments.push(comment)
            // console.log("CONTENTCOMMENTS", comment)
        }

        setComments(comments)
        setCommentLoading(false)

    }
    const arrangeInfographicData = (data: any) => {
        let infographic = {
            id: data[0]?.id,
            file: data[0]?.file
        }
        setInfographicData(infographic)
    }


    const arrangeArticleData = (data: any) => {
        const files = data?.associated_content_files[0];
        let article = {
            id: files?.id,
            thumbnail: files?.thumbnail,
            file: files?.file,
            url: files?.hls_url,
            event_url: data?.event_url
        }
        setArticleData(article)
    }

    const arrangeStoryCastData = (data: any) => {
        const files = data?.associated_content_files[0];
        let storyCast = {
            id: files?.id,
            thumbnail: files?.thumbnail,
            file: files?.file,
            url: files?.hls_url,
            event_url: data?.event_url
        }
        setStoryCastData(storyCast)
    }

    const arrangeVideoPodcastData = (data: any) => {
        console.log("arrangeVideoPodcastData", data)
        let videoPodcast = {
            id: data[0]?.id,
            file: data[0]?.file,
            url: data[0]?.hls_url,
            thumbnail: data[0]?.thumbnail,
        }
        setVideoPodcastData(videoPodcast)
    }

    const arrangeGuidelineData = (data: any) => {
        let guideline = {
            id: data[0]?.id,
            file: data[0]?.file
        }
        setGuidelineData(guideline)
    }

    const toggleCommentLike = async (id: number) => {

        const responseToggleCommentLike = await requestToggleCommentLike({
            variables: {
                input: {
                    comment_id: id,
                    like: true
                }
            }
        })
        if (responseToggleCommentLike?.data?.toggleCommentLike?.success) {

            refetchCommentAPI()
            // const responseCommentRefetch = await getCommentData({
            //     variables: {



            //         input: {
            //             content_id: spaceContentId
            //         }
            //     }

            // })
            // console.log("responseCommentRefetch", responseCommentRefetch)
            // if (responseCommentRefetch?.data?.getContentInfoById?.success) {
            //     arrangeComments(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments, responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.total_comments)
            // }
        }


    }

    const toggleLike = async () => {

        const responseToggleLiked = await requestToggleLike({
            variables: {
                input: {
                    content_id: spaceContentId,
                    like: true
                }
            }
        })
        if (responseToggleLiked?.data?.toggleContentLike?.success) {
            setIsLiked(!isLiked)
            refetchContentAPI()
        }
        console.log("responseToggleLiked", responseToggleLiked)
    }

    const toggleLikeContentRelated = async (contentIdRelated: number) => {
        const responseToggleLiked = await requestToggleLike({
            variables: {
                input: {
                    content_id: contentIdRelated,
                    like: true
                }
            }
        })
        if (responseToggleLiked?.data?.toggleContentLike?.success) {
            setRelatedContentData(prevItems =>
                prevItems.map(item =>
                    item.id === contentIdRelated
                        ? { ...item, is_liked: !item.is_liked }
                        : item
                )
            );
        }
        console.log("responseToggleLiked", responseToggleLiked)
    }



    const toggleFav = async () => {

        const responseToggleFav = await requestToggleFav({
            variables: {
                input: {
                    content_id: spaceContentId,
                }
            }
        })
        if (responseToggleFav?.data?.toggleContentFav?.success) {
            setIsFav(!isFav)
            refetchContentAPI()
        }
        console.log("responseToggleFav", responseToggleFav)
    }

    const refetchContentAPI = async () => {
        console.log("responseRefetchContentAPI11", spaceContentId)
        setContentLoading(true)
        try {
            const responseRefetchContentAPI = await getContentData({
                variables: {
                    input: {
                        content_id: spaceContentId
                    }
                }
            });

            console.log("responseRefetchContentAPI", responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.associated_content_files[0]?.file);

            if (responseRefetchContentAPI?.data?.getContentInfoById?.success) {
                let content_type_id = responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.content_type_info?.id;
                const content_type = responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.content_type_info?.name;

                setContentTypeId(content_type_id);
                setContentType(content_type);
                setMiniSpaceLogo(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.space_info?.minified_logo_path);

                if (content_type_id === ContentType.VIDEOS || content_type_id === ContentType.PODCASTS) {
                    arrangeVideoPodcastData(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.associated_content_files);
                    arrangeChapter(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.associated_content_sections);
                }

                if (content_type_id === ContentType.GUIDELINES || content_type_id === ContentType.DOCUMENTS) {
                    arrangeGuidelineData(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.associated_content_files);
                }

                setIsLiked(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.is_liked);
                setIsFav(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.is_marked_favourite);

                if (content_type_id === ContentType.INFOGRAPHICS) {
                    arrangeInfographicData(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo?.associated_content_files);
                }
                if (content_type_id === ContentType.ARTICLES) {
                    arrangeArticleData(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo);
                }
                if (content_type_id === ContentType.STORYCASTS) {
                    arrangeStoryCastData(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo);
                }

                setContent(responseRefetchContentAPI?.data?.getContentInfoById?.contentInfo);
                setContentLoading(false);
            }
        } catch (error) {
            console.error("An error occurred while fetching content data:", JSON.stringify(error));
        } finally {
            setContentLoading(false);
        }
    }

    const addCommentAPI = async (value: string) => {
        const responseComment = await postComment({
            variables: {
                input: {
                    content_id: spaceContentId,
                    comment: value
                }
            }
        })
        console.log("responsePostComment", responseComment?.data?.commentContent?.success)
        if (responseComment?.data?.commentContent?.success) {

            refetchCommentAPI()

            // const responseCommentRefetch = await getCommentData({
            //     variables: {
            //         input: {
            //             content_id: spaceContentId
            //         }
            //     }

            // })
            // console.log("responseCommentRefetch", responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments, spaceContentId)
            // if (responseCommentRefetch?.data?.getContentInfoById?.success) {
            //     arrangeComments(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments, responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.total_comments)
            // }



        }

        console.log("responseComment", responseComment)
    }
    const refreshRelatedContentData = async (page: number, PAGE_SIZE: number) => {
        try {
            setRelatedContentLoading(true)
            const responseRelatedContentData = await getContentRelatedData({
                variables: {
                    input: {
                        content_id: spaceContentId,
                        page: page,
                        page_size: PAGE_SIZE
                    }
                }

            })
            console.log("responseRelatedContentData", responseRelatedContentData?.data?.getContentInfoById?.contentInfo?.related_content?.data)
            // setRelatedContentData(responseRelatedContentData?.data?.getContentInfoById?.contentInfo?.related_content?.data)



            const newData = responseRelatedContentData?.data?.getContentInfoById?.contentInfo?.related_content?.data || [];
            const pagination = responseRelatedContentData?.data?.getContentInfoById?.contentInfo?.related_content?.pagination || {};
            setRelatedContentData(prevData =>
                page === 1 ? newData : [...prevData, ...newData]
            );
            setHasMoreData(
                pagination?.total_records > page * PAGE_SIZE
            );
            setRelatedContentLoading(false)
        }
        catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }
    const addComment = (value: string) => {
        setComment(value)
    }





    const changeChapter = (time: number) => {

        dispatch(setVideoTime(time))
        setCurrentTime(time)




    }

    const handleItemShareClick = async () => {
        try {
            const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${content?.id}`;
            const message = Platform.OS === 'android' ? `${BASE_API_URL_DEEPLINK_PROD}?id=${content?.id}` : ``;

            if (config.isWeb && !navigator.share) {
                // Web fallback: Copy to clipboard
                Clipboard.setStringAsync(urlToShare);
                Alert.alert('Link copied to clipboard!');
                return;
            }

            const result = await Share.share({
                message,
                url: urlToShare,
                title: content?.content_type_info?.name,
            });

            if (result.action === Share.sharedAction) {
                console.log('Content shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Content sharing dismissed');
            }
        } catch (error) {
            console.error('Error sharing content:', error);
        }
    };

    const onSearch = async (value: string) => {
        setCurrentPageSD(1)
        setSearchQuery(value)
        const responseGetStaffDirectory = await getStaffDirectory({
            variables: {
                input: {
                    space_id: contentdetails?.space_id,
                    keyword: value
                }
            }
        })
        if (responseGetStaffDirectory?.data?.getStaffDirectories?.success) {


            const newData = responseGetStaffDirectory?.data?.getStaffDirectories?.staff_directories || [];
            const pagination = responseGetStaffDirectory?.data?.getStaffDirectories?.pagination || {};

            setStaffDirectoryData(newData);
            setHasMoreDataSD(
                pagination?.total_records > currentPageSD + 1 * PAGE_SIZE
            );
            setLoading(false)
        }
    }

    const onClickUser = (item: any) => {
        setStaffDirectoryUser(item)
        setStaffDirectoryVisible(true)
        console.log("USERCLICKED", item)
    }

    const openEmail = (emailId: string) => {
        const email = emailId

        const mailto = `mailto:${email}`

        Linking.openURL(mailto).catch((err) => {
            Alert.alert('Error', 'Unable to open mail app.');
            console.error('Mail Error:', err);
        });
    };

    const openDialer = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch((err) => {
            Alert.alert('Error', 'Unable to open phone dialer.');
            console.error('Dialer Error:', err);
        });
    };

    const fetchMoreRelatedContent = () => {
        if (hasMoreData && !isLoadingMore) {
            setIsLoadingMore(true);
            refreshRelatedContentData(currentPage + 1, 10)
            setCurrentPage(currentPage + 1)
        }
    }

    const onLoadMore = async () => {

        if (hasMoreDataSD) {

            setIsLoadingMoreSD(true);
            const input = searchQuery ? {
                space_id: contentdetails?.space_id,
                page_size: PAGE_SIZE_SD,
                page: currentPageSD + 1,
                keyword: searchQuery
            } : {
                space_id: contentdetails?.space_id,
                page_size: PAGE_SIZE_SD,
                page: currentPageSD + 1
            }
            const responseGetStaffDirectory = await getStaffDirectory({
                variables: {
                    input: input
                }
            })

            if (responseGetStaffDirectory?.data?.getStaffDirectories?.success) {
                const newData = responseGetStaffDirectory?.data?.getStaffDirectories?.staff_directories || [];
                const pagination = responseGetStaffDirectory?.data?.getStaffDirectories?.pagination || {};
                setStaffDirectoryData(prevData =>
                    [...prevData, ...newData]
                );
                setHasMoreDataSD(
                    pagination?.total_records > currentPageSD + 1 * PAGE_SIZE
                );
                setCurrentPageSD(currentPageSD + 1)
                // setIsLoadingSD(false)

                // // setStaffDirectoryData(responseGetStaffDirectory?.data?.getStaffDirectories?.staff_directories)
                // setLoading(false)
                setIsLoadingMoreSD(false)
            }
            else {
                setHasMoreDataSD(false)
                setIsLoadingMoreSD(false)
            }

        }
    }





    return (

        <View style={styles.container}>

            <Header content={true} profile={true} back={true}
            // message={true} notification={true}
            />

            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            ) :

                <>

                    <ContentTabBar spaceLogo={miniSpaceLogo} type={contentdetails?.content_type_id === ContentType.DIRECTORY ? contentdetails?.content_type_id : content?.content_type_info?.id} />
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                        <ScrollView nestedScrollEnabled={true} ref={scrollViewRef} showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <ContentHeader title={contentdetails?.content_type_id === ContentType.DIRECTORY ? "Staff Directory" : content?.content_title} />
                            {
                                (contentdetails !== null && contentdetails?.content_type_id === ContentType.DIRECTORY)
                                    ?
                                    <View style={styles.searchContainer}>
                                        <SearchBar isOnKeyboardSearch={true} onSearch={onSearch} onChangeSearch={onSearch} containerWidth={config.getWidth(95)} bgColor={commonColors.white} borderColor={borderColors.signInBorder}
                                        />
                                    </View>
                                    : null

                            }

                            {
                                videoPodcastData?.file || videoPodcastData?.url ?
                                    (contentTypeId === ContentType.VIDEOS || contentTypeId === ContentType.PODCASTS)
                                        ? <VideoPlayer data={videoPodcastData} contentTypeId={contentTypeId} spaceContentId={spaceContentId} /> : null
                                    : null
                            }

                            {infographicData?.file ?
                                (contentTypeId === ContentType.INFOGRAPHICS) ?

                                    <InfographicImageDisplay data={infographicData} />
                                    : null
                                : null}

                            {guidelineData?.file ?
                                (contentTypeId === ContentType.GUIDELINES || contentTypeId === ContentType.DOCUMENTS) ?

                                    <GuidelinePdfDisplay data={guidelineData} />
                                    : null
                                : null}

                            {articleData?.file || articleData?.thumbnail ?
                                contentTypeId === ContentType.ARTICLES && (
                                    articleData?.file ? (
                                        <GuidelinePdfDisplay data={articleData} />
                                    ) : articleData?.thumbnail ? (
                                        <InfographicImageDisplay data={articleData} />
                                    ) : null
                                )
                                : null}

                            {storyCastData?.file ?
                                contentTypeId === ContentType.STORYCASTS ?

                                    <InfographicImageDisplay data={storyCastData} />
                                    : null
                                : null}


                            {(contentTypeId === ContentType.ARTICLES || contentTypeId === ContentType.STORYCASTS) && (
                                <OpenArticleLinkButton
                                    // url="https://example.com/article"
                                    url={contentTypeId === ContentType.ARTICLES ? articleData?.event_url : storyCastData?.event_url}
                                    textStyle={{ color: '#000' }}
                                />
                            )}


                            {
                                (contentdetails === null && contentdetails?.content_type_id !== ContentType.DIRECTORY) ?
                                    <ContentActivityBar isLiked={isLiked} isFav={isFav} toggleFav={toggleFav} toggleLike={toggleLike} scrollToBottom={scrollToBottom} onShare={handleItemShareClick} />
                                    : null
                            }

                            {
                                chapter?.length !== 0
                                    ?

                                    (contentTypeId === ContentType.VIDEOS || contentTypeId === ContentType.PODCASTS) ?
                                        <ContentChapterBar currentTime={currentTime} changeChapter={changeChapter} data={chapter} />
                                        : null

                                    : null
                            }




                            {
                                content?.description && content?.description !== '' &&
                                (contentdetails === null || contentdetails?.content_type_id !== ContentType.DIRECTORY) && (
                                    <ContentDescription description={content.description} />
                                )
                            }

                            {
                                (contentdetails === null && contentdetails?.content_type_id !== ContentType.DIRECTORY)
                                    ?
                                    <ContentComment comments={comments} totalComments={totalComments} addComment={addComment} addCommentAPI={addCommentAPI} toggleCommentLike={toggleCommentLike} isAutoFocused={isutoFocusComment} onBlur={() => setAutoFocusComment(false)} />
                                    : null
                            }
                            {
                                (contentdetails === null && contentdetails?.content_type_id !== ContentType.DIRECTORY)
                                    ?
                                    <ContentRelated data={relatedContentData} onClickToggleLikeContentRelated={toggleLikeContentRelated} onScrollMore={fetchMoreRelatedContent} relatedContent hasMoreData={hasMoreData} />
                                    : null
                            }
                            {
                                (contentdetails !== null && contentdetails?.content_type_id === ContentType.DIRECTORY)
                                    ?

                                    staffDirectoryData?.length !== 0
                                        ?

                                        contentdetails?.content_type_id === ContentType.DIRECTORY &&
                                        <ContentStaffDirectory data={staffDirectoryData} onClickUser={onClickUser} onLoadMore={onLoadMore} isLoadingMore={isLoadingMoreSD} />

                                        :
                                        <View>
                                            <Text>No user found</Text>
                                        </View>

                                    : null
                            }





                        </ScrollView>
                    </KeyboardAvoidingView>

                    {
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={isStaffDirectoryVisible}
                            onRequestClose={() => {

                                setStaffDirectoryVisible(false)
                            }}
                            style={{ backgroundColor: 'green', }}
                        >
                            <View style={{

                                width: config.getWidth(85),
                                alignSelf: 'center',
                                maxHeight: config.getHeight(40),
                                marginTop: config.getHeight(40),
                                borderRadius: config.getWidth(2), borderWidth: 1, borderColor: borderColors.profileImage, backgroundColor: commonColors.white
                            }}>

                                <TouchableOpacity onPress={() => {
                                    setStaffDirectoryVisible(false)
                                }}>
                                    <Image
                                        style={{
                                            width: config.getWidth(5),
                                            height: config.getWidth(5), alignSelf: 'flex-end', margin: config.getWidth(2)
                                        }}
                                        source={Icons.cross}
                                        resizeMode='contain'

                                    />
                                </TouchableOpacity>



                                <ScrollView style={{
                                    borderRadius: config.getWidth(2)
                                }}>


                                    {
                                        StaffDirectoryUser?.email &&
                                        <TouchableOpacity onPress={() => {
                                            openEmail(StaffDirectoryUser?.email)
                                        }} style={{ margin: config.getWidth(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    Email:
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    {StaffDirectoryUser?.email}
                                                </Text>
                                            </View>

                                            {
                                                StaffDirectoryUser?.preferred_contact_method === 0
                                                    ?
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image
                                                            source={Icons.star}
                                                            style={{ width: config.getWidth(4), height: config.getWidth(4) }}
                                                            resizeMode='contain'
                                                        />
                                                    </View>
                                                    : null
                                            }



                                        </TouchableOpacity>
                                    }
                                    {
                                        StaffDirectoryUser?.cell_phone && (
                                            <TouchableOpacity
                                                onPress={() => openDialer(StaffDirectoryUser?.cell_phone)}
                                                style={{ margin: config.getWidth(2) }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'bold',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                        }}
                                                    >
                                                        Cell phone:
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'regular',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                            marginLeft: config.getWidth(2), // Adds spacing between label and number
                                                        }}
                                                    >
                                                        {StaffDirectoryUser?.cell_phone}
                                                    </Text>
                                                    {StaffDirectoryUser?.preferred_contact_method === 4 && (
                                                        <Image
                                                            source={Icons.star}
                                                            style={{
                                                                width: config.getWidth(4),
                                                                height: config.getWidth(4),
                                                                marginLeft: config.getWidth(2), // Adds spacing between number and icon
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }

                                    {
                                        StaffDirectoryUser?.home_phone &&
                                        <TouchableOpacity onPress={() => {
                                            openDialer(StaffDirectoryUser?.home_phone)
                                        }} style={{ margin: config.getWidth(2) }}>
                                            <View>


                                                <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    Home:
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    {StaffDirectoryUser?.home_phone}
                                                </Text>
                                            </View>

                                            {
                                                StaffDirectoryUser?.preferred_contact_method === 2
                                                    ?
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image
                                                            source={Icons.star}
                                                            style={{ width: config.getWidth(4), height: config.getWidth(4) }}
                                                            resizeMode='contain'
                                                        />
                                                    </View>
                                                    : null
                                            }
                                        </TouchableOpacity>
                                    }
                                    {
                                        StaffDirectoryUser?.office_phone &&
                                        <TouchableOpacity onPress={() => {
                                            openDialer(StaffDirectoryUser?.office_phone)
                                        }} style={{ margin: config.getWidth(2) }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text
                                                    style={{
                                                        fontFamily: 'bold',
                                                        fontSize: config.generateFontSizeNew(14),
                                                        color: commonColors.black,
                                                    }}
                                                >
                                                    Office:
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: 'regular',
                                                        fontSize: config.generateFontSizeNew(14),
                                                        color: commonColors.black,
                                                        marginLeft: config.getWidth(2), // Adds some spacing between label and number
                                                    }}
                                                >
                                                    {StaffDirectoryUser?.office_phone}
                                                </Text>
                                                {StaffDirectoryUser?.preferred_contact_method === 3 && (
                                                    <Image
                                                        source={Icons.star}
                                                        style={{
                                                            width: config.getWidth(4),
                                                            height: config.getWidth(4),
                                                            marginLeft: config.getWidth(2), // Adds spacing between number and icon
                                                        }}
                                                        resizeMode="contain"
                                                    />
                                                )}
                                            </View>

                                        </TouchableOpacity>
                                    }
                                    {
                                        StaffDirectoryUser?.other_phone &&
                                        <TouchableOpacity onPress={() => {
                                            openDialer(StaffDirectoryUser?.other_phone)
                                        }} style={{ margin: config.getWidth(2) }}>
                                            <View>


                                                <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    Other:
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: commonColors.black }}>
                                                    {StaffDirectoryUser?.other_phone}
                                                </Text>
                                            </View>
                                            {/* {
                                                    staffDirectoryData?.preferred_contact_method === 0
                                                        ?
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image
                                                                source={Icons.star}
                                                                style={{ width: config.getWidth(4), height: config.getWidth(4) }}
                                                                resizeMode='contain'
                                                            />
                                                        </View>
                                                        : null
                                                } */}
                                        </TouchableOpacity>
                                    }
                                    {
                                        StaffDirectoryUser?.pager && (
                                            <TouchableOpacity
                                                onPress={() => openDialer(StaffDirectoryUser?.pager)}
                                                style={{ margin: config.getWidth(2) }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'bold',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                        }}
                                                    >
                                                        Pager:
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'regular',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                            marginLeft: config.getWidth(2), // Adds spacing between label and number
                                                        }}
                                                    >
                                                        {StaffDirectoryUser?.pager}
                                                    </Text>
                                                    {StaffDirectoryUser?.preferred_contact_method === 5 && (
                                                        <Image
                                                            source={Icons.star}
                                                            style={{
                                                                width: config.getWidth(4),
                                                                height: config.getWidth(4),
                                                                marginLeft: config.getWidth(2), // Adds spacing between number and icon
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }

                                    {
                                        StaffDirectoryUser?.phone && (
                                            <TouchableOpacity
                                                onPress={() => openDialer(StaffDirectoryUser?.phone)}
                                                style={{ margin: config.getWidth(2) }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'bold',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                        }}
                                                    >
                                                        Phone:
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'regular',
                                                            fontSize: config.generateFontSizeNew(14),
                                                            color: commonColors.black,
                                                            marginLeft: config.getWidth(2), // Adds spacing between label and number
                                                        }}
                                                    >
                                                        {StaffDirectoryUser?.phone}
                                                    </Text>
                                                    {StaffDirectoryUser?.preferred_contact_method === 1 && (
                                                        <Image
                                                            source={Icons.star}
                                                            style={{
                                                                width: config.getWidth(4),
                                                                height: config.getWidth(4),
                                                                marginLeft: config.getWidth(2), // Adds spacing between number and icon
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }

                                </ScrollView>



                            </View>
                        </Modal>
                    }
                </>
            }



        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    },
    modalBackground: {
        width: config.getWidth(80),
        height: config.getHeight(35),
        backgroundColor: 'rgba(255, 255, 255, 0)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center'
    },
    modalContent: {
        backgroundColor: commonColors.white,
        width: config.getWidth(80),
        height: config.getHeight(35),
        //flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: commonColors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalSubContent: {
        flex: 1,
        alignItems: 'center',
        width: config.getWidth(78)
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(0),
    },
})

export default Content
