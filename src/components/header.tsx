import React, { } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
import config from '../utils/config'


import { backgroundColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import LogoText from './logoText'
import { useDispatch, useSelector } from 'react-redux'
import { setCollection, setCollectionList, setContentId, setContentIdList, setRefresh, setSpaceDashBoard } from '../redux/action'

interface HeaderProps {
    infographic?: boolean
    content?: boolean
    collection?: boolean
    message?: boolean;
    back?: boolean;
    notification?: boolean;
    profile?: boolean;
    editProfile?: boolean
}


const Header: React.FC<HeaderProps> = ({ infographic, content, collection, message, back, notification, profile, editProfile }) => {
    const contentIdList = useSelector((state: any) => state.reducer.contentIdList)
    const collectionList = useSelector((state: any) => state.reducer.collectionList)
    const startFromSpaceDashboard = useSelector((state: any) => state.reducer.startFromSpaceDashboard)
    const refresh = useSelector((state: any) => state.reducer.refresh)
    const dispatch = useDispatch()


    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                {
                    back
                        ?
                        <TouchableOpacity onPress={() => {

                            //navigationService.pop()
                            if (content) {
                                if (contentIdList?.length !== 0) {
                                    const contentIdListUpdated = contentIdList?.length !== 0 ? contentIdList : []
                                    console.log("contentIdListUpdated", contentIdListUpdated)
                                    contentIdListUpdated?.pop()

                                    if (contentIdListUpdated?.length !== 0) {
                                        dispatch(setContentIdList(contentIdListUpdated))
                                        dispatch(setContentId(contentIdListUpdated[contentIdListUpdated?.length - 1]))
                                        dispatch(setSpaceDashBoard(false))
                                        dispatch(setRefresh(!refresh))
                                    }
                                    else {
                                        // alert(startFromSpaceDashboard)
                                        // if (startFromSpaceDashboard) {
                                        //     dispatch(setSpaceDashBoard(true))
                                        //     dispatch(setRefresh(!refresh))
                                        // }
                                        // else {
                                        navigationService.goBack()
                                        // }

                                    }
                                }
                                else {
                                    dispatch(setContentIdList([]))
                                    navigationService.goBack()
                                }
                            }
                            else if (collection) {
                                if (collectionList?.length !== 0) {
                                    const collectionListUpdated = collectionList?.length !== 0 ? collectionList : []
                                    console.log("contentIdListUpdated", collectionListUpdated)
                                    collectionListUpdated?.pop()

                                    if (collectionListUpdated?.length !== 0) {
                                        dispatch(setCollectionList(collectionListUpdated))
                                        dispatch(setCollection(collectionListUpdated[collectionListUpdated?.length - 1]))
                                        dispatch(setRefresh(!refresh))
                                    }
                                    else {

                                        navigationService.goBack()


                                    }


                                }
                                else {
                                    dispatch(setContentIdList([]))
                                    navigationService.goBack()
                                }
                            }
                            else {


                                navigationService.goBack()

                            }

                        }} style={config.isWeb ? [styles.drawerContainer, { bottom: config.getHeight(1) }] : [styles.drawerContainer, {}]}>
                            <Image
                                style={styles.backIcon}
                                source={Icons.backArrow}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => {
                            navigationService.toggleDrawer()
                        }} style={config.isWeb ? [styles.drawerContainer, { bottom: config.getHeight(1) }] : [styles.drawerContainer, {}]}>
                            <Image
                                style={styles.drawerIcon}
                                source={Icons.drawer}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>
                }
                <View style={{ marginTop: config.isWeb ? config.getHeight(0) : config.getHeight(1)}}>
                    <Image
                        style={styles.logoIcon}
                        source={Icons.logo}
                        resizeMode='contain'

                    />

                </View>
                <View style={config.isWeb ? [styles.rightContainer, { bottom: config.getHeight(1) }] : [styles.rightContainer]}>
                    {
                        message &&
                        <TouchableOpacity onPress={() => {
                            // navigationService.navigate(RouteNames.Profile)
                        }}>
                            <Image
                                style={styles.messageIcon}
                                source={Icons.message}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>

                    }
                    {
                        notification &&
                        <TouchableOpacity onPress={() => {
                            // navigationService.navigate(RouteNames.Profile)
                        }}>
                            <Image
                                style={styles.notificationIcon}
                                source={Icons.notification}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>
                    }
                    {
                        profile &&
                        <TouchableOpacity onPress={() => {
                            navigationService.navigate(RouteNames.Profile)
                        }}>
                            <Image
                                style={styles.profileIcon}
                                source={Icons.profile}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>
                    }
                    {
                        editProfile &&
                        <TouchableOpacity onPress={() => {
                            navigationService.navigate(RouteNames.EditProfile)
                        }}>
                            <Image
                                style={styles.profileEditIcon}
                                source={Icons.edit}
                                resizeMode='contain'

                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: config.isWeb ? '7%' : config.getHeight(13),
        width: config.isWeb ? '100%' : config.getWidth(100),
        backgroundColor: config.isWeb ? undefined : backgroundColors.offWhite

    },
    subContainer: {
        height: config.isWeb ? '100%' : config.getHeight(8),
        width: config.isWeb ? '100%' : config.getWidth(100),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        position: config.isWeb ? undefined : 'absolute',
        top: config.isWeb ? undefined : config.getHeight(5),
        bottom: config.isWeb ? 0 : undefined,


    },
    logoIcon: {
        width: config.isWeb ? '30%' : config.getWidth(12), height: config.isWeb ? '30%' : config.getWidth(15)
    },
    drawerContainer: {
        position: config.isWeb ? undefined : 'absolute',
        left: config.isWeb ? '50%' : config.getWidth(4),
        width: config.isWeb ? '50%' : config.getWidth(7),
        height: config.isWeb ? '50%' : config.getWidth(7),
        justifyContent: 'center', alignItems: 'center'


    },

    drawerIcon: {
        width: config.isWeb ? '50%' : config.getWidth(7),
        height: config.isWeb ? '50%' : config.getWidth(4),


    },
    backIcon: {
        width: config.isWeb ? '50%' : config.getWidth(7),
        height: config.isWeb ? '50%' : config.getWidth(5),


    },
    rightContainer: {
        width: config.isWeb ? '10%' : config.getWidth(25),
        height: config.isWeb ? '50%' : config.getWidth(8),
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: "row",
        position: 'absolute',
        right: config.isWeb ? '2%' : config.getWidth(4),


    },
    messageIcon: {
        width: config.isWeb ? '100%' : config.getWidth(6.5),
        height: config.isWeb ? '100%' : config.getWidth(6.5),
        marginTop: 5
    },
    notificationIcon: {
        width: config.isWeb ? '100%' : config.getWidth(8),
        height: config.isWeb ? '100%' : config.getWidth(7),
        marginLeft: 2
    },
    profileIcon: {
        width: config.isWeb ? '5%' : config.getWidth(6.5),
        height: config.isWeb ? '5%' : config.getWidth(6.5),
    },
    profileEditIcon: {
        width: config.isWeb ? '100%' : config.getWidth(6.5),
        height: config.isWeb ? '100%' : config.getWidth(6.5),
        alignSelf: 'center',
        marginLeft: config.isWeb ? undefined : config.getWidth(15)
    },
    logoImage: {
        height: config.isWeb ? '7%' : config.getHeight(13),
        width: config.isWeb ? '12%' : config.getWidth(24),
    },
    logoText: {
        fontSize: config.isWeb ? config.generateFontSizeNew(2.20) : config.generateFontSizeNew(18),
        color: textColors.stayCurrentMD,
        letterSpacing: config.isWeb ? config.getWidth(0.1) : config.getWidth(0.4)


    }


})

export default Header