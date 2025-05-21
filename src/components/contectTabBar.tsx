import React, { useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Dimensions, FlatList } from 'react-native'
import config from '../utils/config'


import { backgroundColors, borderColors, commonColors, textColors, tintColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import LogoText from './logoText'
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux'
import useFetchDimention from '../customHooks/customDimentionHook'
import { setCurrentTab } from '../redux/action';
import ContentType from '../utils/contentTypeIds'

interface ContentTabBarProps {
    spaceLogo?: string
    type: number;
    isMenu?: boolean;
    onDownloadPress?: () => void;
    isDownloaded?: boolean;
    fromHistory?: boolean;
    onSharePress?: () => void;
}

const deviceWidth = Dimensions.get('window').width

const ContentTabBar: React.FC<ContentTabBarProps> = ({ spaceLogo, type, isMenu, onDownloadPress, isDownloaded, fromHistory, onSharePress }) => {
    // console.log('typeee------>', type);
    const space = useSelector((state: any) => state.reducer.space)
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [seletedMenuItem, setSelectedMenuItem] = useState<string>('');
    const [menuVisible, setMenuVisible] = useState(false);
    const threeDotsRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });



    const toggleMenu = () => {
        if (!menuVisible) {
            threeDotsRef.current.measure((_, __, width, height, pageX, pageY) => {
                setMenuPosition({ top: pageY + height, left: pageX });
                setMenuVisible(true);
            });
        } else {
            setMenuVisible(false);
        }
    };

    const menuItems = [
        ...(fromHistory ? ['Remove History'] : []),
        isDownloaded ? 'Remove from Download' : 'Download Content',
        'Share',
    ];





    const onMenuItemSelect = (item: string) => {
        toggleMenu();
        switch (item) {
            case 'Remove History':
                console.log(`Selected: ${item}`);
                break;
            case 'Download Content':
                if (onDownloadPress) {
                    onDownloadPress();
                }
                break;
            case 'Remove from Download':
                if (onDownloadPress) {
                    onDownloadPress();
                }
                break;
            case 'Share':
                if (onSharePress) {
                    setTimeout(() => {
                        onSharePress();
                    }, 500);
                }
                break;
            default:
                break;
        }
    };

    const getIcon = (item: string) => {
        switch (item) {
            case 'Remove History':
                return Icons.remove
            case 'Download Content':
                return Icons.download
            case 'Remove from Download':
                return Icons.remove
            case 'Share':
                return Icons.share
            default:
                break;
        }
    }

    const dispatch = useDispatch()

    // const getFontSize = (size: number) => {
    //     if (config.isWeb) {
    //         const webSize = 0.20 * size
    //         return dimension.width * (webSize / 100)
    //     }
    //     return (dimension.width / 320) * size
    // }

    // const getWidth = (width: number) => {
    //     if (config.isWeb) {
    //         const webWidth = 0.4 * width
    //         return dimension.width * (webWidth / 100)
    //     }
    //     return dimension.width * (width / 100)
    // }

    // const getViewWidth = (width: number) => {

    //     return dimension.width * (width / 100)
    // }

    // const getHeight = (height: number) => {
    //     if (config.isWeb) {
    //         const webHeight = 0.4 * height
    //         return dimension.width * (webHeight / 100)
    //     }
    //     return dimension.height * (height / 100)
    // }

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getViewWidth = (width: number) => {
        return dimension.width * (width / 100)
    }
    const getViewHeight = (height: number) => {
        return dimension.height * (height / 100)
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

    return (
        <>
            <View style={{
                justifyContent: isMenu ? 'space-between' : 'flex-start',
                alignItems: 'center',
                width: config.isWeb ? getViewWidth(60) : getWidth(90),
                height: config.isWeb ? getViewWidth(5) : getHeight(7),
                flexDirection: 'row',

            }}>
                <View style={{
                    width: config.isWeb ? getWidth(4) : config.getWidth(10),
                    height: config.isWeb ? getWidth(4) : config.getWidth(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: config.isWeb ? getWidth(4) : config.getWidth(5),
                    marginLeft: config.isWeb ? getWidth(1) : config.getWidth(1),
                    borderWidth: 1,
                    borderColor: borderColors.profileImage,

                }}>
                    <TouchableOpacity onPress={() => {
                        // navigationService.navigate(RouteNames.SpaceDashBoard)
                        if (config.isWeb) {
                            navigationService.navigate(RouteNames.SpaceDashBoard)
                            dispatch(setCurrentTab("Spaces"))
                        }
                        else {
                            navigationService.navigate(RouteNames.SpaceNavigator, { screen: RouteNames.SpaceDashBoard });
                        }

                    }}>
                        {
                            spaceLogo
                                ?
                                <Image
                                    style={{
                                        width: config.isWeb ? getWidth(3) : config.getWidth(7),
                                        height: config.isWeb ? getWidth(3) : config.getWidth(7),
                                    }}
                                    source={{ uri: spaceLogo }}
                                    resizeMode='contain'

                                />
                                : <Image
                                    style={{
                                        width: config.isWeb ? getWidth(3) : config.getWidth(7),
                                        height: config.isWeb ? getWidth(3) : config.getWidth(7),
                                    }}
                                    source={Icons.logo}
                                    resizeMode='contain'

                                />
                        }

                    </TouchableOpacity>
                </View>
                <View style={
                    [{
                        //width: config.getWidth(35),
                        height: config.isWeb ? getWidth(3) : config.getWidth(10),
                        width: config.isWeb ? getWidth(13) : config.getWidth(35),
                        borderRadius: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: config.isWeb ? getWidth(0) : config.getWidth(5),
                        marginLeft: config.isWeb ? getWidth(0.25) : config.getWidth(2),
                        //backgroundColor: 'pink'


                    },
                    type === ContentType.PODCASTS &&

                    {
                        backgroundColor: backgroundColors.contentPodcast,
                    },
                    type === ContentType.INFOGRAPHICS &&

                    {
                        backgroundColor: backgroundColors.contentInfographic,
                    },
                    (type === ContentType.GUIDELINES || type === ContentType.DOCUMENTS) &&
                    {
                        backgroundColor: backgroundColors.contentGuideline,
                    },
                    type === ContentType.DIRECTORY &&

                    {
                        backgroundColor: backgroundColors.contentStaffDirectory,
                    },
                    type === ContentType.VIDEOS &&

                    {
                        backgroundColor: backgroundColors.headerSpeciality,
                    }
                        ,
                    (type === ContentType.ARTICLES || type === ContentType.STORYCASTS) &&
                    {
                        backgroundColor: backgroundColors.contentStorycast,
                    }

                    ]
                }>
                    <View style={{
                        width: config.isWeb ? getWidth(4) : config.getWidth(8),
                        height: config.isWeb ? getWidth(4) : config.getWidth(8),
                        // backgroundColor: 'pink',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        {
                            type === ContentType.PODCASTS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentPodcast}
                                resizeMode='contain'

                            />
                        }
                        {
                            type === ContentType.VIDEOS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentPodcast}
                                resizeMode='contain'

                            />
                        }
                        {
                            type === ContentType.INFOGRAPHICS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentInfographic}
                                resizeMode='contain'

                            />
                        }
                        {
                            type === ContentType.GUIDELINES &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentInfographic}
                                resizeMode='contain'

                            />
                        }
                        {
                            type === ContentType.DIRECTORY &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    tintColor: commonColors.white
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentDirectory}
                                resizeMode='contain'

                            />
                        }
                        {
                            (type === ContentType.ARTICLES) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    tintColor: commonColors.white
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentArticles}
                                resizeMode='contain'

                            />
                        }
                        {
                            (type === ContentType.STORYCASTS) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    tintColor: commonColors.white
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentStoryCast}
                                resizeMode='contain'

                            />
                        }
                        {
                            (type === ContentType.DOCUMENTS) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(2) : config.getWidth(6),
                                    marginRight: config.isWeb ? getWidth(1) : config.getWidth(2),
                                    tintColor: commonColors.white
                                    // backgroundColor: 'pink'
                                }}
                                source={Icons.contentGuidelines}
                                resizeMode='contain'

                            />
                        }


                    </View>
                    <View style={{
                        height: config.isWeb ? getWidth(4) : config.getWidth(8),
                        //backgroundColor: 'pink',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {
                            type === ContentType.PODCASTS &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                Podcast

                            </Text>
                        }
                        {
                            type === ContentType.VIDEOS &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                Video

                            </Text>
                        }
                        {
                            type === ContentType.INFOGRAPHICS &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                Infographic

                            </Text>
                        }
                        {
                            type === ContentType.GUIDELINES &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                Guideline

                            </Text>
                        }
                        {
                            type === ContentType.DIRECTORY &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                Directory

                            </Text>
                        }
                        {
                            (type === ContentType.ARTICLES) &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                ARTICLES

                            </Text>
                        }
                        {
                            (type === ContentType.STORYCASTS) &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                STORYCASTS

                            </Text>
                        }
                        {
                            (type === ContentType.DOCUMENTS) &&
                            <Text style={{
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: commonColors.white
                            }}>
                                DOCUMENTS

                            </Text>
                        }
                    </View>
                </View>
                {
                    isMenu &&
                    <TouchableOpacity ref={threeDotsRef} onPress={toggleMenu}
                        style={[styles.threeDotsContainer, {
                            //marginLeft: config.isWeb ? getWidth(130) : config.getWidth(78)
                            // alignSelf: 'flex-end'
                        }]}

                    >
                        <Image source={Icons.threeDots} style={{
                            width: config.isWeb ? getWidth(2) : config.getWidth(5),
                            height: config.isWeb ? getWidth(2) : config.getWidth(5),
                            left: config.isWeb ? getWidth(-5) : config.getWidth(-5),
                        }} resizeMode="contain" />
                    </TouchableOpacity>

                }
            </View >


            <Modal visible={menuVisible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
                    <View style={[
                        styles.menuContainer,
                        {
                            top: menuPosition.top,
                            right: config.getWidth(10),
                            borderRadius: config.isWeb ? getWidth(2) : config.getWidth(5),
                            padding: config.isWeb ? getWidth(1) : config.getWidth(3),
                            width: config.isWeb ? getWidth(20) : config.getWidth(45),
                        }
                    ]}>
                        <FlatList
                            data={menuItems}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => onMenuItemSelect(item)} style={styles.menuItem}>
                                    <Image source={getIcon(item)} style={styles.icon} resizeMode="contain" />
                                    <Text style={[styles.menuText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>

    )

}

const styles = StyleSheet.create({
    titleContainer: {
        //width: config.getWidth(35),
        height: config.getWidth(10),
        borderRadius: config.getWidth(5),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: config.getWidth(5),
        marginLeft: config.getWidth(2),
    },
    logoContainer: {
        width: config.getWidth(10),
        height: config.getWidth(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: config.getWidth(5),
        marginLeft: config.getWidth(1),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
    },
    contentLogoContainer: {
        width: config.getWidth(8),
        height: config.getWidth(8),
        // backgroundColor: 'pink',
        justifyContent: 'center', alignItems: 'center'
    },
    contentLogoIcon: {
        width: config.getWidth(6),
        height: config.getWidth(6),
        marginRight: config.getWidth(2),
    },
    contentTextContainer: {
        // width: config.getWidth(20),
        height: config.getWidth(8),
        //backgroundColor: 'pink',
        justifyContent: 'center', alignItems: 'center'
    },
    contentText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(16),
        color: commonColors.white
    },

    logoIcon: {
        width: config.getWidth(7),
        height: config.getWidth(7),

    },
    threeDots: {

    },
    threeDotsContainer: {
        //position: 'absolute',
        paddingLeft: config.getWidth(35),
    },
    ///-------------------------//
    closeMenuItem: {
        alignItems: 'flex-start',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeMenuText: {
        color: commonColors.red,
    },
    closeButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.red,
        width: '80%',
        paddingRight: config.getWidth(3),
    },

    menuStyle: {
        marginLeft: config.getWidth(35),
        marginTop: 20,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        borderRadius: 16,
        elevation: 0,
    },
    menuStyleRemove: {
        marginTop: config.getHeight(0),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        borderRadius: 16,
        elevation: 0,
        width: config.getWidth(55),
        alignItems: 'flex-start',
        marginLeft: config.getWidth(27)
    },
    menuButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(16),
        color: commonColors.black,
        paddingRight: config.getWidth(3),
        width: '80%',
    },
    icon: {
        width: config.getWidth(5),
        height: config.getHeight(5),
        marginRight: config.getWidth(2),
        backgroundColor: backgroundColors.transparent,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: commonColors.white,

        elevation: 5,
        borderWidth: 1,
    },
    menuText: {
        fontFamily: 'regular',
        color: commonColors.black,
        width: config.getWidth(30),
    },
})


export default ContentTabBar