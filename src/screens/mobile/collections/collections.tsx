import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform, Share, Image, Linking, Alert, ActivityIndicator, FlatList } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import Header from '@/src/components/header';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_SPACE_COLLECTION_CONTENT_ID } from '@/src/services/QueryMethod';
import { useDispatch, useSelector } from 'react-redux';
import CollectionBar from '@/src/components/atoms/collectionsBar/collectionBar';
import SearchContent from '@/src/components/searchContent';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
import { TOGGLE_CONTENT_LIKE } from '@/src/services/MutationMethod';
import * as Clipboard from 'expo-clipboard';
import Analytics from '@/src/services/Analytics';







const Collections: React.FC = (props: any) => {

    const collection = useSelector((state: any) => state.reducer.collection)
    const space = useSelector((state: any) => state.reducer.space)
    console.log("space:", space)
    console.log("collection", collection)
    const dispatch = useDispatch()
    const [subCollection, setSubColllection] = useState<any[]>([])
    const [collectionContentData, setCollectionContentData] = useState<any[]>([])
    const [collectionContent, setCollectionContent] = useState<any>()
    const refresh = useSelector((state: any) => state.reducer.refresh)
    const [isLoading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [requestToggleLike] = useMutation(TOGGLE_CONTENT_LIKE);

    const PAGE_SIZE = 5;
    const spaceColor = props.route?.params?.spaceColor || '#FFFFFF';

    const [spaceCollection] = useLazyQuery(GET_SPACE_COLLECTION_CONTENT_ID,
        {
            fetchPolicy: "network-only", // Forces refetching
        }
    )

    useEffect(() => {
        setLoading(true)
        setCurrentPage(1)
        setHasMoreData(true)
        setIsLoadingMore(false)
        console.log("arrangeCollectionaContentAndSubCollection", collection)
        arrangeCollectionaContentAndSubCollection(1)
    }, [refresh])

    const arrangeCollectionaContentAndSubCollection = async (page: number) => {
        const spaceCollectionData = await spaceCollection({
            variables: {
                input: {
                    space_collection_id: collection?.id,
                    page: page,
                    page_size: PAGE_SIZE
                }
            }

        })


        if (spaceCollectionData?.data?.getSpaceCollectionContentsById?.success) {
            let sub_collections = spaceCollectionData?.data?.getSpaceCollectionContentsById?.sub_space_collections
            let sub_collections_Content_Data = spaceCollectionData?.data?.getSpaceCollectionContentsById?.spaceCollectionContentData
            console.log('arrangeCollectionaContentAndSubCollection', spaceCollectionData?.data?.getSpaceCollectionContentsById)
            const pagination = spaceCollectionData?.data?.getSpaceCollectionContentsById?.pagination || {};

            let collections = []
            for (let key in sub_collections) {
                let sub_colllection = {
                    id: sub_collections[key]?.id,
                    name: sub_collections[key]?.collection_name,
                }
                collections.push(sub_colllection)
            }
            setSubColllection(collections)



            let collectionDataList = [] as any

            for (let key in sub_collections_Content_Data) {
                let collection_data = {
                    id: sub_collections_Content_Data[key]?.id,
                    name: sub_collections_Content_Data[key]?.name,
                    color: sub_collections_Content_Data[key]?.color,
                    collection_content: sub_collections_Content_Data[key]?.space_collection_category_contents
                }
                // console.log("setCollectionContent", sub_collections_Content_Data[key]?.space_collection_category_contents, sub_collections_Content_Data[key]?.space_collection_category_contents?.space_info)
                setCollectionContent(sub_collections_Content_Data[key]?.space_collection_category_contents)

                collectionDataList.push(collection_data)

                // collections.push(sub_colllection)
            }
            setCollectionContentData(collectionDataList)
            // setCollectionContentData(prevData =>
            //     page === 1 ? collectionDataList : [...prevData, ...collectionDataList]
            // );
            setHasMoreData(
                pagination?.total_records > page * PAGE_SIZE
            );

            Analytics.loadFeedEvent("Feed", page)

            setLoading(false)
        }
        else {
            setHasMoreData(false)
        }
        setIsLoadingMore(false);

    }

    const getPaginationData = async (page: number) => {
        const spaceCollectionData = await spaceCollection({
            variables: {
                input: {
                    space_collection_id: collection?.id,
                    page: page,
                    page_size: PAGE_SIZE
                }
            }

        })


        if (spaceCollectionData?.data?.getSpaceCollectionContentsById?.success) {

            let sub_collections_Content_Data = spaceCollectionData?.data?.getSpaceCollectionContentsById?.spaceCollectionContentData

            const pagination = spaceCollectionData?.data?.getSpaceCollectionContentsById?.pagination || {};
            const newdata = sub_collections_Content_Data[0]?.space_collection_category_contents




            if (newdata) {
                setCollectionContent(prevData =>
                    page === 1 ? newdata : [...prevData, ...newdata]
                );
            }

            setHasMoreData(
                pagination?.total_records > page * PAGE_SIZE
            );
            Analytics.loadFeedEvent("Feed", page)

            setLoading(false)
        }
        else {
            setHasMoreData(false)
        }
        setIsLoadingMore(false);
    }



    const redirectOnItemClick = (item: string) => {
        dispatch(setContentId(Number(item)))
        dispatch(setContent(null))
        dispatch(setSpaceDashBoard(false))
        dispatch(setStartfromSpaceDashBoard(false))
        navigationService.navigate(RouteNames.Content)
    };

    const handleItemLikeClick = (item: string) => {
        toggleLike(item);
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
                setCollectionContentData(prevItems =>
                    prevItems.map(collection => ({
                        ...collection,
                        collection_content: collection.collection_content.map((content: { id: string; is_liked: any; }) =>
                            content.id === contentId
                                ? { ...content, is_liked: !content.is_liked }
                                : content
                        ),
                    }))
                );
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleItemChatClick = (id: string) => {
        navigationService.navigate(RouteNames.CommentsScreen, { commentsID: id });
    };

    const handleItemShareClick = async (item: any) => {
        try {
            const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item)}`;
            const message = Platform.OS === 'android' ? `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item)}` : ``
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

    const renderFooter = () => {

        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );



    };

    const loadMoreData = () => {
        if (hasMoreData) {
            setIsLoadingMore(true);
            getPaginationData(currentPage + 1)
            setCurrentPage(currentPage + 1)
        }
    };

    return (

        <View style={styles.container}>


            <Header collection={true} profile={true} back={true} />

            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            ) :
                <ScrollView>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: config.getHeight(3) }}>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), textAlign: 'center' }}>{collection?.name}</Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(18), textAlign: 'center', fontWeight: '600' }}>{space?.name} Collections</Text>
                    </View>

                    {
                        subCollection?.length !== 0 &&
                        <View style={{
                            width: config.getWidth(90),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: config.getHeight(3),
                            paddingHorizontal: config.getHeight(1),
                            paddingVertical: config.getHeight(1),
                            backgroundColor: commonColors.white,
                            borderRadius: config.getWidth(3),
                            borderWidth: 1,
                            borderColor: commonColors.black
                        }}>
                            <TouchableOpacity onPress={() => {

                            }} style={{ marginBottom: config.getHeight(1), width: config.getWidth(90), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: 'bold', fontSize: config.generateFontSizeNew(14)
                                }}>
                                    Sub Collections
                                </Text>
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: 'row',
                                // width: config.getWidth(85),
                                justifyContent: 'center', alignItems: 'center',

                            }}>
                                <FlatList
                                    data={subCollection}
                                    renderItem={({ item }) => <CollectionBar spaceColor={spaceColor} item={item} />}
                                    keyExtractor={item => item.id}

                                    style={{ alignSelf: 'center', marginTop: config.getHeight(1) }}

                                />

                            </View>




                        </View>

                    }


                    <FlatList
                        data={collectionContentData}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={renderFooter}
                        renderItem={({ item }) => (
                            <View style={{
                                borderRadius: config.getWidth(3),
                                borderWidth: 1,
                                borderColor: item?.color, marginTop: config.getHeight(2), overflow: 'hidden'
                            }}>
                                <Text style={{ color: item?.color, fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), marginLeft: config.getWidth(2), marginTop: config.getWidth(2), }}>
                                    {
                                        item?.name
                                    }
                                </Text>
                                <FlatList
                                    data={collectionContent}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}

                                    renderItem={({ item }) => (
                                        <View style={{}}>
                                            <SearchContent
                                                itemTitle={item?.content_type_info?.name}
                                                title={item?.content_title}
                                                spaceInfo={item?.space_info}
                                                subtitle={stripHtmlTags(item?.description)}
                                                is_liked={item?.is_liked}
                                                contentIconSource={item?.content_type_info?.content_icon}
                                                itemIconSource={item?.associated_content_files?.[0]?.thumbnail}
                                                contentType={item?.content_type_info?.id}
                                                onLikePress={() => handleItemLikeClick(item?.id)}
                                                onChatPress={() => handleItemChatClick(item?.id)}
                                                onSharePress={() => handleItemShareClick(item?.id)}
                                                onItemClick={() => redirectOnItemClick(item?.id)}
                                            />
                                        </View>
                                    )}

                                />
                            </View>


                        )}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: config.getHeight(5),
                                    fontFamily: 'regular',
                                    fontSize: config.generateFontSizeNew(18),
                                    color: 'gray',
                                }}
                            >
                                {subCollection?.length === 0 ? 'No data found' : ''}
                            </Text>
                        }



                    />

                </ScrollView>
            }

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
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
})

export default Collections
