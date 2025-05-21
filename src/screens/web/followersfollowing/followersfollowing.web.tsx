import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, ActivityIndicator, ScrollView } from 'react-native';
import config from '../../../utils/config';
import { backgroundColors, commonColors } from '@/src/utils/colors';
import navigationService from '@/src/navigation/navigationService';
import { EFollowActions } from '@/src/utils/keys';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_FOLLOWERS_FOLLOWING_LIST } from '@/src/services/QueryMethod';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import WebBaseLayout from '@/src/components/webBaseLayout';
import { useSelector } from 'react-redux';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import alert from '@/src/utils/alert';

const ITEMS_PER_PAGE = 10;

interface User {
    id: string;
    name: string;
    profileImage: string;
    isFollowing: boolean;
    isFollower: boolean;
}

interface TabSwitchProps {
    activeTab: 'followers' | 'following';
    onTabChange: (tab: 'followers' | 'following') => void;
}

const FollowersFollowingWeb: React.FC = () => {
    const route = useRoute();
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const { activeTab: initialActiveTab } = route.params as { activeTab: 'followers' | 'following' };
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialActiveTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [localUsers, setLocalUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    const [getUsers, { loading, error, refetch }] = useLazyQuery(GET_FOLLOWERS_FOLLOWING_LIST, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            const newUsers = data?.getFollowerAndFollowingLists?.users?.map(mapUserData) || [];
            if (page === 1) {
                setLocalUsers(newUsers);
            } else {
                setLocalUsers(prev => [...prev, ...newUsers]);
            }
            setHasMoreData(newUsers.length === ITEMS_PER_PAGE);
            setIsLoadingMore(false);
        },
        onError: (error) => {
            console.error('Query error:', error);
            alert('Error', 'Failed to load users. Please try again.');
            setIsLoadingMore(false);
            setHasMoreData(false);
        }
    });

    const [searchUsers, { loading: searchLoading }] = useLazyQuery(GET_FOLLOWERS_FOLLOWING_LIST, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            const newUsers = data?.getFollowerAndFollowingLists?.users?.map(mapUserData) || [];
            if (page === 1) {
                setLocalUsers(newUsers);
            } else {
                setLocalUsers(prev => [...prev, ...newUsers]);
            }
            setHasMoreData(newUsers.length === ITEMS_PER_PAGE);
            setIsLoadingMore(false);
        },
        onError: (error) => {
            console.error('Search error:', error);
            alert('Error', 'Search failed. Please try again.');
            setIsLoadingMore(false);
            setHasMoreData(false);
        }
    });

    const [handleFollowAction] = useMutation(REQUEST_FOLLOW_ACTIONS);

    // useEffect(() => {
    //     loadInitialData();
    // }, [activeTab]);
    useFocusEffect(
        useCallback(() => {
            loadInitialData();
        }, [activeTab])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            } else {
                loadInitialData();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadInitialData = () => {
        setPage(1);
        setHasMoreData(true);
        getUsers({
            variables: {
                input: {
                    requireFollowingList: activeTab === 'following',
                    page: 1,
                    page_size: ITEMS_PER_PAGE
                }
            }
        });
    };

    const handleSearch = () => {
        setPage(1);
        setHasMoreData(true);
        searchUsers({
            variables: {
                input: {
                    requireFollowingList: activeTab === 'following',
                    keyword: searchQuery,
                    page: 1,
                    page_size: ITEMS_PER_PAGE
                }
            }
        });
    };

    const mapUserData = (user: any): User => ({
        id: user.id,
        name: user.display_name || `${user.first_name} ${user.last_name}`,
        profileImage: user.profile_image_path,
        isFollowing: activeTab === 'following',
        isFollower: user.follow_back_status,
    });


    const loadMoreData = async () => {
        if (isLoadingMore || !hasMoreData || loading || searchLoading) return;
        setIsLoadingMore(true);
        const nextPage = page + 1;
        const query = searchQuery ? searchUsers : getUsers;

        query({
            variables: {
                input: {
                    requireFollowingList: activeTab === 'following',
                    keyword: searchQuery || undefined,
                    page: nextPage,
                    page_size: ITEMS_PER_PAGE,
                }
            },
            onCompleted: (data) => {
                const newUsers = data?.getFollowerAndFollowingLists?.users?.map(mapUserData) || [];
                setLocalUsers(prev => [...prev, ...newUsers]);
                setHasMoreData(newUsers.length === ITEMS_PER_PAGE);
                setPage(nextPage);
                setIsLoadingMore(false);
            },
            onError: (error) => {
                console.error('Pagination error:', error);
                setIsLoadingMore(false);
                setHasMoreData(false);
            }
        });
    };


    const handleRefresh = () => {
        if (searchQuery) {
            handleSearch();
        } else {
            loadInitialData();
        }
    };

    const handleFollowPress = async (userId: string, isFollowing: boolean, isFollower: boolean) => {
        try {
            let actionType: EFollowActions;
            if (activeTab === 'following') {
                actionType = isFollowing ? EFollowActions.UNFOLLOW : EFollowActions.FOLLOW;
            } else {
                actionType = isFollower ? EFollowActions.REMOVE : EFollowActions.FOLLOW_BACK;
            }

            const { data } = await handleFollowAction({
                variables: {
                    input: {
                        following_id: userId,
                        action: actionType,
                    },
                },
            });

            if (!data?.handleFollowActions?.success) {
                throw new Error(data?.handleFollowActions?.message || 'Something went wrong');
            }

            setLocalUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? {
                            ...user,
                            isFollowing: actionType === EFollowActions.FOLLOW || (activeTab === 'followers' && !isFollower),
                            isFollower: actionType === EFollowActions.FOLLOW_BACK ? true : user.isFollower,
                        }
                        : user
                )
            );
            await refetch();
        } catch (error: any) {
            alert('Error', error.message || 'Failed to update follow status');
        }
    };

    const handleRemoveFollower = (userId: string) => {
        alert(
            'Remove Follower',
            'Are you sure you want to remove this follower?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const { data } = await handleFollowAction({
                                variables: {
                                    input: {
                                        following_id: userId,
                                        action: EFollowActions.REMOVE,
                                    },
                                },
                            });
                            if (!data?.handleFollowActions?.success) {
                                throw new Error(data?.handleFollowActions?.message || 'Failed to remove follower');
                            }
                            setLocalUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                        } catch (error: any) {
                            alert('Error', error.message || 'Failed to remove follower');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleTabChange = (newTab: 'followers' | 'following') => {
        setActiveTab(newTab);
        setSearchQuery('');
        setPage(1);
        setHasMoreData(true);
        setLocalUsers([]);
    };

    const TabSwitch: React.FC<TabSwitchProps> = ({ activeTab, onTabChange }) => (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'following' && styles.activeTab]}
                onPress={() => { onTabChange('following') }}
            >
                <Text style={[styles.tabText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }, activeTab === 'following' && {
                    borderBottomWidth: 1,
                    borderBottomColor: '#007AFF',
                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                }]}>
                    Followings
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
                onPress={() => onTabChange('followers')}
            >
                <Text style={[styles.tabText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }, activeTab === 'followers' && {
                    borderBottomWidth: 1,
                    borderBottomColor: '#007AFF',
                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                }]}>
                    Followers
                </Text>
            </TouchableOpacity>
        </View>
    );

    // const renderFooter = () => {
    //     if (!isLoadingMore) return null;
    //     return (
    //         <View style={styles.footerLoader}>
    //             <ActivityIndicator size="small" color={commonColors.black} />
    //         </View>
    //     );
    // };

    const renderFooter = () => {
        if (isLoadingMore) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={commonColors.black} />
                </View>
            );
        }

        if (hasMoreData) {
            return (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreData}>
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const MainContent = (
        <View style={[styles.container, { width: getWidth(60) }]}>
            {/* {(error) &&
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText,{fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),}]}>Failed to load data</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={[styles.retryText,{fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),}]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            } */}
            <TabSwitch activeTab={activeTab} onTabChange={handleTabChange} />
            {/* <View style={styles.searchContainer}>
            <SearchBar onSearch={setSearchQuery} />
        </View> */}
            {(loading) ? (
                <View style={{ marginVertical: getHeight(10) }}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    data={localUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <UserListItem
                            id={item.id}
                            name={item.name}
                            folllowUnfollow={true}
                            profileImage={item.profileImage}
                            buttonLabel={
                                activeTab === 'following'
                                    ? item.isFollowing ? 'Unfollow' : 'Follow'
                                    : item.isFollower ? 'Remove' : 'Follow Back'
                            }
                            onPress={() =>
                                activeTab === 'followers' && item.isFollower
                                    ? handleRemoveFollower(item.id)
                                    : handleFollowPress(item.id, item.isFollowing, item.isFollower)
                            }
                        />
                    )}
                    contentContainerStyle={[styles.listContainer, { paddingHorizontal: getWidth(6), }]}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}>
                                {loading || searchLoading
                                    ? ''
                                    : 'No users found.'}
                            </Text>
                        </View>
                    )}
                    refreshing={loading && !isLoadingMore}
                    onRefresh={handleRefresh}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={config.isWeb ? 1 : 0.5}
                    ListFooterComponent={renderFooter}
                />
            )}

        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} showSearch onSearch={setSearchQuery} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#FFFFFF',
    },
    loader: {
        marginTop: config.getHeight(20),
    },
    backButton: {
        marginTop: config.getHeight(6),
    },
    backIcon: {
        width: config.getWidth(8),
        height: config.getHeight(2),
        marginLeft: config.getWidth(5)
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#707070',
        marginTop: config.getHeight(2),
    },
    tab: {
        flex: 1,
        paddingVertical: config.getHeight(0.5),
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#707070'
    },
    activeTab: {
    },
    tabText: {
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'regular',
        color: '#000000',
    },
    activeTabText: {
        borderBottomWidth: 1,
        borderBottomColor: '#007AFF',
        fontSize: config.generateFontSizeNew(14),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: config.getHeight(20),
    },
    emptyText: {
        width: config.getWidth(50),

        color: '#707070',
        textAlign: 'center',
    },
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
    errorText: {

        color: 'red',
        textAlign: 'center',
        marginBottom: config.getHeight(2),
    },
    retryButton: {
        padding: config.getWidth(3),
        backgroundColor: commonColors.black,
        borderRadius: 8,
    },
    retryText: {
        color: commonColors.white,

    },
    listContainer: {

        flexGrow: 1,
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(3),
        marginTop: config.getWidth(3)
    },
    loadMoreButton: {
        padding: config.getWidth(1),
        backgroundColor: backgroundColors.editProfile,
        borderRadius: config.getWidth(1),
        marginHorizontal: config.getWidth(15),
        marginVertical: config.getHeight(2)
    },
    loadMoreText: {
        textAlign: 'center',
        fontFamily: 'regular',
        color: commonColors.white,
    },
});

export default FollowersFollowingWeb;