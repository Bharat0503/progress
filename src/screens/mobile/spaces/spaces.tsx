import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl, ActivityIndicator, Keyboard, Alert } from 'react-native'
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
import { GET_HUBS_FILTER_SEARCH_MOBILE, GET_HUBS_MOBILE, GET_SPACES_FILTER_SEARCH_MOBILE, GET_SPACES_MOBILE, GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE, GET_SUBSCRIBED_SPACES_HUB_MOBILE } from '@/src/services/QueryMethod';
import Search from '@/src/components/search';
import { REQUEST_SPACE_ACCESS } from '@/src/services/MutationMethod';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setHub, setImageLoading, setSpace } from '@/src/redux/action';
import Analytics from '@/src/services/Analytics';



const Spaces: React.FC = (props) => {
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


    const {
        data: hubsData,
        loading: hubsLoading,
        error: hubsError,
        refetch: hubsRefetch
    } = useQuery(GET_HUBS_MOBILE)






    const [getFilteredSpaces] = useLazyQuery(GET_SPACES_FILTER_SEARCH_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
        
    })
    const [getFilteredHubSpaces] = useLazyQuery(GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE,
        {
            fetchPolicy: "network-only", // Forces refetching
        })
    const [getFilteredHub] = useLazyQuery(GET_HUBS_FILTER_SEARCH_MOBILE, {
        fetchPolicy: "network-only", // Forces refetching
    })




    const [subscribedData, setSubscribedData] = useState<any>(null)
    const [hubData, sethubData] = useState<any>(null)
    const [spaceData, setSpacesData] = useState<any>(null)

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

        setIsLoadingMoreSpace(false)


    }

    const arrangeSubSpaceHubData = (data: any, page: number) => {

        if (data?.getDashboardData?.success) {

            let subData = []
            let hubs = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.hubs
            let spaces = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.spaces
            const pagination = data?.getDashboardData?.dashboardData?.subscribed_hubs_spaces?.pagination || {};
            console.log("resSubSpaceHub", hubs, spaces)
            if (hubs?.length !== 0) {
                for (const key in hubs) {
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

                for (const key in spaces) {
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
        setIsLoadingMoreSubSpace(false)

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

            setIsLoadingMoreSubSpace(true)
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
            setIsLoadingMoreSpace(true)
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
        console.log("OnCLICKSPACES hubsss---", item)
        setHubId(item.id)
        dispatch(setHub(item))
        navigationService.navigate(RouteNames.Hubs)

        const spaceId = item?.id?.toString();
        Analytics.logHubEnterPriseEvent(spaceId);
        // setRequestModalVisible(true)
    }
    const onClickSubSpaceHub = (item: any) => {
        console.log("OnCLICKSPACES", item)
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
    return (

        <View style={styles.container}>

            <Header profile={true}
            // message={true}

            // notification={true}
            />

            {subscribedData === null && spaceData === null && hubData === null
                ?

                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>

                :
                <>

                    <Search isSearchOnKeyboardButton={true} filter onSelect={onSelectFilter} onSearch={onSearch} isSearchIconVisible={true} />
                    {
                        (space?.request_status === 0 || space?.request_status === 1 || space?.request_status == null) && requestModalVisible
                            ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{
                                    borderColor: commonColors.black,
                                    width: config.getWidth(90), borderWidth: 1, borderRadius: config.getWidth(4),
                                    backgroundColor: commonColors.white
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        setRequestModalVisible(false)
                                        //setRequestSent(false)
                                        //setRefresh(!refresh)

                                    }} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Image
                                            style={{
                                                width: config.getWidth(4),
                                                height: config.getWidth(4),
                                                marginRight: config.getWidth(4), marginTop: config.getWidth(4)
                                            }}
                                            source={Icons.cross}
                                            resizeMode='contain'

                                        />
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: config.getWidth(2) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'bold',
                                            fontSize: config.generateFontSizeNew(14 ), textAlign: 'center'
                                        }}>
                                            Welcome to the {space?.name}
                                        </Text>
                                    </View>
                                    {
                                        space?.request_status === 0 ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: config.getHeight(3) }}>
                                                <Text style={{
                                                    color: textColors.requestAccess,
                                                    fontFamily: 'bold',
                                                    fontSize: config.generateFontSizeNew(14),
                                                    textAlign: 'left'
                                                }}>
                                                    You’ve already requested access to the{'\n'}
                                                    space. Please allow some time for the admin{'\n'}
                                                    to process your request
                                                </Text>
                                            </View>
                                            :
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: config.getHeight(3), marginHorizontal: config.getWidth(2) }}>
                                                <Text style={{
                                                    color: commonColors.black,
                                                    fontFamily: 'regular',
                                                    fontSize: config.generateFontSizeNew(14)
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
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.black,
                                                    fontFamily: 'regular',
                                                    fontSize: config.generateFontSizeNew(14)
                                                }}>

                                                    - Hospital Specific Clinical Guidelines & Order sets{'\n'}
                                                    - Internal Team Discussions{'\n'}
                                                    - Resident & Fellow Handbook & Protocols{'\n'}
                                                    - Staff Directory
                                                </Text>
                                            </View>
                                    }

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.generateFontSizeNew(14), textAlign: 'center'
                                        }}>
                                            If you are a member of the team,{'\n'}
                                            Click <Text style={{
                                                color: commonColors.black,
                                                fontFamily: 'bold',
                                                fontSize: config.generateFontSizeNew(14)
                                            }}>
                                                "Request Access"
                                            </Text> below.
                                        </Text>

                                    </View>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.generateFontSizeNew(14),
                                            textAlign: 'center'
                                        }}>
                                            If you are interested in a private space{'\n'}
                                            for your organization, Please Contact{'\n'}
                                            "sales@globalcastmd.com"
                                        </Text>

                                    </View>
                                    {
                                        space?.request_status === 0 ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: config.getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: config.getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.white,
                                                    fontFamily: 'bold',
                                                    fontSize: config.generateFontSizeNew(14)
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
                                                    setLoadingSpace(true)
                                                    setLoadingSubSpace(true)
                                                    setRequestModalVisible(false)
                                                    alert(requestAccessResponse?.data?.subscribeSpace?.message)

                                                    //spaceRefetch()

                                                }
                                                // setRequestSent(true)

                                            }} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: config.getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: config.getHeight(3) }}>
                                                <Text style={{
                                                    color: commonColors.white,
                                                    fontFamily: 'bold',
                                                    fontSize: config.generateFontSizeNew(14)
                                                }}>
                                                    Request Access
                                                </Text>
                                            </TouchableOpacity>
                                    }


                                </View>
                            </View>
                            :
                            <ScrollView
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                showsVerticalScrollIndicator={false}>


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
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: commonColors.white
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
        // backgroundColor: 'pink'

    },
})

export default Spaces