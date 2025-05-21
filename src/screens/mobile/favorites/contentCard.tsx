import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Alert, Share, Modal, Platform } from 'react-native';
import { SearchBar } from '@/src/components/searchbar';
import HeaderBack from '@/src/components/headerBack';
import config from '../../../utils/config';
import { borderColors, commonColors } from '@/src/utils/colors';
import Icons from '@/src/assets/icons';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setContent, setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { TOGGLE_CONTENT_FAV } from '@/src/services/MutationMethod';
import { BASE_API_URL_DEEPLINK_PROD, stripHtmlTags } from '@/src/components/GlobalConstant';
import * as Clipboard from 'expo-clipboard';

const ContentCard: React.FC<{ item: any, refetch: () => void, onDownloadPress?: () => void, isDownloaded?: boolean, onLikedPress?: (id: number) => void, isLoading?: boolean, progress?: number }> = ({ item, refetch, onDownloadPress, isDownloaded, onLikedPress, isLoading, progress = 0, }) => {
    const dispatch = useDispatch();
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [menuVisible, setMenuVisible] = useState(false);
    const threeDotsRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const getFontSize = (size: number) => {
        if (config.isWeb) {
            const webSize = 0.20 * size
            return dimension.width * (webSize / 100)
        }
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {

        if (config.isWeb) {
            const webWidth = 0.4 * width
            return dimension.width * (webWidth / 100)
        }
        return dimension.width * (width / 100)
    }


    const getHeight = (height: number) => {
        if (config.isWeb) {
            const webHeight = 0.4 * height
            return dimension.width * (webHeight / 100)
        }
        return dimension.height * (height / 100)
    }

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

    const [toggleFavorite, { loading: toggleLoading }] = useMutation(TOGGLE_CONTENT_FAV, {
        onCompleted: async () => {
            Alert.alert("Success", "Content removed from favorites successfully");
            await refetch();
        },
        onError: (error) => {
            Alert.alert("Error", "Failed to remove favorite");
            console.error('Error toggling favorite:', error.message);
        },
    });

    const handleRemoveFavorite = () => {
        toggleFavorite({ variables: { input: { content_id: item.id } } });
        setMenuVisible(false);
    };

    const handleItemShareClick = async (item: any) => {
        try {
            const urlToShare = `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}`;
            const message = Platform.OS === 'android' ? `${BASE_API_URL_DEEPLINK_PROD}?id=${Number(item?.id)}` : ``;

            if (config.isWeb && !navigator.share) {
                // Web fallback: Copy to clipboard
                Clipboard.setStringAsync(urlToShare);
                Alert.alert('Link copied to clipboard!');
                return;
            }

            const result = await Share.share({
                message,
                url: urlToShare,
                title: item?.content_type_info?.name,
            });

            if (result.action === Share.sharedAction) {
                console.log('Content shared successfully');
            }
        } catch (error) {
            console.error('Error sharing content:', error);
        }
        setMenuVisible(false);
    };

    const menuItems = [
        { label: 'Remove Favorite', action: handleRemoveFavorite, icon: Icons.removeFav },
        {
            label: isDownloaded ? 'Remove from Download' : 'Download Content',
            action: () => {
                if (onDownloadPress) {
                    onDownloadPress();
                    setMenuVisible(false);
                }
            }, icon: Icons.download
        },
        {
            label: 'Share', icon: Icons.share, action: () => {
                setMenuVisible(false);
                setTimeout(() => handleItemShareClick(item), 700);
            }
        },
    ];

    const handleCardPress = (itemId: number) => {
        // console.log('Content Id-->', itemId);
        dispatch(setContentId(Number(itemId)))
        dispatch(setContent(null))
        dispatch(setSpaceDashBoard(false))
        dispatch(setStartfromSpaceDashBoard(false))
        navigationService.navigate(RouteNames.Content)
    }

    const handleItemLikeClick = (item: any) => {
        if (onLikedPress) {
            onLikedPress(item?.id);
        }
    };

    const handleItemChatClick = (item: any) => {
        navigationService.navigate(RouteNames.CommentsScreen, { commentsID: item?.id });
    };

    return (
        <>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image source={Icons.logo} style={styles.typeIcon} resizeMode='contain' />
                    <Text style={styles.typeText}>{item?.content_type_info?.name}</Text>
                    {
                        <TouchableOpacity ref={threeDotsRef} style={styles.moreButton} onPress={toggleMenu}>
                            <Image source={Icons.threeDots} style={styles.threeIcon} resizeMode='contain' />
                        </TouchableOpacity>

                    }
                    <Modal visible={menuVisible} transparent animationType="fade">
                        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
                            <View style={[
                                styles.menuContainer,
                                { top: menuPosition.top, right: config.getWidth(10) },
                            ]}>
                                <FlatList
                                    data={menuItems}
                                    keyExtractor={(item) => item.label}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={item.action} style={styles.menuItem}>
                                            <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                                            <Text style={styles.menuText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
                <TouchableOpacity style={styles.contentContainer} onPress={() => handleCardPress(item.id)}>
                    <View style={styles.iconContainer}>
                        <Image source={item.associated_content_files[0]?.thumbnail ? { uri: item.associated_content_files[0]?.thumbnail } : Icons.contentThumbnail} style={styles.contentIcon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {item.content_title.length > 15 ? item.content_title.slice(0, 30) + "..." : item.content_title}
                        </Text>

                        <Text style={styles.description} numberOfLines={3}>
                            {stripHtmlTags(item?.description)}
                        </Text>
                    </View>
                </TouchableOpacity>
                {isLoading && (
                    <View style={[styles.loaderOverlay, { borderRadius: config.isWeb ? getWidth(4) : config.getWidth(5) }]}>
                        <ActivityIndicator size="large" color="#8737B1" />
                        <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
                    </View>
                )}
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleItemLikeClick(item)}>
                        <Image source={item.is_liked ? Icons.contentLiked : Icons.heartIcon} style={styles.actionIcon} resizeMode='contain' />
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => handleItemChatClick(item)}>
                        <Image source={Icons.contentComment} style={styles.actionIcon} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleItemShareClick(item)}>
                        <Image source={Icons.shareIcon} style={styles.actionIcon} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>

        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white,
    },
    subcontainer: {
        flex: 1,
        padding: config.getWidth(5),
        gap: config.getWidth(5),
    },
    card: {
        borderWidth: config.getWidth(0.3),
        borderColor: borderColors.profileImage,
        borderRadius: config.getWidth(5),
        padding: config.getWidth(3),
        backgroundColor: commonColors.white,
        gap: config.getWidth(3),
        marginBottom: config.getHeight(3)
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeIcon: {
        width: config.getWidth(8),
        height: config.getHeight(3.5),
        marginRight: config.getWidth(2),
    },
    threeIcon: {
        width: config.getWidth(8),
        height: config.getHeight(2.5),
    },
    typeText: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'regular',
        textAlign: 'left',
        flex: 1,
    },
    moreButton: {
        padding: 5,
    },
    moreButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentContainer: {
        flexDirection: 'row',
        gap: config.getWidth(6),
        paddingHorizontal: config.getWidth(3),
    },
    iconContainer: {
        flex: 0.7,
        height: config.getHeight(11),
        borderWidth: config.getWidth(0.3),
        borderColor: borderColors.profileImage,
        borderRadius: config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentIcon: {
        width: config.getWidth(20),
        height: config.getHeight(8),
        borderRadius: config.getWidth(2),
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'bold',
        textAlign: 'left',
        marginBottom: config.getHeight(1),
    },
    description: {
        fontSize: config.generateFontSizeNew(10),
        fontFamily: 'regular',
        textAlign: 'left',
        height: config.getHeight(7),
    },
    actionButtons: {
        flexDirection: 'row',
        gap: config.getWidth(4),
        paddingHorizontal: config.getWidth(4),
    },
    actionIcon: {
        width: config.getWidth(7),
        height: config.getHeight(2),
    },
    menuStyle: {
        marginTop: config.getHeight(4),
        marginLeft: config.getWidth(-5),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        borderRadius: 16,
        elevation: 0,
    },
    menuButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black
    },
    menuIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    closeMenuItem: {
        alignItems: 'flex-start',
    },

    closeButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.red
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { textAlign: 'center', margin: 20, color: commonColors.red },
    listContainer: {},
    footerLoader: {
        paddingVertical: config.getHeight(2),
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: config.getWidth(5),
    },
    retryButton: {
        marginTop: config.getHeight(2),
        padding: config.getWidth(3),
        backgroundColor: commonColors.black,
        borderRadius: config.getWidth(2),
    },
    retryText: {
        color: commonColors.white,
        fontFamily: 'bold',
        fontSize: config.generateFontSizeNew(14),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: config.getHeight(10),
    },
    emptyText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
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
        borderRadius: config.getWidth(5),
        padding: config.getWidth(3),
        elevation: 5,
        borderWidth: 1,
        width: config.getWidth(45),
    },
    menuText: {
        fontSize: 16,
        color: commonColors.black,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', borderRadius: config.getWidth(5), },
    progressBar: { width: 100, marginTop: 20, borderRadius: 5 },
    progressText: {
        fontSize: config.generateFontSizeNew(18),
        fontFamily: 'bold',
        color: '#000000',
        textAlign: 'left',
        marginTop: 5,
    },
});


export default ContentCard