import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icons from '../assets/icons';
import config from '../utils/config';
import { backgroundColors, borderColors, commonColors } from '../utils/colors';
import { useDispatch, useSelector } from 'react-redux';
import ContentType from '../utils/contentTypeIds';
import navigationService from '../navigation/navigationService';
import RouteNames from '../navigation/routes';
import { setCurrentTab, setSpace } from '../redux/action';
import { stripHtmlTags } from './GlobalConstant';

interface SearchContentProps {
    spaceInfo?: any
    width?: number
    itemTitle?: string;
    title?: string;
    subtitle?: string;
    itemIconSource?: any;
    contentIconSource?: any;
    onLikePress?: () => void;
    onChatPress?: () => void;
    onSharePress?: () => void;
    onItemClick?: () => void;
    is_liked?: boolean;
    contentType?: number;
}

const SearchContent: React.FC<SearchContentProps> = ({
    spaceInfo,
    width,
    itemTitle,
    title,
    subtitle,
    itemIconSource,
    contentIconSource,
    onLikePress,
    onChatPress,
    onSharePress,
    onItemClick,
    is_liked,
    contentType
}) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)

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

    const dispatch = useDispatch()

    return (
        <View style={[styles.container, { marginTop: config.isWeb ? getHeight(3) : config.getHeight(3) }]}>
            {/* Separator and Header */}
            <View style={[styles.separatorView, { height: config.isWeb ? getHeight(4) : config.getHeight(4) }]}>
                <View style={{
                    top: getHeight(2),
                    width: config.isWeb ? width : config.getWidth(90),

                    height: 1,
                    backgroundColor: borderColors.spacesImage,

                    zIndex: 1,
                }} />
                <View style={styles.headerContainer}>
                    {
                        spaceInfo && spaceInfo?.minified_logo_path
                            ?
                            <TouchableOpacity onPress={() => {

                                let space =
                                {
                                    id: spaceInfo?.id,
                                    logo: spaceInfo?.logo_path,
                                    name: spaceInfo?.name
                                }
                                dispatch(setSpace(space))
                                if (config.isWeb) {
                                    navigationService.navigate(RouteNames.SpaceDashBoard)
                                    dispatch(setCurrentTab("Spaces"))
                                }
                                else {
                                    navigationService.navigate(RouteNames.SpaceNavigator, { screen: RouteNames.SpaceDashBoard });
                                }

                            }}
                                style={{
                                    marginLeft: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                                    width: config.isWeb ? getWidth(2.125) : config.getWidth(8.5),
                                    height: config.isWeb ? getWidth(2.125) : config.getWidth(8.5),
                                    top: config.isWeb ? getHeight(-0.5) : null,
                                    borderRadius: config.isWeb ? getWidth(1.06) : config.getWidth(4.25),
                                    borderWidth: 1,
                                    borderColor: borderColors.profileImage,
                                    justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: commonColors.white
                                }}>
                                <Image
                                    source={{ uri: spaceInfo?.minified_logo_path }}
                                    style={{

                                        width: config.isWeb ? getWidth(2) : config.getWidth(7),
                                        height: config.isWeb ? getWidth(2) : config.getWidth(7),


                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            :

                            <Image
                                source={Icons.logoWithCircle}
                                style={{
                                    marginLeft: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                                    width: config.isWeb ? getWidth(2) : config.getWidth(8),
                                    height: config.isWeb ? getWidth(2) : config.getHeight(4),
                                    top: config.isWeb ? getHeight(-0.5) : null,
                                    // backgroundColor: 'pink'
                                }}
                                resizeMode="contain"
                            />
                    }


                    <View style={[styles.iconWithText, {
                        top: config.isWeb ? getHeight(-1) : null,
                        paddingHorizontal: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        paddingVertical: config.isWeb ? getHeight(0.75) : config.getWidth(1.5),
                        borderRadius: config.isWeb ? getWidth(5) : 18,
                        marginLeft: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                        backgroundColor:
                            contentType === ContentType.PODCASTS
                                ? backgroundColors.contentPodcast
                                : contentType === ContentType.INFOGRAPHICS
                                    ? backgroundColors.contentInfographic
                                    : contentType === ContentType.GUIDELINES
                                        ? backgroundColors.contentGuideline
                                        : contentType === ContentType.DIRECTORY
                                            ? backgroundColors.contentStaffDirectory
                                            : contentType === ContentType.VIDEOS
                                                ? backgroundColors.headerSpeciality
                                                : (contentType === ContentType.ARTICLES || contentType === ContentType.STORYCASTS)
                                                    ? backgroundColors.contentStorycast
                                                    : (contentType === ContentType.DOCUMENTS)
                                                        ? backgroundColors.contentGuideline
                                                        : "red"
                    }]}>
                        {
                            contentType === ContentType.PODCASTS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                }}
                                source={Icons.contentPodcast}
                                resizeMode='contain'

                            />
                        }

                        {
                            contentType === ContentType.INFOGRAPHICS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                }}
                                source={Icons.contentInfographic}
                                resizeMode='contain'

                            />
                        }
                        {
                            contentType === ContentType.GUIDELINES &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                }}
                                source={Icons.contentGuidelines}
                                resizeMode='contain'

                            />
                        }
                        {
                            contentType === ContentType.VIDEOS &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                }}
                                source={Icons.contentVideo}
                                resizeMode='contain'

                            />
                        }
                        {
                            (contentType === ContentType.ARTICLES) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                    tintColor: commonColors.white
                                }}
                                source={Icons.contentArticles}
                                resizeMode='contain'
                            />
                        }
                        {
                            (contentType === ContentType.STORYCASTS) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                    tintColor: commonColors.white
                                }}
                                source={Icons.contentStoryCast}
                                resizeMode='contain'

                            />
                        }

                        {
                            (contentType === ContentType.DOCUMENTS) &&
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    height: config.isWeb ? getWidth(1.35) : config.getHeight(2.7),
                                    tintColor: commonColors.white
                                }}
                                source={Icons.contentGuidelines}
                                resizeMode='contain'

                            />
                        }

                        {/* {
                            contentType === "Audio".toLowerCase() &&
                            <Image
                                style={{
                                     width: config.getWidth(5),
        height: config.getHeight(2.7),
                                }}
                                source={Icons.contentAudio}
                                resizeMode='contain'

                            />
                        }
                        {
                            contentType === "Directory".toLowerCase() &&
                            <Image
                                style={{
                                     width: config.getWidth(5),
        height: config.getHeight(2.7),
                                }}
                                source={Icons.contentDirectory}
                                resizeMode='contain'

                            />
                        }
                        {
                            contentType === "Collection".toLowerCase() &&
                            <Image
                                style={{
                                     width: config.getWidth(5),
        height: config.getHeight(2.7),
                                }}
                                source={Icons.contentDirectory}
                                resizeMode='contain'

                            />
                        } */}
                        <Text style={[styles.iconText, {
                            marginLeft: config.isWeb ? getWidth(0.625) : config.getWidth(2.5),
                            fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                        }]}>{itemTitle}</Text>
                    </View>
                </View>
            </View>

            {/* Content Section */}
            <View style={[styles.contentContainer, {
                marginTop: config.isWeb ? getHeight(2) : config.getHeight(2),
                paddingHorizontal: config.isWeb ? getWidth(2) : config.getWidth(3),
            }]}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={{
                        width: config.isWeb ? getWidth(15) : config.getWidth(32),
                        height: config.isWeb ? getWidth(12) : config.getHeight(15),
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }} onPress={onItemClick}>
                        <Image
                            source={{ uri: itemIconSource }}
                            style={[styles.itemIcon, {
                                width: '100%',
                                height: '100%',
                                borderRadius: config.isWeb ? getWidth(1.5) : config.getWidth(3),
                            }]}
                            resizeMode={config.isWeb ? "cover" : "cover"}
                        />
                    </TouchableOpacity>
                    <View style={[styles.actionsContainer, {
                        marginTop: config.isWeb ? getHeight(2) : config.getHeight(2),
                        marginBottom: config.isWeb ? getHeight(2) : config.getHeight(2),
                        width: config.isWeb ? getWidth(12) : config.getWidth(32),
                        paddingHorizontal: config.isWeb ? getWidth(0.5) : null
                    }]}>
                        <TouchableOpacity onPress={onLikePress}>
                            <Image
                                source={is_liked ? Icons.contentLiked : Icons.heartIcon}
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5.5),
                                    height: config.isWeb ? getWidth(2) : config.getHeight(2.3),
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onChatPress}>
                            <Image
                                source={Icons.chatIcon}
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5.5),
                                    height: config.isWeb ? getWidth(2) : config.getHeight(2.3),
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSharePress}>
                            <Image
                                source={Icons.shareIcon}
                                style={{
                                    width: config.isWeb ? getWidth(2) : config.getWidth(5.5),
                                    height: config.isWeb ? getWidth(2) : config.getHeight(2.3),
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={[styles.textContainer, {
                    marginLeft: config.isWeb ? getWidth(2) : config.getWidth(5),
                    height: config.isWeb ? getHeight(25) : config.getHeight(3),
                }]} onPress={onItemClick}>
                    <Text style={[styles.itemTitle, {
                        lineHeight: config.isWeb ? getHeight(3) : config.getHeight(2),
                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                        marginBottom: config.isWeb ? getHeight(1) : config.getHeight(1),
                    }]} numberOfLines={2}>
                        {title || ''}
                    </Text>
                    <Text style={[styles.itemSubTitle, { height: config.isWeb ? getHeight(20) : config.getHeight(18), fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14), }]} numberOfLines={6} ellipsizeMode='tail'>
                        {stripHtmlTags(subtitle || '')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Separator */}
            <View style={styles.separatorBottom} />
        </View >

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
        width: '100%'
    },
    separatorBottom: {
        width: '100%',
        height: 1,
        backgroundColor: borderColors.spacesImage,
    },
    separatorView: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    headerContainer: {
        flexDirection: 'row',
        zIndex: 2,
        alignItems: 'center',
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#A800A2',
    },
    iconText: {
        fontFamily: 'regular',
        color: 'white',

    },
    contentContainer: {
        flexDirection: 'row'
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemIcon: {
        borderWidth: 1,
        borderColor: 'gray',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'bold',
    },
    itemSubTitle: {
        color: '#555555',
        fontFamily: 'regular',
    },
});

export default SearchContent;
