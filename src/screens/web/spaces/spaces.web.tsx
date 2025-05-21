import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Image, ActivityIndicator, Keyboard, Linking } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, textColors, borderColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderWeb from '@/src/components/headerWeb';
import { useDispatch, useSelector } from 'react-redux';
import LogoText from '@/src/components/logoText';
import Search from '@/src/components/search';
import SpaceTrackBar from '@/src/components/spaceTrackBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_HUBS_FILTER_SEARCH_MOBILE, GET_HUBS_MOBILE, GET_HUBS_WEB, GET_SPACES_FILTER_SEARCH_MOBILE, GET_SPACES_MOBILE, GET_SPACES_WEB, GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE, GET_SUBSCRIBED_SPACES_HUB_MOBILE, GET_SUBSCRIBED_SPACES_HUB_WEB } from '@/src/services/QueryMethod';
import { ScrollView } from 'react-native-gesture-handler';
import WebBaseLayout from '@/src/components/webBaseLayout';
import SpaceContainer from '@/src/components/spcesContainer';
import Icons from '../../../assets/icons';
import { useIsFocused } from '@react-navigation/native';
import { setHub, setImageLoading, setSpace } from "../../../redux/action"
import { REQUEST_SPACE_ACCESS } from '@/src/services/MutationMethod';
import Analytics from '@/src/services/Analytics';




const Spaces: React.FC = (props) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [requestSent, setRequestSent] = useState(false)
    const [spaceId, setSpaceId] = useState<number>()
    const [hubId, setHubId] = useState<number>()
    const [requestModalVisible, setRequestModalVisible] = useState(false)
    const [requestAccess] = useMutation(REQUEST_SPACE_ACCESS)
    const [refresh, setRefresh] = useState<boolean>(false)
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const space = useSelector((state: any) => state.reducer.space)
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("")

    const [currentPageSpace, setCurrentPageSpace] = useState(1);
    const [hasMoreDataSpace, setHasMoreDataSpace] = useState(true);
    const [totalDataSpace, setTotalDataSpace] = useState<number>(0);
    const [isLoadingMoreSpace, setIsLoadingMoreSpace] = useState(false);
    const [isLoadingSpace, setLoadingSpace] = useState<boolean>(true);

    const PAGE_SIZE_SPACE = 6;

    const [currentPageSubSpace, setCurrentPageSubSpace] = useState(1);
    const [hasMoreDataSubSpace, setHasMoreDataSubSpace] = useState(true);
    const [totalDataSubSpace, setTotalDataSubSpace] = useState<number>(0);
    const [isLoadingMoreSubSpace, setIsLoadingMoreSubSpace] = useState(false);
    const [isLoadingSubSpace, setLoadingSubSpace] = useState<boolean>(true);

    const PAGE_SIZE_SUB_SPACE = 6;

    const [search, setSearch] = useState<string>("")
    const [selectedFilter, setSelectedFilter] = useState<string>("")
    const [filterVisible, setFilterVisible] = useState<boolean>(false)
    const filterRef = useRef(null);

    const {
        data: hubsData,
        loading: hubsLoading,
        error: hubsError,
        refetch: hubsRefetch
    } = useQuery(GET_HUBS_MOBILE)




    const [getFilteredSpaces] = useLazyQuery(GET_SPACES_FILTER_SEARCH_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    })
    const [getFilteredHubSpaces] = useLazyQuery(GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    })
    const [getFilteredHub] = useLazyQuery(GET_HUBS_FILTER_SEARCH_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    })




    const [subscribedData, setSubscribedData] = useState<any>()
    const [hubData, sethubData] = useState<any>()
    const [spaceData, setSpacesData] = useState<any>()
   
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setRequestModalVisible(false);
        });

        // Cleanup the listener when the component unmounts
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);



    const arrangeHubData = (data: any) => {
        let hubs = []
        for (let key in data?.getHubs?.hubs) {
            // console.log("HUBDATA", hubsData?.getHubs?.hubs[key])
            let hub = {
                id: data?.getHubs?.hubs[key]?.id,
                logo: data?.getHubs?.hubs[key]?.logo_path,
                name: data?.getHubs?.hubs[key]?.name,
                isLoading: true
            }
            hubs.push(hub)
        }
        if (hubs.length === 0) {
            sethubData(null)
        }
        else {
            sethubData(hubs)
        }

    }



    const arrangeSpaceData = (data: any, page: number) => {
        //console.log("arrangeSpaceData", data?.getSpaces)
        if (data?.getSpaces?.success) {
            const newData = data?.getSpaces?.spaces || [];
            const pagination = data?.getSpaces?.pagination || {};
            let spaces = []
            for (let key in newData) {

                let space = {
                    id: newData[key]?.id,
                    logo: newData[key]?.logo_path,
                    space_type: newData[key]?.space_type_id,
                    request_status: newData[key]?.subscribed_users
                        ? newData[key]?.subscribed_users[0]?.subscription_status?.request_status
                        : null,
                    name: newData[key]?.name,
                    isLoading: true
                }
                // console.log("SPACEDATA", space)
                spaces.push(space)
            }
            // setSpacesData(spaces)
            setSpacesData(prevData =>
                page === 1 ? spaces : [...prevData, ...spaces]
            );
            setHasMoreDataSpace(
                pagination?.total_records > page * PAGE_SIZE_SPACE
            );
            setTotalDataSpace(pagination?.total_records)
            // setIsLoading(false)
            setTimeout(() => {
                setLoadingSpace(false)
            }, 1000)
        }
        else {
            setHasMoreDataSpace(false)
            setTimeout(() => {
                setLoadingSpace(false)
            }, 1000)
        }
    }




    const arrangeSubSpaceHubData = (data: any, page: number) => {

        if (data?.getDashboardData?.success) {
            let subData = []
            let hubs = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.hubs
            let spaces = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces
            const pagination = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.pagination || {};
            if (hubs?.length !== 0) {
                for (let key in hubs) {
                    // console.log("SUBSPACEDATA", hubs[key])
                    let hub = {
                        id: hubs[key]?.id,
                        logo: hubs[key]?.logo_path,
                        name: hubs[key]?.name,
                        isLoading: true
                    }
                    subData.push(hub)
                }
            }

            if (spaces?.length !== 0) {

                for (let key in spaces) {
                    // console.log("SPACEDATA", spaces[key])
                    let space = {
                        id: spaces[key]?.id,
                        logo: spaces[key]?.logo_path,
                        name: spaces[key]?.name,
                        isLoading: true

                    }
                    subData.push(space)
                }
            }
            // setSubscribedData(subData)


            setSubscribedData(prevData =>
                page === 1 ? subData : [...prevData, ...subData]
            );

            setHasMoreDataSubSpace(
                pagination?.total_records > page * PAGE_SIZE_SPACE
            );
            setTotalDataSubSpace(pagination?.total_records)

            setTimeout(() => {
                setLoadingSubSpace(false)
            }, 1000)


        }
        else {
            setHasMoreDataSubSpace(false)
            setTimeout(() => {
                setLoadingSubSpace(false)
            }, 1000)
        }

    }

    useEffect(() => {
        if (!hubsLoading) {
            // console.log("HUBDATA", hubsData?.getHubs?.hubs)
            arrangeHubData(hubsData)
            // if(hubData?.getHubs?.hubs)
        }

    }, [hubsLoading]);



    useEffect(() => {
        if (!hubsLoading) {

            setLoading(false)
        }

    }, [hubsLoading])




    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const resSubSpaceHub = await getFilteredHubSpaces(
            {
                variables: {
                    input: {

                        page_size: PAGE_SIZE_SUB_SPACE,
                        page: 1,
                    }
                }
            }
        )
        // console.log("seeSubSpaceMore", resSubSpaceHub?.data)
        if (resSubSpaceHub?.data?.getDashboardData?.success) {
            arrangeSubSpaceHubData(resSubSpaceHub?.data, 1)
            setCurrentPageSubSpace(1)

        }
        const resSpace = await getFilteredSpaces(
            {
                variables: {
                    input: {

                        page_size: PAGE_SIZE_SPACE,
                        page: 1,
                    }
                }
            }
        )
        if (resSpace?.data?.getSpaces?.success) {
            arrangeSpaceData(resSpace?.data, 1)
            setCurrentPageSpace(1)
        }
        const resHub = await hubsRefetch()
        console.log("RES", resSubSpaceHub, resHub)
        if (resHub?.data) {
            arrangeHubData(resHub?.data)
        }
        setRefreshing(false);
    }, []);

    const seeSubSpaceMore = async () => {

        if (hasMoreDataSubSpace) {

            const resSubSpaceHub = await getFilteredHubSpaces(
                {
                    variables: {
                        input: {

                            page_size: PAGE_SIZE_SUB_SPACE,
                            page: currentPageSubSpace + 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",
                            name: search ? search : "",
                        }
                    }
                }
            )
            // console.log("seeSubSpaceMore", resSubSpaceHub?.data)
            if (resSubSpaceHub?.data?.getDashboardData?.success) {

                arrangeSubSpaceHubData(resSubSpaceHub?.data, currentPageSubSpace + 1)
                setCurrentPageSubSpace(currentPageSubSpace + 1)

            }

        }

    }

    const seeSpaceMore = async () => {

        if (hasMoreDataSpace) {

            const resSpace = await getFilteredSpaces(
                {
                    variables: {
                        input: {

                            page_size: PAGE_SIZE_SPACE,
                            page: currentPageSpace + 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",
                            name: search ? search : "",
                        }
                    }
                }
            )
            // console.log("seeSpaceMore", resSpace?.data)

            if (resSpace?.data?.getSpaces?.success) {

                arrangeSpaceData(resSpace?.data, currentPageSpace + 1)
                setCurrentPageSpace(currentPageSpace + 1)

            }

        }

    }



    useEffect(() => {

        const init = async () => {
            setLoadingSpace(true)
            setLoadingSubSpace(true)
            const resSpace = await getFilteredSpaces(
                {
                    variables: {
                        input: {

                            page_size: PAGE_SIZE_SPACE,
                            page: currentPageSpace,
                            sort_option: filter ? filter : "Alphabetically A-Z",
                            name: search ? search : "",
                        }
                    }
                }
            )

            const resSubSpaceHub = await getFilteredHubSpaces({
                variables: {
                    input: {

                        page_size: PAGE_SIZE_SPACE,
                        page: currentPageSpace,
                        sort_option: filter ? filter : "Alphabetically A-Z",
                        name: search ? search : "",
                    }
                }
            })
            if (resSpace?.data) {
                arrangeSpaceData(resSpace?.data, 1)

            }
            if (resSubSpaceHub?.data) {
                arrangeSubSpaceHubData(resSubSpaceHub?.data, 1)
            }
        }


        init()
    }, [])



    useEffect(() => {

        const refetchData = async () => {



            const resSubSpaceHub = await getFilteredHubSpaces(
                {
                    variables: {
                        input: {

                            page_size: currentPageSubSpace * PAGE_SIZE_SUB_SPACE,
                            page: 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",
                            name: search ? search : "",
                        }
                    }
                }
            )
            // console.log("seeSubSpaceMore", resSubSpaceHub?.data)
            if (resSubSpaceHub?.data?.getDashboardData?.success) {

                arrangeSubSpaceHubData(resSubSpaceHub?.data, 1)
                // setCurrentPageSubSpace(1)

            }

            const resSpace = await getFilteredSpaces(
                {
                    variables: {
                        input: {

                            page_size: currentPageSpace * PAGE_SIZE_SPACE,
                            page: 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",
                            name: search ? search : "",
                        }
                    }
                }
            )
            if (resSpace?.data?.getSpaces?.success) {
                arrangeSpaceData(resSpace?.data, 1)
                // setCurrentPageSpace(1)
            }
            const resHub = await hubsRefetch()
            if (resHub?.data) {
                arrangeHubData(resHub?.data)
            }
            setLoading(false)
        }
        refetchData()
    }, [refresh])




    const onClick = (item: any) => {
        console.log("OnCLICKSPACES", item)

        setSpaceId(item.id)
        dispatch(setSpace(item))
        if (item?.request_status === 2) {
            navigationService.navigate(RouteNames.SpaceDashBoard)
        }
        else {
            setRequestModalVisible(true)
        }

    }

    const onClickHub = (item: any) => {
        // console.log("OnCLICKSPACES", item)
        setHubId(item.id)
        dispatch(setHub(item))
        navigationService.navigate(RouteNames.Hubs)

        const spaceId = item?.id?.toString();
        Analytics.logHubEnterPriseEvent(spaceId);

        // setRequestModalVisible(true)
    }
    const onClickSubSpaceHub = (item: any) => {
        // console.log("OnCLICKSPACES", item)
        setSpaceId(item.id)
        dispatch(setSpace(item))
        const spaceId = item?.id?.toString()
        Analytics.logSpaceEvent(spaceId);
        navigationService.navigate(RouteNames.SpaceDashBoard)
        // setRequestModalVisible(true)
    }



    const onSelectFilter = async (filter: string) => {

        setLoadingSpace(true)
        setLoadingSubSpace(true)

        console.log("onSelectFilter", filter, PAGE_SIZE_SPACE, currentPageSpace)


        if (filter === "ClearAll") {

            onRefresh()
        }
        else {
            setFilter(filter)
            const resSpace = await getFilteredSpaces(
                {
                    variables: {
                        input: {
                            sort_option: filter,
                            page_size: currentPageSpace * PAGE_SIZE_SPACE,
                            page: 1,
                            name: search ? search : "",
                        }
                    }
                }
            )
            const resSubSpaceHub = await getFilteredHubSpaces(
                {
                    variables: {
                        input: {
                            sort_option: filter,
                            page_size: currentPageSubSpace * PAGE_SIZE_SUB_SPACE,
                            page: 1,
                            name: search ? search : "",
                        }
                    }
                }
            )

            const resHub = await getFilteredHub(
                {
                    variables: {
                        input: {
                            sort_option: filter
                        }
                    }
                }
            )
            if (resSpace?.data) {
                arrangeSpaceData(resSpace?.data, 1)

            }
            if (resSubSpaceHub?.data) {
                arrangeSubSpaceHubData(resSubSpaceHub?.data, 1)
            }
            if (resHub?.data) {
                arrangeHubData(resHub?.data)
            }
            // setLoading(false)
            //console.log("FILTERED", resSpace?.data?.getSpaces?.spaces)
        }


    }




    const onSearch = async (search: string) => {
        setLoadingSpace(true)
        setLoadingSubSpace(true)
        setSearch(search)


        if (search === "") {
            onRefresh()
        }
        else {

            const resSpace = await getFilteredSpaces(
                {
                    variables: {
                        input: {
                            name: search,
                            page_size: PAGE_SIZE_SPACE,
                            page: 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",

                        }
                    }
                }
            )
            const resSubSpaceHub = await getFilteredHubSpaces(
                {
                    variables: {
                        input: {
                            name: search,
                            page_size: PAGE_SIZE_SUB_SPACE,
                            page: 1,
                            sort_option: filter ? filter : "Alphabetically A-Z",

                        }
                    }
                }
            )

            const resHub = await getFilteredHub(
                {
                    variables: {
                        input: {
                            name: search
                        }
                    }
                }
            )
            if (resSpace?.data) {
                arrangeSpaceData(resSpace?.data, 1)
                setCurrentPageSpace(1)

            }
            if (resSubSpaceHub?.data) {
                arrangeSubSpaceHubData(resSubSpaceHub?.data, 1)
                setCurrentPageSubSpace(1)
            }
            if (resHub?.data) {
                arrangeHubData(resHub?.data)
            }
        }
        //console.log("FILTERED", resSpace?.data?.getSpaces?.spaces)

    }




    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }





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

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    };





    const MainContent = (

        <View style={{
            justifyContent: 'flex-start', alignItems: 'center',
            width: getWidth(40), flex: 1
        }}>



            {subscribedData === null && spaceData === null && hubData === null ?
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>

                :

                <>


                    <View
                        style={{ position: 'relative', alignSelf: 'flex-end' }}
                        ref={filterRef}
                    >
                        <TouchableOpacity
                            onPress={toggleFilter}
                            activeOpacity={0.7}
                        >
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(10),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(10),
                                    marginHorizontal: config.isWeb ? getWidth(0.7) : config.getWidth(2),
                                    backgroundColor: backgroundColors.transparent
                                }}

                                source={Icons.filter}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                        {filterVisible && (
                            <View
                                style={{
                                    width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                    height: config.isWeb ? getWidth(12) : config.getWidth(45),
                                    position: 'absolute',
                                    backgroundColor: commonColors.white,
                                    right: config.isWeb ? -getWidth(0.4) : 0,
                                    top: config.isWeb ? getHeight(3.5) : getHeight(5),
                                    zIndex: 1,
                                    borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(3),
                                    borderWidth: 1,
                                    borderColor: borderColors.profileImage,
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                    elevation: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectFilter("Alphabetically A-Z");
                                        setSelectedFilter("1");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.4) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(2) : getHeight(3),
                                        borderTopWidth: selectedFilter === "1" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "1" ? 1 : 0,
                                        borderColor: selectedFilter === "1" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "1" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                                    }}>
                                        Name A - Z
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectFilter("Alphabetically Z-A");
                                        setSelectedFilter("2");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.4) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(2) : getHeight(3),
                                        borderTopWidth: selectedFilter === "2" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "2" ? 1 : 0,
                                        borderColor: selectedFilter === "2" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "2" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                                    }}>
                                        Name Z - A
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectFilter("Created most recently");
                                        setSelectedFilter("3");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.4) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(2) : getHeight(3),
                                        borderTopWidth: selectedFilter === "3" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "3" ? 1 : 0,
                                        borderColor: selectedFilter === "3" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "3" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                                    }}>
                                        Created most recently
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectFilter("Created last 30 days ago");
                                        setSelectedFilter("4");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.4) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(2) : getHeight(3),
                                        borderTopWidth: selectedFilter === "4" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "4" ? 1 : 0,
                                        borderColor: selectedFilter === "4" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "4" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                                    }}>
                                        Created most 30 days ago
                                    </Text>
                                </TouchableOpacity>

                                <View style={{
                                    width: config.isWeb ? getWidth(14) : config.getWidth(55),
                                    height: config.isWeb ? getHeight(2) : getHeight(3),
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelectFilter("ClearAll");
                                            setSelectedFilter("");
                                            setFilterVisible(false);
                                        }}
                                        style={{
                                            width: config.isWeb ? getWidth(5) : config.getWidth(20),
                                            height: config.isWeb ? getHeight(2.2) : getHeight(2.5),
                                            borderRadius: config.isWeb ? getHeight(1.1) : getHeight(1.25),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                            borderWidth: 1,
                                            borderColor: commonColors.black
                                        }}
                                    >
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14)
                                        }}>
                                            Clear All
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>


                    {
                        (space?.request_status === 0 || space?.request_status === 1 || space?.request_status == null) && requestModalVisible
                            ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{
                                    borderColor: commonColors.black,
                                    width: config.isWeb ? getWidth(40) : config.getWidth(90),
                                    borderWidth: 1,
                                    borderRadius: config.isWeb ? getWidth(0.5) : config.getWidth(4),
                                    backgroundColor: commonColors.white
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        setRequestModalVisible(false)
                                        //setRequestSent(false)
                                        //setRefresh(!refresh)

                                    }} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Image
                                            style={{
                                                width: config.isWeb ? getWidth(1) : config.getWidth(4),
                                                height: config.isWeb ? getWidth(1) : config.getWidth(4),
                                                marginRight: config.isWeb ? getWidth(1) : config.getWidth(4), marginTop: config.isWeb ? getWidth(1) : config.getWidth(4)
                                            }}
                                            source={Icons.cross}
                                            resizeMode='contain'

                                        />
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: config.getWidth(2) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'bold',
                                            fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(18),
                                            textAlign: 'center'
                                        }}>
                                            Welcome to the {space?.name}
                                        </Text>
                                    </View>
                                    {
                                        space?.request_status === 0 ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: getHeight(3) }}>
                                                <Text style={{
                                                    color: textColors.requestAccess,
                                                    fontFamily: 'bold',
                                                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),
                                                    textAlign: 'left'
                                                }}>
                                                    You’ve already requested access to the{'\n'}
                                                    space. Please allow some time for the admin{'\n'}
                                                    to process your request
                                                </Text>
                                            </View>
                                            :
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: getHeight(3), marginHorizontal: config.getWidth(2) }}>
                                                <Text style={{
                                                    color: commonColors.black,
                                                    fontFamily: 'regular',
                                                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(12)
                                                }}>
                                                    This is a private Channel for {space?.name} for internal
                                                    use only which offers the team access to:
                                                </Text>
                                            </View>
                                    }
                                    {
                                        space?.request_status === 0 ?
                                            null
                                            :
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.black,
                                                    fontFamily: 'regular',
                                                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(12)
                                                }}>

                                                    - Hospital Specific Clinical Guidelines & Order sets{'\n'}
                                                    - Internal Team Discussions{'\n'}
                                                    - Resident & Fellow Handbook & Protocols{'\n'}
                                                    - Staff Directory
                                                </Text>
                                            </View>
                                    }

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: getHeight(3) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16), textAlign: 'center'
                                        }}>
                                            If you are a member of the team,{'\n'}
                                            Click <Text style={{
                                                color: commonColors.black,
                                                fontFamily: 'bold',
                                                fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16)
                                            }}>
                                                "Request Access"
                                            </Text> below.
                                        </Text>

                                    </View>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: getHeight(3) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                                            textAlign: 'center'
                                        }}>
                                            If you are interested in a private space{'\n'}
                                            for your organization, Please Contact{'\n'}
                                            "sales@globalcastmd.com"
                                        </Text>

                                    </View>
                                    {
                                        space?.request_status === 0 ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.white,
                                                    fontFamily: 'bold',
                                                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14)
                                                }}>
                                                    Access Requested
                                                </Text>
                                            </View>
                                            :
                                            <TouchableOpacity onPress={async () => {

                                                const requestAccessResponse = await requestAccess({ variables: { input: { space_id: spaceId } } })
                                                console.log("requestAccessResponse", requestAccessResponse)
                                                if (requestAccessResponse?.data) {
                                                    setRefresh(!refresh)
                                                    setRequestModalVisible(false)
                                                    alert(requestAccessResponse?.data?.subscribeSpace?.message)

                                                    //spaceRefetch()

                                                }
                                                // setRequestSent(true)

                                            }} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.white,
                                                    fontFamily: 'bold',
                                                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14)
                                                }}>
                                                    Request Access
                                                </Text>
                                            </TouchableOpacity>
                                    }


                                </View>
                            </View>
                            :
                            <ScrollView style={{ width: getWidth(40), zIndex: -1 }}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                showsVerticalScrollIndicator={false}
                            >
                                {
                                    subscribedData !== null &&

                                    <SpaceContainer title={"Subscribed Spaces/HUBs"} onClick={onClickSubSpaceHub} subscribed data={subscribedData} onLoadMore={seeSubSpaceMore} loading={isLoadingSubSpace} isLoadingMore={isLoadingMoreSubSpace} totalData={totalDataSubSpace} />

                                }
                                {
                                    hubData !== null &&
                                    <SpaceContainer title={"HUBS"} onClick={onClickHub} hub data={hubData} loading={hubsLoading} />
                                }

                                {
                                    spaceData !== null &&

                                    <SpaceContainer title={"Spaces"} onClick={onClick} spaces subscribed data={spaceData} onLoadMore={seeSpaceMore} loading={isLoadingSpace} totalData={totalDataSpace} isLoadingMore={isLoadingMoreSpace} />
                                }
                            </ScrollView>

                    }
                </>
            }
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout
                // showFilter
                rightContent={MainContent}
                showSearch
                onSearch={onSearch}
                onSelect={onSelectFilter}
                leftContent={CreateGroup}
            />
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {

    },


    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        // backgroundColor: 'pink'

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

export default Spaces