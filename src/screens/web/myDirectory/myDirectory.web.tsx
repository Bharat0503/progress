import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import config from '../../../utils/config';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import { GET_MY_LIBRARY_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { backgroundColors, commonColors } from '@/src/utils/colors';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import WebBaseLayout from '@/src/components/webBaseLayout';
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

const MyDirectoryWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [usersSearched, setUsersSearched] = useState<User[]>([]);

    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const PAGE_SIZE = 50;

    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    };

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
    };

    const getHeight = (height: number) => {
        return dimension.height * (height / 100);
    };

    const [getUserList] = useLazyQuery(GET_MY_LIBRARY_DATA, {
        fetchPolicy: 'network-only',

    });
    const [handleFollowAction] = useMutation(REQUEST_FOLLOW_ACTIONS);

    const processUsersData = (responseData: any, searcheduser: boolean, page: number) => {
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
    };

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
        if (hasMoreData && !isLoadingMore) {
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

    const MainContent = (
        <View style={[styles.subcontainer, { width: getWidth(60), height: getHeight(100) }]}>
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            ) : (

                <FlatList
                    data={searchQuery !== "" ? usersSearched : users}
                    keyExtractor={(item) => item.id}
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
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Email</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.email}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Mobile</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.mobile}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Speciality</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.speciality}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Space</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.space}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Practice</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.practice}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Subspeciality</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.subspeciality}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Country</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.country}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>Trainee Level</Text>
                                        <Text style={[styles.detailText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(13) }]}>{item.traineeLevel}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                    ListEmptyComponent={
                        <Text style={[styles.noResults, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(13), }]}>
                            {searchQuery ? '' : 'No users found'}
                        </Text>
                    }
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />

            )}
        </View>
    );

    const CreateGroup = (
        <TouchableOpacity
            style={styles.createGrpButtonContainer}
            onPress={() => navigationService.navigate(RouteNames.Groups)}
        >
            <Text style={[styles.createButtonText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(13) }]}>
                {'Create Group'}
            </Text>
        </TouchableOpacity>
    );



    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100), }}
        >
            <WebBaseLayout
                rightContent={MainContent}
                showSearch
                onSearch={onSearch}
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
        // flex: 1,
        padding: config.getWidth(1),
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
        paddingHorizontal: config.getWidth(4),
        paddingVertical: config.getHeight(0.4),
        borderRadius: config.getWidth(5),
        marginTop: config.getHeight(4),
    },
    createButtonText: {
        fontFamily: 'bold',

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

        color: commonColors.black,
        fontFamily: 'regular'
    },
    detailText: {
        flex: 0.7,

        color: commonColors.black,
        fontFamily: 'regular'
    },
    noResults: {
        textAlign: 'center',
        marginTop: config.getHeight(5),

        color: commonColors.black
    },
    errorText: {
        textAlign: 'center',
        fontSize: config.generateFontSizeNew(8),
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
    retryButton: {
        padding: config.getWidth(1),
        backgroundColor: backgroundColors.editProfile,
        borderRadius: config.getWidth(1),
        marginHorizontal: config.getWidth(20),
        marginVertical: config.getHeight(2)
    },
    retryText: {
        textAlign: 'center',
        fontFamily: 'regular',
        color: commonColors.white,
    },
});

export default MyDirectoryWeb;
