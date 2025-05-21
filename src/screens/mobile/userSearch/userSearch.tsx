import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import HeaderBack from '@/src/components/headerBack';
import { GET_SEARCHED_USERS } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';

interface User {
    id: string;
    name: string;
    profileImage: any;
    isFollowing: boolean;
}

const UserSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [getSearchedUsers,
        {
            data: searchedUserData,
            loading: searchedUserLoading,
            error: searchedUserError
        }] = useLazyQuery(GET_SEARCHED_USERS, { fetchPolicy: 'network-only' });

    const [handleFollowAction, { loading: followLoading, error: followError }] = useMutation(REQUEST_FOLLOW_ACTIONS);


    // useEffect(() => {
    //     if (searchQuery.length >= 3) {
    //         getSearchedUsers({
    //             variables: {
    //                 input: {
    //                     keyword: searchQuery.toString(),
    //                 },
    //             },
    //         });
    //     } else {
    //         setFilteredUsers([]);
    //     }
    // }, [searchQuery]);


    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length >= 3) {
            getSearchedUsers({
                variables: {
                    input: { keyword: query },
                },
            });
        } else {
            setFilteredUsers([]);
        }
    };

    const arrangeUserData = (data: any) => {
        if (!data || !data.getAllUsers) return;
        // console.log('Data from GET_SEARCHED_USERS API:', JSON.stringify(data));
        const result = data.getAllUsers.users.map((user: any) => ({
            id: user.id.toString(),
            name: user.display_name,
            profileImage: user.profile_image_path,
            isFollowing: user.follow_status,
        }));
        setFilteredUsers(result);
    };

    useEffect(() => {
        if (searchedUserData) {
            arrangeUserData(searchedUserData);
        }
    }, [searchedUserData]);

    // const handleFollowPress = (userId: string) => {
    //     setFilteredUsers(prevUsers =>
    //         prevUsers.map(user =>
    //             user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    //         )
    //     );
    //     // console.log('Follow pressed')
    // };

    const handleFollowPress = async (userId: string, isFollowing: boolean) => {
        try {
            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, isFollowing: !isFollowing } : user
                )
            );

            const { data } = await handleFollowAction({
                variables: {
                    input: {
                        following_id: userId,
                        action: isFollowing ? EFollowActions.UNFOLLOW : EFollowActions.FOLLOW,
                    },
                },
            });

            if (!data?.handleFollowActions?.success) {
                throw new Error(data?.handleFollowActions?.message || 'Something went wrong');
            }

            console.log('Mutation Response:', data);
        } catch (error: any) {
            console.error('Follow Mutation Error:', error);
            // Revert UI changes if mutation fails
            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, isFollowing: isFollowing } : user
                )
            );
            Alert.alert(error.message || 'An error occurred');
        }
    };


    const EmptyComp = () => (
        <View style={styles.emptyContainer}>
            <Image source={Icons.search} style={styles.searchIcon} resizeMode='contain' />
            <Text style={styles.emptyText}>
                {searchQuery.length < 3
                    ? 'To start your search, enter at least three characters.'
                    : 'User not found.'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderBack title='Search Members' backgroundColor={backgroundColors.offWhite} />
            <View style={styles.subcontainer}>
                
                <View style={styles.searchContainer}>
                    <SearchBar
                        // value={searchQuery} 
                        // onChangeText={setSearchQuery} 
                        onSearch={handleSearch}
                        bgColor={backgroundColors.offWhite}
                        borderColor={borderColors.signInBorder}
                    />
                </View>
                {followError && <Text style={{ textAlign: 'center', color: 'red' }}>{followError.message}</Text>}
                {searchedUserLoading ? (
                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                           <ActivityIndicator />
                                       </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <UserListItem
                                borderless
                                folllowUnfollow={true}
                                paddingHor={true}
                                name={item.name}
                                profileImage={item.profileImage}
                                buttonLabel={item.isFollowing ? 'Unfollow' : 'Follow'}
                                onPress={() => handleFollowPress(item.id, item.isFollowing)}
                                id={item.id}
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled
                            />
                        )}
                        ListEmptyComponent={EmptyComp}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    subcontainer: {
        padding: config.getWidth(2),
        paddingBottom: config.getHeight(25)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(10),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(20),
    },
    searchIcon: {
        width: config.getWidth(12),
        height: config.getHeight(8),
        marginBottom: config.getHeight(1),
    },
    emptyText: {
        paddingHorizontal: config.getWidth(23),
        fontSize: config.generateFontSizeNew(16),
        color: '#707070',
        textAlign: 'center',
    },
     searchContainer: {
        paddingHorizontal: config.getWidth(2),
         marginTop: config.isWeb ? config.getWidth(0) : Platform.OS === 'ios' ? config.getHeight(-5) : config.getHeight(0)
    },
});

export default UserSearch;
