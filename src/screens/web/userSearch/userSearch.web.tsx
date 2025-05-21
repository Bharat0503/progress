// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import config from '../../../utils/config';
// import Icons from '../../../assets/icons/index';
// import { SearchBar } from '@/src/components/searchbar';
// import { UserListItem } from '@/src/components/userListItem';
// import HeaderBack from '@/src/components/headerBack';
// import { GET_SEARCHED_USERS } from '@/src/services/QueryMethod';
// import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
// import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';
// import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
// import { EFollowActions } from '@/src/utils/keys';
// import WebBaseLayout from '@/src/components/webBaseLayout';
// import { useSelector } from 'react-redux';
// import useFetchDimention from '@/src/customHooks/customDimentionHook';

// interface User {
//     id: string;
//     name: string;
//     profileImage: any;
//     isFollowing: boolean;
// }

// const UserSearchWeb: React.FC = () => {
//     const dimension = useSelector((state: any) => state.reducer.dimentions)
//     useFetchDimention();
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//     const [getSearchedUsers,
//         {
//             data: searchedUserData,
//             loading: searchedUserLoading,
//             error: searchedUserError
//         }] = useLazyQuery(GET_SEARCHED_USERS, { fetchPolicy: 'network-only' });

//     const [handleFollowAction, { loading: followLoading, error: followError }] = useMutation(REQUEST_FOLLOW_ACTIONS);

//     const getFontSize = (size: number) => {
//         return (dimension.width / 320) * size
//     }
//     const getWidth = (width: number) => {
//         return dimension.width * (width / 100)
//     }

//     const getHeight = (height: number) => {
//         return dimension.height * (height / 100)
//     }

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//         if (query.length >= 3) {
//             getSearchedUsers({
//                 variables: {
//                     input: { keyword: query },
//                 },
//             });
//         } else {
//             setFilteredUsers([]);
//         }
//     };

//     const arrangeUserData = (data: any) => {
//         if (!data || !data.getAllUsers) return;
//         // console.log('Data from GET_SEARCHED_USERS API:', JSON.stringify(data));
//         const result = data.getAllUsers.users.map((user: any) => ({
//             id: user.id.toString(),
//             name: user.display_name,
//             profileImage: user.profile_image_path,
//             isFollowing: user.follow_status,
//         }));
//         setFilteredUsers(result);
//     };

//     useEffect(() => {
//         if (searchedUserData) {
//             arrangeUserData(searchedUserData);
//         }
//     }, [searchedUserData]);

//     const handleFollowPress = async (userId: string, isFollowing: boolean) => {
//         try {
//             setFilteredUsers(prevUsers =>
//                 prevUsers.map(user =>
//                     user.id === userId ? { ...user, isFollowing: !isFollowing } : user
//                 )
//             );

//             const { data } = await handleFollowAction({
//                 variables: {
//                     input: {
//                         following_id: userId,
//                         action: isFollowing ? EFollowActions.UNFOLLOW : EFollowActions.FOLLOW,
//                     },
//                 },
//             });

//             if (!data?.handleFollowActions?.success) {
//                 throw new Error(data?.handleFollowActions?.message || 'Something went wrong');
//             }

//             console.log('Mutation Response:', data);
//         } catch (error: any) {
//             console.error('Follow Mutation Error:', error);
//             // Revert UI changes if mutation fails
//             setFilteredUsers(prevUsers =>
//                 prevUsers.map(user =>
//                     user.id === userId ? { ...user, isFollowing: isFollowing } : user
//                 )
//             );
//             Alert.alert(error.message || 'An error occurred');
//         }
//     };


//     const EmptyComp = () => (
//         <View style={styles.emptyContainer}>
//             <Image source={Icons.search} style={[styles.searchIcon,{
//                  width: getWidth(5),
//                  height: getWidth(5),
//             }]} resizeMode='contain' />
//             <Text style={[styles.emptyText,{
//                 paddingHorizontal: getWidth(5),
//                 fontSize: getFontSize(4),
//             }]}>
//                 {searchQuery.length < 3
//                     ? 'To start your search, enter at least three characters.'
//                     : 'User not found.'}
//             </Text>
//         </View>
//     );

//     const MainContent = (
//         <View style={[styles.container, { width: getWidth(50) }]}>
//             <View style={styles.subcontainer}>
//                 {followError && <Text style={{ textAlign: 'center', color: 'red' }}>{followError.message}</Text>}
//                 {searchedUserLoading ? (
//                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
//                         <ActivityIndicator />
//                     </View>
//                 ) : (
//                     <FlatList
//                         data={filteredUsers}
//                         keyExtractor={item => item.id}
//                         renderItem={({ item }) => (
//                             <UserListItem
//                                 borderless
//                                 folllowUnfollow={true}
//                                 paddingHor={true}
//                                 name={item.name}
//                                 profileImage={item.profileImage}
//                                 buttonLabel={item.isFollowing ? 'Unfollow' : 'Follow'}
//                                 onPress={() => handleFollowPress(item.id, item.isFollowing)}
//                                 id={item.id}
//                                 keyboardShouldPersistTaps="handled"
//                                 nestedScrollEnabled
//                             />
//                         )}
//                         ListEmptyComponent={EmptyComp}
//                     />
//                 )}
//             </View>
//         </View>
//     );

//     return (
//         <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: config.getHeight(100) }}>
//             <WebBaseLayout rightContent={MainContent} showSearch onSearch={handleSearch} />
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         //backgroundColor: '#F8F8F8',
//     },
//     subcontainer: {
//         padding: config.getWidth(2),
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: config.getHeight(10),
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: config.getHeight(20),
//     },
//     searchIcon: {

//         marginBottom: config.getHeight(1),
//     },
//     emptyText: {

//         color: '#707070',
//         textAlign: 'center',
//     },
//     searchContainer: {
//         paddingHorizontal: config.getWidth(2),
//         marginTop: config.isWeb ? config.getWidth(0) : config.getWidth(-10)
//     },
// });

// export default UserSearchWeb;




//----------------code with pagination--------------------------//


import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import HeaderBack from '@/src/components/headerBack';
import { GET_SEARCHED_USERS } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';
import WebBaseLayout from '@/src/components/webBaseLayout';
import { useSelector } from 'react-redux';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import { generateRandomId } from '@/src/components/GlobalConstant';
import RouteNames from '@/src/navigation/routes';
import navigationService from '@/src/navigation/navigationService';

interface User {
    id: string;
    name: string;
    profileImage: any;
    isFollowing: boolean;
}

const UserSearchWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const PAGE_SIZE = 20;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [getSearchedUsers] = useLazyQuery(GET_SEARCHED_USERS, {
        fetchPolicy: 'network-only'
    });

    const [handleFollowAction] = useMutation(REQUEST_FOLLOW_ACTIONS);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    };

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
    };

    const getHeight = (height: number) => {
        return dimension.height * (height / 100);
    };

    const processUsersData = useCallback((responseData: any, currentPage: number) => {
        //console.log('Users-->', responseData?.getAllUsers?.users);
        const users = responseData?.getAllUsers?.users;
        const pagination = responseData?.getAllUsers?.pagination || {};

        if (users) {
            const newUsers: User[] = users.map((user: any) => ({
                id: user.id.toString(),
                name: user.display_name,
                profileImage: user.profile_image_path,
                isFollowing: user.follow_status,
            }));

            setFilteredUsers(prevData =>
                currentPage === 1 ? newUsers : [...prevData, ...newUsers]
            );

            setHasMoreData(
                pagination?.total_records > currentPage * PAGE_SIZE
            );
            setIsLoading(false)
        } else {
            setIsLoading(false)
            setHasMoreData(false);
        }
        setIsLoadingMore(false);
    }, []);

    const handleSearch = async (query: string) => {
        setIsLoading(true)
        setSearchQuery(query);
        setPage(1);

        if (query.length >= 3) {
            try {
                const { data } = await getSearchedUsers({
                    variables: {
                        input: {
                            keyword: query,
                            page: 1,
                            page_size: PAGE_SIZE
                        },
                    },
                });
                processUsersData(data, 1);
            } catch (error) {
                console.error('Search error:', error);
                setFilteredUsers([]);
            }
        } else {
            setFilteredUsers([]);
        }
    };

    const loadMoreData = async () => {
        if (hasMoreData && !isLoadingMore && searchQuery.length >= 3) {
            setIsLoadingMore(true);
            try {
                const { data } = await getSearchedUsers({
                    variables: {
                        input: {
                            keyword: searchQuery,
                            page: page + 1,
                            page_size: PAGE_SIZE
                        },
                    },
                });
                processUsersData(data, page + 1);
                setPage(page + 1);
            } catch (error) {
                console.error('Load more error:', error);
                setIsLoadingMore(false);
            }
        }
    };

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
        } catch (error: any) {
            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, isFollowing: isFollowing } : user
                )
            );
            Alert.alert(error.message || 'An error occurred');
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    const EmptyComp = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={Icons.search}
                style={[styles.searchIcon, {
                    width: getWidth(5),
                    height: getWidth(5),
                }]}
                resizeMode='contain'
            />
            <Text style={[styles.emptyText, {
                paddingHorizontal: getWidth(5),
                fontSize: getFontSize(4),
            }]}>
                {searchQuery.length < 3
                    ? 'To start your search, enter at least three characters.'
                    : 'User not found.'}
            </Text>
        </View>
    );

    const MainContent = (
        <View style={[styles.container, { width: getWidth(60) }]}>
            <View style={styles.subcontainer}>
                {
                    isLoading ? (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator />
                        </View>
                    ) :

                        <FlatList
                            data={filteredUsers}
                            keyExtractor={item => item.id + generateRandomId()}
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
                            ListFooterComponent={renderFooter}
                            onEndReached={loadMoreData}
                            onEndReachedThreshold={0.5}
                        />
                }
            </View>
        </View>
    );

    const CreateGroup = (
        <TouchableOpacity
            style={[styles.createGrpButtonContainer, {
                paddingHorizontal: getWidth(3),
                paddingVertical: getHeight(0.5),
                borderRadius: getWidth(5),
                marginTop: getHeight(4),
            }]}
            onPress={() => navigationService.navigate(RouteNames.SpaceCreation)}
        >
            <Text style={[styles.createButtonText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(13) }]}>
                {'Are you interested in a space?'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            style={{
                paddingBottom: config.isWeb ? getHeight(5) : null,
                height: getHeight(100)
            }}
        >
            <WebBaseLayout
                rightContent={MainContent}
                showSearch
                onSearch={handleSearch}
                leftContent={CreateGroup}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subcontainer: {
        padding: config.getWidth(2),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(20),
    },
    searchIcon: {
        marginBottom: config.getHeight(1),
    },
    emptyText: {
        color: '#707070',
        textAlign: 'center',
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(2),
        marginTop: config.isWeb ? config.getWidth(0) : config.getWidth(-10)
    },
    footerLoader: {
        paddingVertical: config.getHeight(2)
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    createGrpButtonContainer: {
        borderWidth: 1,
        borderColor: commonColors.black,

    },
    createButtonText: {
        fontFamily: 'bold',

        color: commonColors.black,
        textAlign: 'center'
    },
});

export default UserSearchWeb;
