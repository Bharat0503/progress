import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Keyboard } from 'react-native'
import config from '../../../utils/config'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { commonColors, backgroundColors, borderColors } from '@/src/utils/colors'
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';
import LogoText from '@/src/components/logoText';
import EmailMobileInput from '@/src/components/emailMobileInput';
import { GET_CONFIG } from '@/src/services/MutationMethod';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector, } from 'react-redux';
import { setAffiliations, setLoading, setSpecialities, setTitles, setEmail, setToken, setUserId, setSplashSpaceImage, setDeepLinkHandledRef } from '@/src/redux/action';
import { configAPIDataHandling } from '@/src/api/commonDataHandling';
import { handleRequestLoginOtpAPI } from '@/src/api/commonApiMethod';
import { getAsyncData } from '@/src/utils/storage';
import { keys } from '@/src/utils/keys';
import Icons from '@/src/assets/icons';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import { Image } from 'expo-image';



const Splash: React.FC = (props) => {
    const dispatch = useDispatch()
    const { loading, error, data } = useQuery(GET_CONFIG);
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();

    useEffect(() => {
        if (!loading) {
            const { affiliation, specialities, titles, splashImages } = configAPIDataHandling(data)
            console.log("CONFIG DATA", specialities)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setTitles(titles))
            dispatch(setSplashSpaceImage(splashImages))

        }
    }, [loading])





    useEffect(() => {
        

        const init = async () => {
            const token1 = await getAsyncData(keys.userToken)
            const userId1 = await getAsyncData(keys.userId)
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

    }, []);
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }



    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={{ backgroundColor: commonColors.white, marginTop: -config.getHeight(10) }}>
                    <Image
                        style={{ height: config.getHeight(70), width: config.getWidth(100), backgroundColor: commonColors.white }}
                        source={Icons.SplashGif}
                        contentFit='contain'
                    />
                </View>

                <View style={{
                    width: config.getWidth(100),
                    marginTop: config.getHeight(3),
                }}>
                    {
                        data?.getAppConfig?.config["space_images"].map((item: string, index: number) => {
                            return (
                                <View style={{
                                    justifyContent: 'center', alignItems: 'center   ', flexDirection: 'row'
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Image
                                            style={{
                                                width: config.getWidth(80),
                                                height: config.getHeight(10),

                                            }}
                                            source={{ uri: item }}
                                            contentFit='contain'
                                        />
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColors.offWhite
    },
    subContainer: {
        alignItems: 'center', justifyContent: 'flex-start', flex: 1, backgroundColor: commonColors.white
    },
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        position: 'absolute',
        bottom: config.getHeight(20),
    },
    animationLogo: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: config.getHeight(40),
        transform: [{ translateY: -config.getHeight(30) }]
    },

})

export default Splash