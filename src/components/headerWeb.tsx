
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'

import config from '../utils/config'
import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTab } from '../redux/action'

interface HeaderProps {
    message?: boolean;
    notification?: boolean;
    profile?: boolean;
    editProfile?: boolean
}



const HeaderWeb: React.FC<HeaderProps> = ({ message, notification, profile, editProfile }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const currentTab = useSelector((state: any) => state.reducer.currentTab)
    const currentSpeciality = useSelector((state: any) => state.reducer.speciality)
    const dispatch = useDispatch()
    const [showDialog, setShowDialog] = useState(false);
    // useFetchDimention();

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        if (config.isWeb) {
            if (dimension?.height > 820) {
                return dimension.height * (height / 100)
            }
            else {
                return 820 * (height / 100)
            }
        }
        else {
            return dimension.height * (height / 100)
        }
    }

    useEffect(() => {
        const handleBeforeUnload = () => {

            console.log("handleBeforeUnload", window.location.pathname)
            if (window.location.pathname.includes(RouteNames.Home)) {
                dispatch(setCurrentTab("Home"))
            }
            else if (window.location.pathname.includes(RouteNames.Spaces)
                || window.location.pathname.includes(RouteNames.SpaceDashBoard)
                || window.location.pathname.includes(RouteNames.FeaturedContentListing)
                || window.location.pathname.includes(RouteNames.Content)) {
                dispatch(setCurrentTab("Spaces"))
            }
            else if (window.location.pathname.includes(RouteNames.Browse)) {
                dispatch(setCurrentTab("Browse"))
            }
            else if (window.location.pathname.includes(RouteNames.LibraryDashboard)
                || window.location.pathname.includes(RouteNames.Favorites)
                || window.location.pathname.includes(RouteNames.Downloads)
                || window.location.pathname.includes(RouteNames.MyDirectory)) {
                dispatch(setCurrentTab("MyLibrary"))
            }
        };



        window.addEventListener('popstate', handleBeforeUnload);


        return () => {
            window.removeEventListener('popstate', handleBeforeUnload);

        };
    }, []);





    const showDialogSpace = () => {
        return (
            <Modal
                visible={showDialog}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertTitle}>
                            Have feedback or suggestions? Reach out to us at Info@globalcastmd.com. We appreciate hearing from you!
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={() => {
                                    setShowDialog(false);
                                }}
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };




    return (

        <View style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: getHeight(15),
            width: getWidth(100),
            // backgroundColor: config.isWeb ?  : backgroundColors.offWhite,
            marginTop: getHeight(1.5),
        }}>

            <View style={{
                height: getHeight(9.75),
                width: getWidth(100),
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                bottom: config.isWeb ? 0 : undefined,
            }}>



                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    height: getHeight(14),
                    width: getWidth(20),
                    alignContent: 'center',
                    
                }}>
                    <Image
                        style={{
                            height: getHeight(10),
                            width: getWidth(10),
                            marginTop: config.getHeight(2)

                        }}
                        source={Icons.logoTM}
                        resizeMode='contain'

                    />
                    {/* <Text style={{
                        fontFamily: 'regular',
                        fontSize: getFontSize(2.5),
                        color: textColors.stayCurrentMD,
                        letterSpacing: config.isWeb ? getWidth(0.1) : config.getWidth(0.4)
                    }}>StayCurrent<Text style={{
                        color: textColors.stayCurrentMD,
                        letterSpacing: config.isWeb ? getWidth(0.1) : config.getWidth(0.4),
                        fontFamily: 'bold',
                        fontSize: getFontSize(2.5)
                    }}>MD</Text></Text> */}
                </View>
            </View>

            <View style={{
                height: getHeight(5.25),
                width: getWidth(100),
                marginTop: '1%',
                //backgroundColor: 'red',
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}>

                <View style={{
                    height: getHeight(5.25),
                    width: getWidth(20),
                    justifyContent: 'center',
                    position: 'absolute',
                    left: getWidth(4),
                }}>
                    <View style={{
                        height: getHeight(3.675),
                        //width: getWidth(18),
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity onPress={() => setShowDialog(true)} style={{
                            backgroundColor: backgroundColors.headerTitle,
                            borderWidth: 1,
                            borderColor: borderColors.profileImage,
                            justifyContent: 'center', alignItems: 'center',
                            paddingHorizontal: getWidth(1),
                            borderRadius: getHeight(1.8),
                            left: getWidth(4),
                        }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: commonColors.black
                            }}>
                                CONTACT US
                            </Text>
                        </TouchableOpacity>

                    </View>


                </View>

                <View style={{
                    height: getHeight(5.25),
                    width: getWidth(25),
                    // backgroundColor: 'pink',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <View style={{
                        height: getHeight(3.675),
                        width: getWidth(22.5),
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity onPress={() => {

                            // navigationService.reset([{ name: RouteNames.HomeNavigator, params: {} }], 0);

                            //window.history.replaceState({ tab: 'HomeNavigator' }, '', '/HomeNavigator');
                            // handleTabChange("HomeNavigator")
                            navigationService.navigate(RouteNames.Home)
                            dispatch(setCurrentTab("Home"))
                            console.log("window.location1", window.location)
                            // window.history.replaceState(null, '', window.location.href);
                        }} style={{
                            flex: 0.25,
                            borderBottomLeftRadius: getHeight(1.83),
                            backgroundColor: currentTab === "Home" ? commonColors.black : backgroundColors.headerTitle,
                            borderTopLeftRadius: getHeight(1.83),
                            borderWidth: 1, borderRightWidth: 0.5,
                            borderColor: borderColors.profileImage, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: currentTab === "Home" ? commonColors.white : commonColors.black
                            }}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {


                            // navigationService.reset([{ name: RouteNames.BrowseNavigator, params: {} }], 0);
                            // window.history.replaceState({ tab: 'BrowseNavigator' }, '', '/BrowseNavigator');
                            // handleTabChange("BrowseNavigator")
                            // navigationService.navigate(RouteNames.BrowseNavigator)
                            navigationService.navigate(RouteNames.Browse)
                            dispatch(setCurrentTab("Browse"))
                            console.log("window.location2", window.location)
                            // window.history.replaceState(null, '', window.location.href);
                        }} style={{
                            flex: 0.25,
                            backgroundColor: currentTab === "Browse" ? commonColors.black : backgroundColors.headerTitle,
                            borderWidth: 1, borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: borderColors.profileImage, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: currentTab === "Browse" ? commonColors.white : commonColors.black
                            }}>
                                Browse
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                                // navigationService.reset([{ name: RouteNames.SpaceNavigator, params: {} }], 0);

                                // navigationService.navigate(RouteNames.SpaceNavigator)
                                //  handleTabChange("SpaceNavigator")
                                navigationService.navigate(RouteNames.Spaces)
                                dispatch(setCurrentTab("Spaces"))
                                console.log("window.location3", window.location)
                                // window.history.replaceState(null, '', window.location.href);
                            }}
                            style={{
                                flex: 0.25,
                                backgroundColor: currentTab === "Spaces" ? commonColors.black : backgroundColors.headerTitle,
                                borderWidth: 1, borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: borderColors.profileImage, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: currentTab === "Spaces" ? commonColors.white : commonColors.black
                            }}>
                                Spaces
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                                // navigationService.reset([{ name: RouteNames.LibraryNavigator, params: {} }], 0);

                                // navigationService.navigate(RouteNames.LibraryNavigator)
                                // handleTabChange("LibraryNavigator")
                                navigationService.navigate(RouteNames.LibraryDashboard)
                                dispatch(setCurrentTab("MyLibrary"))
                                console.log("window.location4", window.location)
                                // window.history.replaceState(null, '', window.location.href);
                            }}
                            style={{
                                flex: 0.25,
                                borderBottomRightRadius: getHeight(1.83),
                                backgroundColor: currentTab === "MyLibrary" ? commonColors.black : backgroundColors.headerTitle,
                                borderTopRightRadius: getHeight(1.83),
                                justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: borderColors.profileImage
                            }}>
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: getFontSize(2.5),
                                color: currentTab === "MyLibrary" ? commonColors.white : commonColors.black
                            }}>
                                My Library
                            </Text>

                        </TouchableOpacity>
                    </View>


                </View>

                <View style={{
                    width: getWidth(15),
                    height: getHeight(5.25),
                    // backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute', right: '4%',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigationService.navigate(RouteNames.Profile)
                        }}
                        style={{
                            width: getWidth(2),
                            height: getWidth(2),
                            borderRadius: getWidth(1),
                            justifyContent: 'center', alignItems: 'center',
                            borderWidth: 1, borderColor: borderColors.profileImage,
                            marginRight: getHeight(0.5)
                            // backgroundColor: 'pink'
                        }}>
                        <Image
                            style={{
                                width: getWidth(1.5),
                                height: getWidth(1.5)

                                // backgroundColor: 'yellow'

                            }}
                            source={Icons.userProfile}
                            resizeMode='contain'

                        />
                    </TouchableOpacity>
                </View>
            </View>
            {showDialog && (
                <View>
                    {showDialogSpace()}
                </View>
            )}
        </View >
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
    alertView: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '30%',
        borderColor: commonColors.black,
        borderWidth: 1,
    },
    alertTitle: {
        fontSize: config.generateFontSize(4),
        fontWeight: 'regular',
        color: commonColors.black,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: config.getHeight(2),
    },
    okButton: {
        backgroundColor: backgroundColors.requestAccess,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: config.getWidth(5),
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
})

export default HeaderWeb