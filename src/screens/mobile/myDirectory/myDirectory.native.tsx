import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import config from '../../../utils/config';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import HeaderBack from '@/src/components/headerBack';
import { GET_MY_LIBRARY_DATA, GET_SEARCHED_USERS } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { commonColors, borderColors } from '@/src/utils/colors';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import alert from '@/src/utils/alert';
import { generateRandomId } from '@/src/components/GlobalConstant';

interface User {
    id: string;
    name: string;
    speciality: string;
    profileImage: string;
    isFollowing: boolean;
    email: string;
    mobile: string;
    space: string;
    practice: string;
    subspeciality: string;
    country: string;
    traineeLevel: string;
}

interface PaginationData {
    total_records: number;
    page: number;
    page_size: number;
}

const MyDirectory: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [usersSearched, setUsersSearched] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const PAGE_SIZE = 20;

    const [getUserList] = useLazyQuery(GET_MY_LIBRARY_DATA, {
        fetchPolicy: 'network-only',
    });
    const [handleFollowAction] = useMutation(REQUEST_FOLLOW_ACTIONS);

    const processUsersData = useCallback((responseData: any, searcheduser: boolean, page: number) => {
        const directories = responseData?.getMyLibraryData?.libraryData?.directories;
        const pagination = responseData?.getMyLibraryData?.libraryData?.directories?.pagination || {};

        if (directories?.data) {
            const newUsers: User[] = directories.data.map((user: any) => ({
                id: user?.id,
                name: user?.display_name || "Unknown",
                speciality: user?.speciality_info?.name ?? 'N/A',
                profileImage: user?.profile_image_path,
                isFollowing: user?.follow_status ?? false,
                email: user?.email ?? 'N/A',
                mobile: user?.phone ?? 'N/A',
                space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
                practice: user?.title_info?.name ?? 'N/A',
                subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
                country: user?.country_info?.name ?? 'N/A',
                traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
            }));
            // console.log('totalPagestotalPagestotalPages' + totalPages);

            searcheduser
                ?
                setUsersSearched(prevData =>
                    page === 1 ? newUsers : [...prevData, ...newUsers]
                )
                :
                setUsers(prevData =>
                    page === 1 ? newUsers : [...prevData, ...newUsers]
                )



            setHasMoreData(
                pagination?.total_records > page * PAGE_SIZE
            );
            setIsLoading(false)
        } else {
            setIsLoading(false)
            setHasMoreData(false);
        }
        setIsLoadingMore(false);
    }, []);


    useEffect(() => {

        const init = async () => {
            setIsLoading(true)
            const userData = await getUserList({
                variables: {
                    input: {
                        page: 1,
                        page_size: PAGE_SIZE
                    }
                }
            })

            processUsersData(userData?.data, false, 1)


        }


        init()
    }, [])

    const handleUserPress = (userId: string) => {
        setExpandedUserId(prevId => (prevId === userId ? null : userId));
    };

    const handleFollowPress = async (userId: string, isFollowing: boolean) => {
        try {
            setUsers(prevUsers =>
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
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, isFollowing: isFollowing } : user
                )
            );
            alert(error.message || 'An error occurred');
        }
    };

    const renderRightComponent = () => (
        <TouchableOpacity
            style={styles.createGrpButtonContainer}
            onPress={() => navigationService.navigate(RouteNames.Groups)}
        >
            <Text style={styles.createButtonText}>{'Create Group'}</Text>
        </TouchableOpacity>
    );

    // if ((loading && !isLoadingMore) || searchLoading) {
    //     return <ActivityIndicator  />;
    // }

    // if (error) {
    //     Alert.alert("Error", "Failed to load directory. Please try again.");
    //     return <Text style={styles.errorText}>Error loading data.</Text>;
    // }

    const onSearch = async (value: string) => {
        setPage(1)
        setIsLoading(true)
        setSearchQuery(value)
        const userData = await getUserList({
            variables: {
                input: {
                    page: 1,
                    page_size: PAGE_SIZE,
                    keyword: value
                }
            }
        })
        // console.error('onSearch', userData?.data);

        processUsersData(userData?.data, true, 1)
    }

    const renderFooter = () => {

        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );



    };

    const loadMoreData = async () => {
        if (hasMoreData) {
            setIsLoadingMore(true);

            const userData = await getUserList({
                variables: {
                    input: {
                        page: page + 1,
                        page_size: PAGE_SIZE,
                        // keyword: searchQuery ? searchQuery : ""
                    }
                }
            })


            processUsersData(userData?.data, searchQuery ? true : false, page + 1)
            setPage(page + 1)

        }
    };

    return (
        <View style={styles.container}>
            <HeaderBack
                title='My Directory'
                backgroundColor='#F8F8F8'
                rightComponent={renderRightComponent()}
            />

            <View style={styles.searchContainer}>
                <SearchBar onSearch={onSearch}
                    borderColor={borderColors.profileImage} />
            </View>

            <View style={styles.subcontainer}>
                {isLoading ?
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator />
                    </View>
                    :
                    <FlatList
                        data={searchQuery !== "" ? usersSearched : users}
                        keyExtractor={(item) => item.id + generateRandomId()}
                        renderItem={({ item }) => (
                            <>
                                <UserListItem
                                    id={item?.id}
                                    name={item?.name}
                                    profileImage={item?.profileImage}
                                    speciality={item?.speciality}
                                    buttonLabel={item?.isFollowing ? 'Unfollow' : 'Follow'}
                                    onPress={() => handleFollowPress(item?.id, item?.isFollowing)}
                                    folllowUnfollow
                                    isSelected={expandedUserId === item?.id}
                                    onItemPress={() => handleUserPress(item?.id)}
                                    paddingHor
                                />
                                {expandedUserId === item.id && (
                                    <View style={styles.detailsContainer}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Email</Text>
                                            <Text style={styles.detailText}>{item.email}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Mobile</Text>
                                            <Text style={styles.detailText}>{item.mobile}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Speciality</Text>
                                            <Text style={styles.detailText}>{item.speciality}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Space</Text>
                                            <Text style={styles.detailText}>{item.space}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Practice</Text>
                                            <Text style={styles.detailText}>{item.practice}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Subspeciality</Text>
                                            <Text style={styles.detailText}>{item.subspeciality}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Country</Text>
                                            <Text style={styles.detailText}>{item.country}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Trainee Level</Text>
                                            <Text style={styles.detailText}>{item.traineeLevel}</Text>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.noResults}>
                                {searchQuery ? 'No users found matching your search' : 'No users found'}
                            </Text>
                        }
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    // ListFooterComponent={LoadMoreButton}
                    />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    subcontainer: {
        flex: 1,
        backgroundColor: commonColors.white,
        padding: config.getWidth(1),
    },
    createGrpButtonContainer: {
        borderWidth: 1,
        borderColor: commonColors.black,
        paddingHorizontal: config.getWidth(4),
        paddingVertical: config.getHeight(0.4),
        borderRadius: config.getWidth(5)
    },
    createButtonText: {
        fontFamily: 'bold',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        textAlign: 'center'
    },
    detailsContainer: {
        padding: config.getWidth(5),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: config.getHeight(0.6)
    },
    detailLabel: {
        flex: 0.5,
        fontSize: config.generateFontSizeNew(12),
        color: commonColors.black,
        fontFamily: 'regular'
    },
    detailText: {
        flex: 0.7,
        fontSize: config.generateFontSizeNew(12),
        color: commonColors.black,
        fontFamily: 'regular'
    },
    noResults: {
        textAlign: 'center',
        marginTop: config.getHeight(5),
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black
    },
    errorText: {
        textAlign: 'center',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.red,
        marginTop: config.getHeight(20),
    },
    loader: {
        flex: 1,
        justifyContent: 'center'
    },
    footerLoader: {
        paddingVertical: config.getHeight(2)
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(3),
        marginTop: Platform.OS === 'ios' ? config.getWidth(-4) : config.getWidth(0),
        backgroundColor: commonColors.white
    },
    loadMoreButton: {
        //backgroundColor: '#AD63A8',
        borderWidth: 1,
        borderColor: commonColors.black,
        padding: config.getWidth(2),
        borderRadius: config.getWidth(2),
        marginVertical: config.getHeight(2),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: config.getWidth(30),
    },
    loadMoreText: {
        color: commonColors.black,
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'regular',
    },
});

export default MyDirectory;