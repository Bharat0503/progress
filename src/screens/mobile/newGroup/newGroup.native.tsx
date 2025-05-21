import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import HeaderBack from '@/src/components/headerBack';
import { GET_MY_LIBRARY_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { backgroundColors, borderColors, commonColors, textColors } from '@/src/utils/colors';
import * as ImagePicker from 'expo-image-picker';
import { CREATE_DIRECTORY_GROUP } from '@/src/services/MutationMethod';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { CommonActions } from '@react-navigation/native';

interface User {
    id: string;
    name: string;
    speciality: string;
    profileImage: string;
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

interface CreateGroupInput {
    group_name: string;
    user_ids: string[];
}

interface CreateGroupResponse {
    createDirectoryGroup: {
        success: boolean;
        message: string;
    };
}

const NewGroup: React.FC = () => {
    const [groupName, setGroupName] = useState('');
    const [profileImage, setProfileImage] = useState<any>();
    const [imageLoading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total_records: 0,
        page: 1,
        page_size: 10
    });
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [getUsers, { loading, error }] = useLazyQuery(GET_MY_LIBRARY_DATA, {
        fetchPolicy: 'network-only'
    });
    const [createGroup, { loading: createGroupLoading }] = useMutation<
        CreateGroupResponse,
        { input: CreateGroupInput }
    >(CREATE_DIRECTORY_GROUP);

    const processUsersData = (responseData: any) => {
        const directories = responseData?.getMyLibraryData?.libraryData?.directories;
        if (directories?.data) {
            const processedUsers: User[] = directories.data.map((user: any) => ({
                id: user?.id,
                name: user?.display_name || "Unknown",
                speciality: user?.speciality_info?.name ?? 'N/A',
                profileImage: user?.profile_image_path,
                email: user?.email ?? 'N/A',
                mobile: user?.phone ?? 'N/A',
                space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
                practice: user?.title_info?.name ?? 'N/A',
                subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
                country: user?.country_info?.name ?? 'N/A',
                traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
            }));
            if (pagination.page === 1) {
                setUsers(processedUsers);
            } else {
                setUsers(prev => [...prev, ...processedUsers]);
            }

            if (directories.pagination) {
                setPagination(directories.pagination);
            }
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                getUsers({
                    variables: {
                        input: {
                            keyword: searchQuery,
                            page: 1,
                            page_size: pagination.page_size
                        }
                    }
                }).then(({ data }) => {
                    if (data) {
                        processUsersData(data);
                        setPagination(prev => ({ ...prev, page: 1 }));
                    }
                });
            } else {
                loadUsers();
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const loadUsers = async () => {
        try {
            const { data } = await getUsers({
                variables: {
                    input: {
                        page: pagination.page,
                        page_size: pagination.page_size
                    }
                }
            });
            if (data) {
                processUsersData(data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load users');
        }
    };

    // const handleLoadMore = async () => {
    //     if (!isLoadingMore || users.length >= pagination.total_records) {
    //         setIsLoadingMore(false);
    //         return;
    //     }

    //     setIsLoadingMore(true);

    //     try {
    //         const { data } = await getUsers({
    //             variables: {
    //                 input: {
    //                     page: pagination.page + 1,
    //                     page_size: pagination.page_size,
    //                     ...(searchQuery ? { keyword: searchQuery } : {})
    //                 }
    //             }
    //         });

    //         const directories = data?.getMyLibraryData?.libraryData?.directories;
    //         const newUsers = directories?.data || [];

    //         if (newUsers.length > 0) {
    //             const processedNewUsers = newUsers.map((user: any) => ({
    //                 id: user?.id,
    //                 name: user?.display_name || "Unknown",
    //                 speciality: user?.speciality_info?.name ?? 'N/A',
    //                 profileImage: user?.profile_image_path,
    //                 email: user?.email ?? 'N/A',
    //                 mobile: user?.phone ?? 'N/A',
    //                 space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
    //                 practice: user?.title_info?.name ?? 'N/A',
    //                 subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
    //                 country: user?.country_info?.name ?? 'N/A',
    //                 traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
    //             }));

    //             setUsers(prev => [...prev, ...processedNewUsers]);
    //             setPagination(prev => ({
    //                 ...prev,
    //                 page: prev.page + 1
    //             }));
    //         } else {
    //             setIsLoadingMore(false);
    //         }
    //     } catch (error) {
    //         console.error("Error loading more users:", error);
    //         setIsLoadingMore(false);
    //     }
    // };


    const handleLoadMore = async () => {
        if (isLoadingMore || users.length >= pagination.total_records) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const { data } = await getUsers({
                variables: {
                    input: {
                        page: pagination.page + 1,
                        page_size: pagination.page_size,
                        ...(searchQuery ? { keyword: searchQuery } : {})
                    }
                }
            });

            if (data) {
                const directories = data?.getMyLibraryData?.libraryData?.directories;
                const newUsers = directories?.data || [];

                if (newUsers.length > 0) {
                    const processedNewUsers = newUsers.map((user: any) => ({
                        id: user?.id,
                        name: user?.display_name || "Unknown",
                        speciality: user?.speciality_info?.name ?? 'N/A',
                        profileImage: user?.profile_image_path,
                        email: user?.email ?? 'N/A',
                        mobile: user?.phone ?? 'N/A',
                        space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
                        practice: user?.title_info?.name ?? 'N/A',
                        subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
                        country: user?.country_info?.name ?? 'N/A',
                        traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
                    }));

                    setUsers((prev) => [...prev, ...processedNewUsers]);
                    setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1
                    }));
                }
            }
        } catch (error) {
            console.error("Error loading more users:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };




    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleLoadStart = () => setLoading(true);
    const handleLoadEnd = () => setLoading(false);

    const toggleUserSelection = (id: string) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    const handleCancel = () => {
        navigationService.goBack();
    };

    const validateForm = (): boolean => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return false;
        }
        if (selectedUsers.length === 0) {
            Alert.alert('Error', 'Please select at least one member for the group');
            return false;
        }
        return true;
    };

    const handleCreateGroup = async () => {
        if (!validateForm()) return;

        try {
            setIsCreatingGroup(true);

            const { data } = await createGroup({
                variables: {
                    input: {
                        group_name: groupName.trim(),
                        user_ids: selectedUsers
                    }
                }
            });

            if (data?.createDirectoryGroup.success) {
                Alert.alert(
                    'Success',
                    'Group created successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigationService.reset([
                                    {
                                        name: RouteNames.Home,
                                        params: {}
                                    },
                                    {
                                        name: RouteNames.Groups,
                                        params: {}
                                    }
                                ]);
                            }
                        }
                    ]
                );
            } else {
                throw new Error(data?.createDirectoryGroup.message || 'Failed to create group');
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.message || 'Something went wrong while creating the group'
            );
        } finally {
            setIsCreatingGroup(false);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={commonColors.black} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <HeaderBack title='New Group' backgroundColor='#F8F8F8' />
            <View style={styles.subcontainer}>
                {(loading && !isLoadingMore) && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator />
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={{ width: config.getWidth(20) }}
                        onPress={() => console.log('ImagePicker clicked')}
                    >
                        {profileImage ? (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {imageLoading && (
                                    <ActivityIndicator size='small' style={{ position: 'absolute' }} />
                                )}
                                <Image
                                    style={styles.groupIcon}
                                    source={{ uri: profileImage }}
                                    resizeMode='contain'
                                    onLoadStart={handleLoadStart}
                                    onLoadEnd={handleLoadEnd}
                                />
                            </View>
                        ) : (
                            <Image
                                style={styles.groupIcon}
                                source={Icons.createGroup}
                                resizeMode='contain'
                            />
                        )}
                    </TouchableOpacity>
                    <TextInput
                        allowFontScaling={false}
                        style={styles.input}
                        placeholder="Group Name"
                        placeholderTextColor={textColors.search}
                        value={groupName}
                        onChangeText={setGroupName}
                    />
                </View>

                <View style={styles.searchContainer}>
                    <SearchBar onSearch={setSearchQuery}
                        borderColor={borderColors.profileImage} />
                </View>
                <Text style={styles.membersText}>Added Members: {selectedUsers.length}</Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => toggleUserSelection(item.id)}
                            style={styles.userItem}
                        >
                            <View style={styles.userInfo}>
                                <Image
                                    source={item.profileImage ? { uri: item.profileImage } : Icons.userProfile}
                                    resizeMode="cover"
                                    style={styles.userImage}
                                />
                                <View>
                                    <Text style={styles.userName}>{item.name ?? "Unknown Name"}</Text>
                                    <Text style={styles.userSpeciality}>{item.speciality ?? "No Speciality"}</Text>
                                </View>
                            </View>
                            {selectedUsers.includes(item.id) ? (
                                <Image
                                    source={Icons.checkMark}
                                    resizeMode="contain"
                                    style={styles.tickIcon}
                                />
                            ) : (
                                <Image
                                    source={Icons.unCheckMark}
                                    resizeMode="contain"
                                    style={styles.tickIcon}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        <Text style={styles.noResults}>
                            {searchQuery ? 'No users found matching your search' : loading ? '' : 'No users found'}
                        </Text>
                    }
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!selectedUsers.length || !groupName.trim() || isCreatingGroup) &&
                            styles.disabledButton
                        ]}
                        onPress={handleCreateGroup}
                        disabled={!selectedUsers.length || !groupName.trim() || isCreatingGroup}
                    >
                        {isCreatingGroup ? (
                            <ActivityIndicator size="small" color={commonColors.black} />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: borderColors.commentTextInput,
        padding: config.getHeight(3),
        marginBottom: config.getHeight(2),
    },
    groupIcon: {
        width: config.getWidth(20),
        height: config.getWidth(20),
        borderRadius: config.getWidth(10),
        borderWidth: 1,
        borderColor: borderColors.profileImage
    },
    input: {
        flex: 0.8,
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'regular',
        color: commonColors.black,
        borderBottomWidth: 1,
        borderBottomColor: borderColors.profileImage,
        marginLeft: config.getWidth(4),
    },
    membersText: {
        fontSize: config.generateFontSizeNew(18),
        fontFamily: 'regular',
        color: commonColors.black,
        paddingHorizontal: config.getWidth(5),
        marginTop: config.getHeight(2)
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: config.getHeight(0.5),
        paddingHorizontal: config.getWidth(1),
        paddingRight: config.getWidth(4),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: config.getWidth(12),
        height: config.getHeight(6),
        borderRadius: config.getWidth(10),
        marginRight: config.getWidth(5),
        borderColor: borderColors.profileImage,
        borderWidth: 1.5
    },
    tickIcon: {
        width: config.getWidth(5),
        height: config.getWidth(5),
        borderRadius: config.getWidth(2.5),
    },
    userName: {
        fontSize: config.generateFontSizeNew(16),
        fontFamily: 'regular',
        color: '#000000',
    },
    userSpeciality: {
        fontSize: config.generateFontSizeNew(10),
        fontFamily: 'regular',
        color: '#000000',
        marginTop: 2
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: config.getWidth(4),
        right: config.getWidth(4),
        backgroundColor: commonColors.white,
        paddingVertical: config.getHeight(0.5),
        paddingBottom: config.getHeight(2),

    },
    cancelButton: {
        flex: 0.4,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        paddingVertical: config.getHeight(1.5),
        alignItems: 'center',
        borderRadius: config.getWidth(4),
    },
    saveButton: {
        flex: 0.4,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        paddingVertical: config.getHeight(1.5),
        alignItems: 'center',
        borderRadius: config.getWidth(4),
        backgroundColor: commonColors.white,
        minHeight: config.getHeight(5),
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#d3d3d3',
    },
    cancelText: {
        color: commonColors.black,
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'bold',
    },
    saveText: {
        color: commonColors.black,
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center'
    },
    footerLoader: {
        paddingVertical: config.getHeight(2)
    },
    noResults: {
        textAlign: 'center',
        marginTop: config.getHeight(5),
        fontSize: config.generateFontSizeNew(16),
        color: commonColors.black
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    searchContainer: {
        paddingHorizontal: config.getWidth(3),
        marginTop: config.getWidth(-4)
    },
});

export default NewGroup;
