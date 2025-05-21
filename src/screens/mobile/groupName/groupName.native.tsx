import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, SectionList, TextInput, Modal, FlatList } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { GET_GROUP_DIRECTORY_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { backgroundColors, borderColors, commonColors, textColors } from '@/src/utils/colors';
import { DELETE_DIRECTORY_GROUP } from '@/src/services/MutationMethod';
import { useDispatch } from 'react-redux';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { Menu, MenuItem } from 'react-native-material-menu';
import HeaderBack from '@/src/components/headerBack';

const ITEMS_PER_PAGE = 10;

const GroupName: React.FC = ({ route }) => {
    const { id } = route.params || {};
    const dispatch = useDispatch();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [seletedMenuItem, setSelectedMenuItem] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [allUsers, setAllUsers] = useState<any[]>([]);

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

    const [deleteGroup, { loading: deleting }] = useMutation(DELETE_DIRECTORY_GROUP);

    const { loading, error, data, refetch } = useQuery(GET_GROUP_DIRECTORY_DATA, {
        variables: {
            input: {
                group_id: parseInt(id, 10),
                page: 1,
                page_size: ITEMS_PER_PAGE
            }
        },
        fetchPolicy: 'network-only',
        onError: (error) => {
            console.error('GraphQL error:', error);
            Alert.alert('Error', 'Failed to load group data. Please try again.');
        },
        onCompleted: (data) => {
            const users = data?.getGroupDirectories?.directoryGroups?.[0]?.group_directories || [];
            setAllUsers(users);
            setHasMoreData(users.length === ITEMS_PER_PAGE);
        }
    });

    const [searchUsers, { loading: searchLoading, data: searchData, error: searchError }] = useLazyQuery(GET_GROUP_DIRECTORY_DATA, {
        fetchPolicy: 'network-only',
        onError: (error) => {
            console.error('Search error:', error);
            Alert.alert('Error', 'Search failed. Please try again.');
        }
    });

    const loadMoreData = async () => {
        if (isLoadingMore || !hasMoreData || searchText) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;

            const { data: newData } = await searchUsers({
                variables: {
                    input: {
                        group_id: parseInt(id, 10),
                        page: nextPage,
                        page_size: ITEMS_PER_PAGE
                    }
                }
            });

            const newUsers = newData?.getGroupDirectories?.directoryGroups?.[0]?.group_directories || [];

            if (newUsers.length > 0) {
                setAllUsers(prev => [...prev, ...newUsers]);
                setPage(nextPage);
                setHasMoreData(newUsers.length === ITEMS_PER_PAGE);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Load more error:', error);
            Alert.alert('Error', 'Failed to load more users. Please try again.');
        } finally {
            setIsLoadingMore(false);
        }
    };

    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearch = (text: string) => {
        setSearchText(text);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const newTimeout = setTimeout(() => {
            if (text.length > 0) {
                searchUsers({
                    variables: {
                        input: {
                            group_id: parseInt(id, 10),
                            user_keyword: text,
                            page: 1,
                            page_size: ITEMS_PER_PAGE
                        }
                    }
                });
            } else {
                refetch();
            }
        }, 500);

        setSearchTimeout(newTimeout);
    };

    const getTransformedUsers = () => {
        let usersToProcess = allUsers;

        if (searchText && searchData?.getGroupDirectories?.directoryGroups?.[0]?.group_directories) {
            usersToProcess = searchData.getGroupDirectories.directoryGroups[0].group_directories;
        }

        const users = usersToProcess.map((user: any) => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            speciality: user.speciality_info?.name || 'N/A',
            image: user.profile_image_path
        }));

        const grouped = users.reduce((acc: { [key: string]: any }, user) => {
            const firstLetter = user.name[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = { title: firstLetter, data: [] };
            }
            acc[firstLetter].data.push(user);
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => a.title.localeCompare(b.title));
    };

    const handleRefresh = async () => {
        try {
            setPage(1);
            setHasMoreData(true);
            await refetch();
        } catch (error) {
            console.error('Refresh error:', error);
            Alert.alert('Error', 'Failed to refresh data. Please try again.');
        }
    };

    const currentGroup = data?.getGroupDirectories?.directoryGroups?.find(
        (group) => group.id.toString() === id?.toString()
    );
    const headerTitle = currentGroup?.group_name || 'Group';

    const menuItems = ['Delete Group'];

    const handleDelete = async () => {
        if (!id) return;
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const { data } = await deleteGroup({
                                variables: {
                                    input: { group_ids: [parseInt(id, 10)] }
                                }
                            });

                            if (data?.deleteDirectoryGroup?.success) {
                                Alert.alert('Success', 'Group deleted successfully');
                                navigationService.reset([
                                    { name: RouteNames.Home },
                                    { name: RouteNames.Groups }
                                ]);
                            } else {
                                throw new Error(data?.deleteDirectoryGroup?.message || 'Deletion failed');
                            }
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const onMenuItemSelect = (item: string) => {
        switch (item) {
            case 'Delete Group':
                handleDelete();
                break;
            default:
                break;
        }
        setSelectedMenuItem(item);
        setMenuVisible(false);
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={commonColors.black} />
            </View>
        );
    };

    // if (loading && !isLoadingMore) {
    //     return (
    //           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //                                 <ActivityIndicator />
    //                             </View>
    //     );
    // }

    if (error && !allUsers.length) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Failed to load group data</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderBack title={headerTitle} backgroundColor='#F8F8F8' />
            <View style={styles.subcontainer}>
                <View style={styles.header}>
                    {searchVisible ? (
                        <TextInput
                            allowFontScaling={false}
                            style={styles.searchBar}
                            placeholder="Search Users"
                            value={searchText}
                            onChangeText={handleSearch}
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.allGroupsText}>{''}</Text>
                    )}
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
                            <Image source={Icons.search} resizeMode='contain' style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity ref={threeDotsRef} onPress={toggleMenu}>
                            <Image source={Icons.threeDots} resizeMode="contain" style={styles.icon} />
                        </TouchableOpacity>
                        <Modal visible={menuVisible} transparent animationType="fade">
                            <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
                                <View style={[
                                    styles.menuContainer,
                                    { top: menuPosition.top, right: config.getWidth(10) },
                                ]}>
                                    <FlatList
                                        data={menuItems}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => onMenuItemSelect(item)} style={styles.menuItem}>
                                                <Text style={styles.menuText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                </View>
                <SectionList
                    sections={getTransformedUsers()}
                    keyExtractor={(item) => item.id.toString()}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Image
                                source={item.image ? { uri: item.image } : Icons.userProfile}
                                resizeMode='cover'
                                style={styles.userImage}
                            />
                            <View>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userSpeciality}>{item.speciality}</Text>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={handleRefresh}
                    refreshing={loading && !isLoadingMore}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchText ? 'No users found' : 'No users in this group'}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subcontainer: {
        flex: 1,
        backgroundColor: commonColors.white,
        padding: config.getWidth(1),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: config.getWidth(5),
        paddingVertical: config.getHeight(1.5),
        borderBottomWidth: 1,
        borderBottomColor: borderColors.commentTextInput,
    },
    allGroupsText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        textAlign: 'center'
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    icon: {
        width: config.getWidth(6),
        height: config.getHeight(2),
        marginLeft: config.getWidth(3),
    },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: config.getWidth(4),
        paddingVertical: config.getHeight(2),
    },
    groupIcon: {
        width: config.getWidth(10),
        height: config.getHeight(3),
    },
    groupText: {
        flex: 1,
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(15),
        color: commonColors.black,
        textAlign: 'left',
        marginLeft: config.getWidth(6),
    },
    groupCount: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        textAlign: 'center',
        marginRight: config.getWidth(6),
    },
    menuStyle: {
        marginTop: config.getHeight(3),
        marginLeft: config.getWidth(1),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        borderRadius: 16,
        elevation: 0,
    },
    menuButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(16),
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
    listContainer: {
        padding: 16,
    },
    sectionHeader: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'regular',
        marginTop: config.getHeight(1.5),
        marginBottom: config.getHeight(1),
        color: '#000000',
        marginLeft: config.getWidth(4),
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: config.getHeight(0.5),
    },
    userImage: {
        width: config.getWidth(13),
        height: config.getWidth(13),
        borderRadius: config.getWidth(12.5),
        marginRight: config.getWidth(5),
        borderColor: borderColors.profileImage,
        borderWidth: 1.5
    },
    userName: {
        marginLeft: config.getWidth(4),
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'regular',
        color: '#000000',
    },
    userSpeciality: {
        marginLeft: config.getWidth(4),
        fontSize: config.generateFontSizeNew(11),
        fontFamily: 'regular',
        color: '#000000',
        bottom: 3
    },
    searchBar: {
        flex: 1,
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        padding: 5,
        backgroundColor: '#eee',
        borderRadius: 8
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.red,
        marginBottom: 10,
    },
    retryButton: {
        padding: 10,
        backgroundColor: commonColors.white,
        borderRadius: 5,
    },
    retryText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.white,
    },
    footerLoader: {
        paddingVertical: config.getHeight(2),
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: config.getHeight(10),
    },
    emptyText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        textAlign: 'center',
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default GroupName;