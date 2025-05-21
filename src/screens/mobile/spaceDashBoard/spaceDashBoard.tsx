import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import Icons from '@/src/assets/icons';
import SpaceContainer from '@/src/components/spcesContainer';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_HUBS_MOBILE, GET_SPACE_CONTENT_ID, GET_SPACE_INFO_BY_ID, GET_SPACES_MOBILE, GET_SUBSCRIBED_SPACES_HUB_MOBILE } from '@/src/services/QueryMethod';
import Search from '@/src/components/search';
import { REQUEST_SPACE_ACCESS } from '@/src/services/MutationMethod';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setHub, setRefresh, setSpace } from '@/src/redux/action';
import ContentIcon from '@/src/components/atoms/contentIcon/contentIcon';
import ResourceIcon from '@/src/components/atoms/resourceIcon/resourceIcon';
import SpaceSubHeader from '@/src/components/spaceSubHeader';
import PortalIcon from '@/src/components/atoms/portalsIcon/portalsIcon';
import CollectionBar from '@/src/components/atoms/collectionsBar/collectionBar';
import ContentType from '@/src/utils/contentTypeIds';



const SpaceDashBoard: React.FC = (props) => {
    const [featuredContentData, setFeaturedContentData] = useState<any>(null)
    const [portalsContentData, setPortalsContentData] = useState<any>(null)

    const [otherResourceContentData, setOtherResourceContentData] = useState<any>(null)

    const [visibleFeaturedContent, setVisibleFeaturedContent] = useState(true)
    const [visiblePortalContent, setVisiblePortalContent] = useState(false)
    const [visibleOtherResourcesContent, setVisibleOtherResourcesContent] = useState(false)
    const [visibleFCSpacesContent, setVisibleFCSpacesContent] = useState(false)
    const [spaceColor, setSpaceColor] = useState<string>("")
    const [refreshing, setRefreshing] = useState<boolean>(false);
    // const [refresh, setRefresh] = useState<boolean>(false);
    const refresh = useSelector((state: any) => state.reducer.refresh)
    const space = useSelector((state: any) => state.reducer.space)
    const [search, setSearch] = useState<string>("")


    // const [getSpaceInfoById] = useLazyQuery(GET_SPACE_INFO_BY_ID)

    let input = search !== "" ? {
        space_id: space?.id,
        keyword: search

    } : {
        space_id: space?.id,

    }

    const { data, loading, error, refetch } = useQuery(GET_SPACE_INFO_BY_ID, {
        variables: {
            input: input
        },
        fetchPolicy: "network-only", // Forces refetching
        onError: (error) => {
                    Alert.alert(
                        "",
                        error?.message,
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    navigationService.reset([
                                        {
                                            name: RouteNames.HomeNavigator,
                                            params: {}
                                        }
                                    ]);
                                },
                            },
                        ],
                        { cancelable: false } // Ensures the alert can't be dismissed without clicking "OK"
                    );
                }
    }
    )
    // const [getSpaceInfoById] = useLazyQuery(GET_SPACE_INFO_BY_ID, {
    //     fetchPolicy: "network-only", // Forces refetching
    // }
    // )
    const [isLoading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch()
    const isFocused = useIsFocused(); // Check if screen is focused
    const [searchQuery, setSearchQuery] = useState('');




    // useEffect(() => {
    //     console.log("LOADING", loading)
    //     onRefresh()
    // }, [refresh])
    useEffect(() => {

        if (!loading) {

            reArrangeData(data?.getSpaceInfoById?.spaceInfo)
        }

    }, [loading])

    const reArrangeData = (response: any) => {
        let spaceDashboardCard = {
            spaceid: response?.id,
            spaceName: response?.name,
            spaceLogo: response?.logo_path,
            spaceColor: response?.color
        }

        let spaceCards = []



        let space_cards_info = response?.space_cards
        let space_collectins = response?.space_collections
        console.log("PORTALSRESPONSE:", response?.portals.length)
        setSpaceColor(response?.color)
        if (response?.portals.length !== 0) {
            const portas_cards_info = response?.portals
            setPortalsContentData(portas_cards_info)
        }

        if (space_collectins?.length !== 0) {
            const collections = []
            for (let key in space_collectins) {
                const collection = {
                    id: space_collectins[key]?.id,
                    name: space_collectins[key]?.collection_name
                }
                collections.push(collection)
            }
            setOtherResourceContentData(collections)
        }

        for (let key in space_cards_info) {
            const spaceCard = {
                id: space_cards_info[key]?.id,
                name: (space_cards_info[key]?.name).toUpperCase()
            }

            if (space_cards_info[key]?.name === "Featured Content") {
                const associate_content = space_cards_info[key]?.associated_content_types
                let is_staff_directory_visible = response?.is_staff_directory_visible

                // const featured_content = []
                const associatedContentTypes = []
                for (let i in associate_content) {
                    console.log("spaceContentIdParams", response?.data?.getSpaceInfoById?.spaceInfo)

                    const content = {
                        content_type_id: associate_content[i]?.id,
                        card_id: space_cards_info[key]?.id,
                        space_id: response?.id,
                        title: associate_content[i]?.name,
                        icon: associate_content[i]?.content_icon,

                    }
                    console.log("FETURED CONTENT RESPONSE:", content)

                    associatedContentTypes.push(content)
                }

                const content = {
                    content_type_id: ContentType.DIRECTORY,
                    card_id: null,
                    space_id: response?.id,
                    title: "Directory",
                    icon: Icons.contentDirectory,

                }
                if (is_staff_directory_visible) {
                    associatedContentTypes.push(content)
                }
                spaceCard["associatedContentTypes"] = associatedContentTypes
                setFeaturedContentData(associatedContentTypes)
            }


            spaceCards.push(spaceCard)
            setLoading(false)

        }

        spaceDashboardCard["spaceCards"] = spaceCards
        console.log("spaceDashboardCard", spaceDashboardCard)
    }


    const onClickPoratslSpace = (item: any) => {
        // console.log("OnCLICKSPACES", item)
        // setSpaceId(item.id)







        let space = {
            id: item?.id,
            logo: item?.logo_path,
            name: item?.name,
        }
        dispatch(setSpace(space))
        setFeaturedContentData(null)
        setPortalsContentData(null)
        setOtherResourceContentData(null)
        setVisibleFeaturedContent(true)
        setVisiblePortalContent(false)
        setVisibleOtherResourcesContent(false)
        setVisibleFCSpacesContent(false)
        dispatch(setRefresh(!refresh))
        setRefreshing(true);
        setLoading(true)
        // setRefresh(!refresh)

        navigationService.navigate(RouteNames.SpaceDashBoard)
        // setRequestModalVisible(true)
    }

    const onRefresh = async () => {

        setRefreshing(true);
        setLoading(true)


        let response = await refetch(
            {
                input: {
                    space_id: space?.id
                }
            }
        )

        // let response = await getSpaceInfoById({
        //     variables: {
        //         input: {
        //             space_id: space?.id
        //         }
        //     }
        // })

        console.log("response11", response?.data?.getSpaceInfoById?.spaceInfo)
        reArrangeData(response?.data?.getSpaceInfoById?.spaceInfo)




        setRefreshing(false);

    };


    const onSearch = async (value: string) => {

        setSearch(value)
        setRefreshing(true);
        setLoading(true)

        let response = await refetch(
            {
                input: {
                    space_id: space?.id,
                    keyword: value
                }
            }
        )

        // let response = await getSpaceInfoById({
        //     variables: {
        //         input: {
        //             space_id: space?.id,
        //             keyword: value
        //         }
        //     }
        // })

        reArrangeData(response?.data?.getSpaceInfoById?.spaceInfo)




        setRefreshing(false);
    }






    return (

        <View style={styles.container}>

            <Header back={true} profile={true}
            />
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            ) :

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                        <SpaceSubHeader />
                        <Search isSearchOnKeyboardButton={true} onSearch={onSearch} isSearchIconVisible={true} initialSearchText={search} />

                        {
                            featuredContentData?.length !== 0
                                ?


                                <View style={[styles.cardContainer, {

                                    borderColor: spaceColor
                                }]}>
                                    <TouchableOpacity onPress={() => {
                                        setVisibleFeaturedContent(!visibleFeaturedContent)
                                        setVisiblePortalContent(false)
                                        setVisibleOtherResourcesContent(false)
                                        setVisibleFCSpacesContent(false)
                                    }} style={{ marginBottom: visibleFeaturedContent ? config.getHeight(1) : null, width: config.getWidth(90), justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.cardHeaderText}>
                                            FEATURED CONTENT
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        visibleFeaturedContent ?
                                            <View style={{
                                                flexDirection: 'row',
                                                // width: config.getWidth(85),
                                                justifyContent: 'center', alignItems: 'center',
                                                // backgroundColor: 'pink'

                                            }}>
                                                <FlatList
                                                    data={featuredContentData}
                                                    renderItem={({ item, index }) => <ContentIcon spaceColor={spaceColor} item={item} lastRow={index >= (featuredContentData.length - 1) - (featuredContentData.length) % 3} />}
                                                    keyExtractor={item => item?.content_type_id}
                                                    numColumns={3}
                                                    scrollEnabled={false}
                                                    style={{}}
                                                    extraData={featuredContentData}

                                                    // columnWrapperStyle={{
                                                    //     //flex: 1,
                                                    //     justifyContent: "flex-start", alignItems: 'flex-start'
                                                    // }}
                                                    contentContainerStyle={{}}

                                                />

                                            </View>
                                            : null

                                    }
                                </View>
                                : null
                        }
                        {
                            portalsContentData !== null
                                ?
                                <View style={[styles.cardContainer, {

                                    borderColor: spaceColor,
                                    marginTop: config.getHeight(3),
                                }]}>
                                    <TouchableOpacity onPress={() => {
                                        setVisiblePortalContent(!visiblePortalContent)

                                        setVisibleFeaturedContent(false)

                                        setVisibleOtherResourcesContent(false)
                                        setVisibleFCSpacesContent(false)
                                    }} style={{ marginBottom: visiblePortalContent ? config.getHeight(1) : null, width: config.getWidth(90), justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.cardHeaderText}>
                                            PORTALS
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        visiblePortalContent ?
                                            <View style={{
                                                flexDirection: 'row',
                                                // width: config.getWidth(85),
                                                justifyContent: 'center', alignItems: 'center',

                                            }}>
                                                <FlatList
                                                    data={portalsContentData}
                                                    renderItem={({ item }) => <PortalIcon spaceColor={spaceColor} item={item} onClickPoratslSpace={onClickPoratslSpace} />}
                                                    keyExtractor={item => item.id}
                                                    numColumns={3}
                                                    scrollEnabled={false}
                                                    style={{ alignSelf: 'center' }}
                                                    extraData={featuredContentData}
                                                />

                                            </View>
                                            : null

                                    }
                                </View>
                                : null}

                        {
                            otherResourceContentData !== null &&
                            <View style={[styles.cardContainer, {

                                borderColor: spaceColor,
                                marginTop: config.getHeight(3),
                            }]}>

                                <TouchableOpacity onPress={() => {
                                    setVisibleOtherResourcesContent(!visibleOtherResourcesContent)
                                    setVisiblePortalContent(false)
                                    setVisibleFeaturedContent(false)
                                    setVisibleFCSpacesContent(false)
                                }} style={{ marginBottom: visibleOtherResourcesContent ? config.getHeight(1) : null, width: config.getWidth(90), justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.cardHeaderText}>
                                        OTHER RESOURCES
                                    </Text>
                                </TouchableOpacity>
                                {
                                    visibleOtherResourcesContent ?
                                        <View style={{
                                            flexDirection: 'row',
                                            // width: config.getWidth(85),
                                            justifyContent: 'center', alignItems: 'center',

                                        }}>
                                            <FlatList
                                                data={otherResourceContentData}
                                                renderItem={({ item }) => <CollectionBar spaceColor={spaceColor} item={item} />}
                                                keyExtractor={item => item.id}

                                                // scrollEnabled={false}
                                                style={{ alignSelf: 'center', marginTop: config.getHeight(1) }}

                                            />

                                        </View>
                                        : null
                                }
                            </View>

                        }
                    </View>
                </ScrollView>
            }


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: commonColors.white
    },
    cardContainer: {
        width: config.getWidth(90),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: config.getHeight(1),
        paddingVertical: config.getHeight(1),
        backgroundColor: commonColors.white,
        borderRadius: config.getWidth(3),
        borderWidth: 1,
    },
    cardHeaderText: {
        fontFamily: 'bold', fontSize: config.generateFontSizeNew(16)
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
})

export default SpaceDashBoard
