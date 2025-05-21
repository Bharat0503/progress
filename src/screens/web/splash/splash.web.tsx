import React, { useEffect, useState } from 'react'
import { Keyboard, View, StyleSheet, Text, Image, Linking } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GET_CONFIG } from '@/src/services/MutationMethod';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setAffiliations, setCollection, setCollectionList, setContent, setContentId, setContentIdList, setCountries, setCurrentTab, setDeepLinkHandledRef, setEmail, setErrorMessage, setGuidelinePdfLink, setHub, setInfographicImageLink, setLoading, setRefresh, setSelectedSpaceHomeDashboard, setSocieties, setSpace, setSpaceDashBoard, setSpecialities, setSpeciality, setSplashSpaceImage, setStartfromSpaceDashBoard, setSubSpecialities, setTitles, setToken, setTrainees, setUserDetails, setUserId, setVideoTime } from '../../../redux/action';
import { configAPIDataHandling } from '../../../api/commonDataHandling';
import LogoText from '../../../components/logoText';
import EmailMobileInput from '../../../components/emailMobileInput';
import { handleRequestLoginOtpAPI } from '../../../api/commonApiMethod';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '../../../navigation/routes';
import { borderColors, commonColors } from '@/src/utils/colors';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import Icons from '@/src/assets/icons';
import { getAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';
import { CommonActionTypes } from '@/src/redux/types';

const Splash: React.FC = (props) => {
    const translateY = useSharedValue(0); // start off-screen
    const loginOpacity = useSharedValue(0);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("")

    const { loading, error, data } = useQuery(GET_CONFIG);
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();

    useEffect(() => {
        if (!loading) {
            // console.log("CONFIG DATA", data, loading)
            const { affiliation, specialities, titles, splashImages } = configAPIDataHandling(data)
            console.log("CONFIG DATA", specialities)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setTitles(titles))
            dispatch(setSplashSpaceImage(splashImages))
            dispatch(setDeepLinkHandledRef(false));

        }
    }, [loading])

    useEffect(() => {

        const init = async () => {
            const token1 = await getAsyncData(keys.userToken)
            const userId1 = await getAsyncData(keys.userId)
            if (token1) {


                const loadStoredData = async () => {
                    const storedAffiliation = await getAsyncData(keys.affiliation);
                    const storedContent = await getAsyncData(keys.content);
                    const storedContentIdList = await getAsyncData(keys.contentIdList);
                    const storedHub = await getAsyncData(keys.hub);
                    const storedSpace = await getAsyncData(keys.space);

                    const storedSpecialities = await getAsyncData(keys.specialities);
                    const storedSubSpecialities = await getAsyncData(keys.subSpecialities);
                    const storedSocieties = await getAsyncData(keys.societies);
                    const storedTitles = await getAsyncData(keys.titles);
                    const storedCountry = await getAsyncData(keys.country);
                    const storedTrainee = await getAsyncData(keys.trainee);
                    const storedSplashSpaceImage = await getAsyncData(keys.splashSpaceImage);
                    const storedErrorMessage = await getAsyncData(keys.errorMessage);
                    const storedEmail = await getAsyncData(keys.email);
                    const storedUserDetails = await getAsyncData(keys.userDetails);
                    const storedCurrentTab = await getAsyncData(keys.currentTab);
                    const storedCollection = await getAsyncData(keys.collection);
                    const storedContentId = await getAsyncData(keys.contentId);
                    const storedCollectionList = await getAsyncData(keys.collectionList);
                    const storedInfographicImageLink = await getAsyncData(keys.infographicImageLink);
                    const storedGuidelinePdfLink = await getAsyncData(keys.guidelinePdfLink);
                    const storedVideoTime = await getAsyncData(keys.videoTime);
                    const storedRefresh = await getAsyncData(keys.refresh);
                    const storedSpaceDashboard = await getAsyncData(keys.spaceDashboard);
                    const storedStartFromSpaceDashboard = await getAsyncData(keys.startFromSpaceDashboard);
                    const storedHomeDashboardSpace = await getAsyncData(keys.homeDashboardSpace);
                    const storedSpeciality = await getAsyncData(keys.speciality);


                    if (storedAffiliation) dispatch(setAffiliations(storedAffiliation));
                    if (storedContent) dispatch(setContent(storedContent));
                    if (storedContentIdList) dispatch(setContentIdList(storedContentIdList));
                    if (storedHub) dispatch(setHub(storedHub));
                    if (storedSpace) dispatch(setSpace(storedSpace));
                    if (storedSpecialities) dispatch(setSpecialities(storedSpecialities));
                    if (storedSubSpecialities) dispatch(setSubSpecialities(storedSubSpecialities));
                    if (storedSocieties) dispatch(setSocieties(storedSocieties));
                    if (storedTitles) dispatch(setTitles(storedTitles));
                    if (storedCountry) dispatch(setCountries(storedCountry));
                    if (storedTrainee) dispatch(setTrainees(storedTrainee));
                    if (storedSplashSpaceImage) dispatch(setSplashSpaceImage(storedSplashSpaceImage));
                    if (storedErrorMessage) dispatch(setErrorMessage(storedErrorMessage));
                    if (storedEmail) dispatch(setEmail(storedEmail));
                    if (storedUserDetails) dispatch(setUserDetails(storedUserDetails));
                    if (storedCurrentTab) dispatch(setCurrentTab(storedCurrentTab));
                    if (storedCollection) dispatch(setCollection(storedCollection));
                    if (storedContentId) dispatch(setContentId(storedContentId));
                    if (storedCollectionList) dispatch(setCollectionList(storedCollectionList));
                    if (storedInfographicImageLink) dispatch(setInfographicImageLink(storedInfographicImageLink));
                    if (storedGuidelinePdfLink) dispatch(setGuidelinePdfLink(storedGuidelinePdfLink));
                    if (storedVideoTime) dispatch(setVideoTime(storedVideoTime));
                    if (storedRefresh) dispatch(setRefresh(storedRefresh));
                    if (storedSpaceDashboard) dispatch(setSpaceDashBoard(storedSpaceDashboard));
                    if (storedStartFromSpaceDashboard) dispatch(setStartfromSpaceDashBoard(storedStartFromSpaceDashboard));
                    if (storedHomeDashboardSpace) dispatch(setSelectedSpaceHomeDashboard(storedHomeDashboardSpace));
                    if (storedSpeciality) dispatch(setSpeciality(storedSpeciality));

                };

                loadStoredData();
            }
            setTimeout(() => {
                if (token1) {

                    dispatch(setToken(token1))
                    dispatch(setUserId(userId1))
                }
                else {
                    navigationService.navigate(RouteNames.Login)
                }

            }, 6000)

        }
        init()
        return () => {
        }
    }, []);

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        // if (config.isWeb) {
        //     if (dimension?.height > 820) {
        //         return dimension.height * (height / 100)
        //     }
        //     else {
        //         return 820 * (height / 100)
        //     }
        // }
        // else {
        return dimension.height * (height / 100)
        // }
    }
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }


    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: commonColors.white, marginTop: -getHeight(10), justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: getHeight(70), width: getWidth(100), backgroundColor: commonColors.white }}
                    source={Icons.SplashGif}
                    resizeMode='contain'

                />
            </View>

            <View style={{
                width: getWidth(100), height: getHeight(60), marginTop: -getHeight(20),
                // backgroundColor: 'green'
            }}>

                {
                    data?.getAppConfig?.config["space_images"].map((item: string, index: number) => {
                        return (
                            <View style={{
                                // width: getWidth(100), height: getHeight(12),
                                // backgroundColor: 'pink',
                                justifyContent: 'center', alignItems: 'center   ', flexDirection: 'row'
                            }}>
                                <View style={{
                                    // width: getWidth(13),
                                    // height: getWidth(5.5),
                                    // borderRadius: getWidth(1),
                                    // borderWidth: 1,
                                    // borderColor: borderColors.profileImage,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                    // marginRight: getWidth(2)
                                }}>
                                    <Image
                                        style={{
                                            width: getWidth(20),
                                            height: getWidth(5.5),
                                            // borderWidth: 1,
                                            // borderColor: borderColors.profileImage,
                                            // borderRadius: getWidth(0.7)
                                        }}
                                        // source={{ uri: data?.getAppConfig?.config["space_images"][0] }}
                                        source={{ uri: item }}
                                        resizeMode='contain'

                                    />


                                </View>


                            </View>
                        )
                    })
                }





            </View>


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: commonColors.white
    },
    // animatedLogoContainer: { alignItems: 'center', justifyContent: 'center', position: 'absolute', top: getHeight(40) },
    // logoContainer: {
    //     alignItems: 'center', justifyContent: 'center', position: 'absolute', top: getHeight(40), transform: [{ translateY: -getHeight(20) }]
    // },
    // inputContainer: {
    //     justifyContent: 'center', alignItems: 'center', position: 'absolute', top: getHeight(40)
    // },
    // messageText: {
    //     fontFamily: 'regular',
    //     fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
    //     position: 'absolute',
    //     bottom: getHeight(20),
    //     // marginTop: getHeight(45)
    // }
})


export default Splash