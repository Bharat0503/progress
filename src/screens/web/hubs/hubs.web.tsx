import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
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
import { GET_HUB_DETAILS_BY_ID_MOBILE, GET_HUBS_MOBILE, GET_SPACES_MOBILE, GET_SUBSCRIBED_SPACES_HUB_MOBILE } from '@/src/services/QueryMethod';
import Search from '@/src/components/search';
import { REQUEST_SPACE_ACCESS } from '@/src/services/MutationMethod';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HubSpacesContainer from '@/src/components/hubSpacesContainer';
import { setSpace } from '@/src/redux/action';
import WebBaseLayout from '@/src/components/webBaseLayout';
import useFetchDimention from '@/src/customHooks/customDimentionHook';



const HubsWeb: React.FC = (props) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const isFocused = useIsFocused()
    const hub = useSelector((state: any) => state.reducer.hub)
    const [spaceData, setSpacesData] = useState<any>()
    const [requestModalVisible, setRequestModalVisible] = useState(false)
    const [spaceId, setSpaceId] = useState<number>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [requestAccess] = useMutation(REQUEST_SPACE_ACCESS)

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    const {
        data: hubData,
        loading: hubLoading,
        error: hubError,
        refetch: hubRefetch
    } = useQuery(GET_HUB_DETAILS_BY_ID_MOBILE, {
        variables: {
            input: {
                hub_id: hub?.id
            }
        }
    })
    console.log('arrangeHubDetailsarrangeHubDetailsarrangeHubDetailsarrangeHubDetails');
    const arrangeHubDetails = (data: any) => {
        let spaces = []
        //console.log("HUBDATA", data?.getHubInfoById?.hubInfo)
        for (let key in data?.getHubInfoById?.hubInfo?.spaces) {

            let space = {
                id: data?.getHubInfoById?.hubInfo?.spaces[key]?.id,
                logo: data?.getHubInfoById?.hubInfo?.spaces[key]?.logo_path,
                space_type: data?.getHubInfoById?.hubInfo?.spaces[key]?.space_type_id,
                request_status: data?.getHubInfoById?.hubInfo?.spaces[key]?.subscribed_users
                    ? data?.getHubInfoById?.hubInfo?.spaces[key]?.subscribed_users[0]?.subscription_status?.request_status
                    : null,
                name: data?.getHubInfoById?.hubInfo?.spaces[key]?.name,
            }
            // console.log("SPACEDATA", space)
            spaces.push(space)
        }
        setSpacesData(spaces)
    }

    useEffect(() => {
        if (!hubLoading) {

            if (hubData) {
                console.log('hubDatahubDatahubDatahubDatahubData');
                arrangeHubDetails(hubData)

            }
        }

    }, [hubLoading])


    const onClick = (item: any) => {
        console.log('onClickonClickonClickonClickonClickonClickonClickonClickonClickonClickonClickonClick');
        setSpaceId(item.id)
        dispatch(setSpace(item))
        if (item?.request_status === 2) {
            navigationService.navigate(RouteNames.SpaceDashBoard)
        }
        else {
            setRequestModalVisible(true)
        }
    }

    useEffect(() => {

        const refetchData = async () => {
            const resHubsDetails = await hubRefetch({
                variables: {
                    input: {
                        hub_id: hub?.id
                    }
                }
            })
            arrangeHubDetails(resHubsDetails?.data)

            console.log("refetchData", resHubsDetails?.data?.getHubInfoById?.hubInfo)
        }

        refetchData()
    }, [refresh])




    const MainContent = (

        <View style={{
            flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: getWidth(60),
        }}>

            {
                spaceData?.length !== 0
                    ?
                    (spaceData?.request_status === 0 || spaceData?.request_status === 1 || spaceData?.request_status == null) && requestModalVisible
                        ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                borderColor: borderColors.requestAccess,
                                width: config.isWeb ? getWidth(60) : config.getWidth(90),
                                borderWidth: 1,
                                borderRadius: config.isWeb ? getWidth(0.5) : config.getWidth(4),
                                backgroundColor: commonColors.white
                            }}>
                                <TouchableOpacity onPress={() => {
                                    setRequestModalVisible(false)
                                    // setRequestSent(false)
                                    //setRefresh(!refresh)

                                }} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Image
                                        style={{
                                            width: config.isWeb ? getWidth(1) : config.getWidth(4),
                                            height: config.isWeb ? getWidth(1) : config.getWidth(4),
                                            marginRight: config.isWeb ? getWidth(1) : config.getWidth(4),
                                            marginTop: config.isWeb ? getWidth(1) : config.getWidth(4)
                                        }}
                                        source={Icons.cross}
                                        resizeMode='contain'

                                    />
                                </TouchableOpacity>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'bold',
                                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(18),
                                    }}>
                                        Welcome to the CCHMC{'\n'}Hospital Medicine Space
                                    </Text>
                                </View>
                                {
                                    spaceData?.request_status === 0 ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: config.getHeight(3) }}>
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
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: config.getHeight(3) }}>
                                            <Text style={{
                                                color: commonColors.black,
                                                fontFamily: 'regular',
                                                fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(12)
                                            }}>
                                                This is a private Channel for The Cincinnati Children's{'\n'}
                                                Hospital Division of Pediatric Surgery for internal{'\n'}
                                                use only which offers the team access to:
                                            </Text>
                                        </View>
                                }
                                {
                                    spaceData?.request_status === 0 ?
                                        null
                                        :
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
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

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
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

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3) }}>
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
                                    spaceData?.request_status === 0 ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: config.getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: config.getHeight(3) }}>
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
                                                alert(requestAccessResponse?.data?.subscribeSpace?.message)

                                                //spaceRefetch()

                                            }
                                            // setRequestSent(true)

                                        }} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(3), backgroundColor: backgroundColors.requestAccess, paddingVertical: config.getHeight(1), marginHorizontal: config.getWidth(10), borderRadius: config.getHeight(3) }}>
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

                        <ScrollView showsVerticalScrollIndicator={false} style={{ width: getWidth(60) }}>
                            <HubSpacesContainer hub={hub} onClick={onClick} subscribed data={spaceData} loading={hubLoading} />
                        </ScrollView>
                    : null



            }







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
            <WebBaseLayout rightContent={MainContent} showSearch={false} leftContent={CreateGroup}/>
        </ScrollView>


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

export default HubsWeb