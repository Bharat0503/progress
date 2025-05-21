import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import config from '../../../utils/config';
import { commonColors } from '@/src/utils/colors';
import navigationService from '@/src/navigation/navigationService';
import { EFollowActions } from '@/src/utils/keys';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_FOLLOWERS_FOLLOWING_LIST } from '@/src/services/QueryMethod';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { useRoute, useFocusEffect } from '@react-navigation/native';

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

const FollowersFollowing: React.FC = () => {
    const route = useRoute();
    const { activeTab: initialActiveTab } = route.params as { activeTab: 'followers' | 'following' };
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialActiveTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [localUsers, setLocalUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    const [getUsers, { loading, error , refetch}] = useLazyQuery(GET_FOLLOWERS_FOLLOWING_LIST, {
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
            Alert.alert('Error', 'Failed to load users. Please try again.');
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
            Alert.alert('Error', 'Search failed. Please try again.');
            setIsLoadingMore(false);
            setHasMoreData(false);
        }
    });

    const [handleFollowAction] = useMutation(REQUEST_FOLLOW_ACTIONS);

   
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
        setPage(nextPage);

        const query = searchQuery ? searchUsers : getUsers;
        query({
            variables: {
                input: {
                    requireFollowingList: activeTab === 'following',
                    keyword: searchQuery || undefined,
                    page: nextPage,
                    page_size: ITEMS_PER_PAGE
                }
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
            Alert.alert('Error', error.message || 'Failed to update follow status');
        }
    };

    const handleRemoveFollower = (userId: string) => {
        Alert.alert(
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
                            Alert.alert('Error', error.message || 'Failed to remove follower');
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
                onPress={() => {onTabChange('following')}}
            >
                <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
                    Followings
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
                onPress={() => onTabChange('followers')}
            >
                <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>
                    Followers
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={commonColors.black} />
            </View>
        );
    };

    // if (error) {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <Text style={styles.errorText}>Failed to load data</Text>
    //             <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
    //                 <Text style={styles.retryText}>Retry</Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigationService.goBack()}>
                <Image source={Icons.backIcon} style={styles.backIcon} resizeMode='contain' />
            </TouchableOpacity>
            <TabSwitch activeTab={activeTab} onTabChange={handleTabChange} />
            <View style={styles.searchContainer}>
                <SearchBar onSearch={setSearchQuery} />
            </View>
            {(error) && (
                <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load data</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
            )}
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
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {loading || searchLoading
                                ? ''
                                : 'No users found.'}
                        </Text>
                    </View>
                )}
                refreshing={loading && !isLoadingMore}
                onRefresh={handleRefresh}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        marginTop: config.getHeight(20),
    },
    emptyText: {
        width: config.getWidth(50),
        fontSize: config.generateFontSizeNew(14),
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
        fontSize: config.generateFontSizeNew(14),
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
        fontSize: config.generateFontSizeNew(14),
    },
    listContainer: {
        paddingHorizontal: config.getWidth(6),
        flexGrow: 1,
    },
     searchContainer: {
            paddingHorizontal: config.getWidth(3),
            marginTop: config.getWidth(3)
        },
});

export default FollowersFollowing;