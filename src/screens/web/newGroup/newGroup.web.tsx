// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
// import config from '../../../utils/config';
// import Icons from '../../../assets/icons/index';
// import { SearchBar } from '@/src/components/searchbar';
// import HeaderBack from '@/src/components/headerBack';
// import { GET_MY_LIBRARY_DATA } from '@/src/services/QueryMethod';
// import { useLazyQuery, useMutation } from '@apollo/client';
// import { backgroundColors, borderColors, commonColors, textColors } from '@/src/utils/colors';
// import * as ImagePicker from 'expo-image-picker';
// import { CREATE_DIRECTORY_GROUP } from '@/src/services/MutationMethod';
// import navigationService from '@/src/navigation/navigationService';
// import RouteNames from '@/src/navigation/routes';
// import { CommonActions } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import useFetchDimention from '@/src/customHooks/customDimentionHook';
// import WebBaseLayout from '@/src/components/webBaseLayout';
// import alert from '@/src/utils/alert';

// interface User {
//     id: string;
//     name: string;
//     speciality: string;
//     profileImage: string;
//     email: string;
//     mobile: string;
//     space: string;
//     practice: string;
//     subspeciality: string;
//     country: string;
//     traineeLevel: string;
// }

// interface PaginationData {
//     total_records: number;
//     page: number;
//     page_size: number;
// }

// interface CreateGroupInput {
//     group_name: string;
//     user_ids: string[];
// }

// interface CreateGroupResponse {
//     createDirectoryGroup: {
//         success: boolean;
//         message: string;
//     };
// }

// const NewGroupWeb: React.FC = () => {
//     const dimension = useSelector((state: any) => state.reducer.dimentions);
//     useFetchDimention();
//     const [groupName, setGroupName] = useState('');
//     const [profileImage, setProfileImage] = useState<any>();
//     const [imageLoading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//     const [users, setUsers] = useState<User[]>([]);
//     const [pagination, setPagination] = useState<PaginationData>({
//         total_records: 0,
//         page: 1,
//         page_size: 10
//     });
//     const [isLoadingMore, setIsLoadingMore] = useState(false);
//     const [isCreatingGroup, setIsCreatingGroup] = useState(false);
//     const [getUsers, { loading, error }] = useLazyQuery(GET_MY_LIBRARY_DATA, {
//         fetchPolicy: 'network-only'
//     });
//     const [createGroup, { loading: createGroupLoading }] = useMutation<
//         CreateGroupResponse,
//         { input: CreateGroupInput }
//     >(CREATE_DIRECTORY_GROUP);

//     const getFontSize = (size: number) => {
//         return (dimension.width / 320) * size
//     }

//     const getWidth = (width: number) => {
//         return dimension.width * (width / 100)
//     }

//     const getHeight = (height: number) => {
//         return dimension.height * (height / 100)
//     }

//     const processUsersData = (responseData: any) => {
//         const directories = responseData?.getMyLibraryData?.libraryData?.directories;
//         if (directories?.data) {
//             const processedUsers: User[] = directories.data.map((user: any) => ({
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
//             if (pagination.page === 1) {
//                 setUsers(processedUsers);
//             } else {
//                 setUsers(prev => [...prev, ...processedUsers]);
//             }

//             if (directories.pagination) {
//                 setPagination(directories.pagination);
//             }
//         }
//     };

//     useEffect(() => {
//         loadUsers();
//     }, []);

//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             if (searchQuery) {
//                 getUsers({
//                     variables: {
//                         input: {
//                             keyword: searchQuery,
//                             page: 1,
//                             page_size: pagination.page_size
//                         }
//                     }
//                 }).then(({ data }) => {
//                     if (data) {
//                         processUsersData(data);
//                         setPagination(prev => ({ ...prev, page: 1 }));
//                     }
//                 });
//             } else {
//                 loadUsers();
//             }
//         }, 100);

//         return () => clearTimeout(timeoutId);
//     }, [searchQuery]);

//     const loadUsers = async () => {
//         try {
//             const { data } = await getUsers({
//                 variables: {
//                     input: {
//                         page: pagination.page,
//                         page_size: pagination.page_size
//                     }
//                 }
//             });
//             if (data) {
//                 processUsersData(data);
//             }
//         } catch (error) {
//             alert('Error', 'Failed to load users');
//         }
//     };

//     const handleLoadMore = async () => {
//         if (isLoadingMore || users.length >= pagination.total_records) {

//             return;
//         }

//         setIsLoadingMore(true);

//         try {
//             const { data } = await getUsers({
//                 variables: {
//                     input: {
//                         page: pagination.page + 1,
//                         page_size: pagination.page_size,
//                         ...(searchQuery ? { keyword: searchQuery } : {})
//                     }
//                 }
//             });

//             if (data) {
//                 const directories = data?.getMyLibraryData?.libraryData?.directories;
//                 const newUsers = directories?.data || [];

//                 if (newUsers.length > 0) {
//                     const processedNewUsers = newUsers.map((user: any) => ({
//                         id: user?.id,
//                         name: user?.display_name || "Unknown",
//                         speciality: user?.speciality_info?.name ?? 'N/A',
//                         profileImage: user?.profile_image_path,
//                         email: user?.email ?? 'N/A',
//                         mobile: user?.phone ?? 'N/A',
//                         space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
//                         practice: user?.title_info?.name ?? 'N/A',
//                         subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
//                         country: user?.country_info?.name ?? 'N/A',
//                         traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
//                     }));

//                     setUsers((prev) => [...prev, ...processedNewUsers]);
//                     setPagination((prev) => ({
//                         ...prev,
//                         page: prev.page + 1
//                     }));
//                 }
//             }
//         } catch (error) {
//             console.error("Error loading more users:", error);
//         } finally {
//             setIsLoadingMore(false);
//         }
//     };


//     const pickImage = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });
//         if (!result.canceled) {
//             setProfileImage(result.assets[0].uri);
//         }
//     };

//     const handleLoadStart = () => setLoading(true);
//     const handleLoadEnd = () => setLoading(false);

//     const toggleUserSelection = (id: string) => {
//         setSelectedUsers(prev =>
//             prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
//         );
//     };

//     const handleCancel = () => {
//         navigationService.goBack();
//     };

//     const validateForm = (): boolean => {
//         if (!groupName.trim()) {
//             alert('Error', 'Please enter a group name');
//             return false;
//         }
//         if (selectedUsers.length === 0) {
//             alert('Error', 'Please select at least one member for the group');
//             return false;
//         }
//         return true;
//     };

//     const handleCreateGroup = async () => {
//         if (!validateForm()) return;

//         try {
//             setIsCreatingGroup(true);

//             const { data } = await createGroup({
//                 variables: {
//                     input: {
//                         group_name: groupName.trim(),
//                         user_ids: selectedUsers
//                     }
//                 }
//             });

//             if (data?.createDirectoryGroup.success) {
//                 alert(
//                     'Success',
//                     'Group created successfully',
//                     [
//                         {
//                             text: 'OK',
//                             onPress: () => {
//                                 navigationService.reset([
//                                     {
//                                         name: RouteNames.Home,
//                                         params: {}
//                                     },
//                                     {
//                                         name: RouteNames.Groups,
//                                         params: {}
//                                     }
//                                 ]);
//                             }
//                         }
//                     ]
//                 );
//             } else {
//                 throw new Error(data?.createDirectoryGroup.message || 'Failed to create group');
//             }
//         } catch (error: any) {
//             alert(
//                 'Error',
//                 error.message || 'Something went wrong while creating the group'
//             );
//         } finally {
//             setIsCreatingGroup(false);
//         }
//     };

//     const renderFooter = () => {
//         if (!isLoadingMore || users.length >= pagination.total_records) {
//             return null;
//         }
//         return (
//             <View style={styles.footerLoader}>
//                 <ActivityIndicator size="small" color={commonColors.black} />
//             </View>
//         );
//     };

//     // if (loading && !isLoadingMore) {
//     //     return <ActivityIndicator size="large" color={commonColors.black} style={styles.loader} />;
//     // }

//     const MainContent = (

//         <View style={[styles.subcontainer, { width: getWidth(60), }]}>
//               {(loading && !isLoadingMore) && (
//                     <View style={styles.loadingOverlay}>
//                         <ActivityIndicator />
//                     </View>
//                 )}
//             <View style={styles.inputContainer}>
//                 <TouchableOpacity style={{ width: getWidth(10) }}
//                     // onPress={pickImage}
//                     onPress={() => console.log('ImagePicker clicked')}
//                 >
//                     {profileImage ? (
//                         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                             {imageLoading && (
//                                 <ActivityIndicator size='small' style={{ position: 'absolute' }} />
//                             )}
//                             <Image
//                                 style={[styles.groupIcon, {
//                                     width: config.getWidth(10),
//                                     height: config.getWidth(10),
//                                 }]}
//                                 source={{ uri: profileImage }}
//                                 resizeMode='cover'
//                                 onLoadStart={handleLoadStart}
//                                 onLoadEnd={handleLoadEnd}
//                             />
//                         </View>
//                     ) : (
//                         <Image style={[styles.groupIcon, {
//                             width: config.getWidth(10),
//                             height: config.getWidth(10),
//                         }]} source={Icons.createGroup} resizeMode='center' />
//                     )}
//                 </TouchableOpacity>
//                 <TextInput
//                     allowFontScaling={false}
//                     style={[styles.input, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}
//                     placeholder="Group Name"
//                     placeholderTextColor={textColors.search}
//                     value={groupName}
//                     onChangeText={setGroupName}
//                 />
//             </View>
//             {/* <SearchBar onSearch={setSearchQuery} borderColor={borderColors.profileImage} /> */}
//             <Text style={[styles.membersText, { fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(18), }]}>Added Members: {selectedUsers.length}</Text>
//             <FlatList
//                 data={users}
//                 keyExtractor={(item) => item.id}
//                 contentContainerStyle={styles.listContainer}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({ item }) => {
//                     return (
//                         <TouchableOpacity onPress={() => toggleUserSelection(item.id)} style={[styles.userItem,{width: getWidth(40),}]}>
//                             <View style={styles.userInfo}>
//                                 <Image
//                                     source={item.profileImage ? { uri: item.profileImage } : Icons.userProfile}
//                                     resizeMode="cover"
//                                     style={[styles.userImage, {
//                                         width: config.isWeb ? getWidth(3) : config.getWidth(12),
//                                         height: config.isWeb ? getWidth(3) : config.getHeight(6),
//                                     }]}
//                                 />
//                                 <View>
//                                     <Text style={[styles.userName, { fontSize: config.isWeb ? getWidth(1.2) : config.generateFontSizeNew(16), }]}>{item.name ?? "Unknown Name"}</Text>
//                                     <Text style={[styles.userSpeciality, { fontSize: config.isWeb ? getWidth(0.8) : config.generateFontSizeNew(11), }]}>{item.speciality ?? "No Speciality"}</Text>
//                                 </View>
//                             </View>
//                             {selectedUsers.includes(item.id) ? (
//                                 <Image source={Icons.checkMark} resizeMode="contain" style={[styles.tickIcon, {
//                                     width: config.isWeb ? getWidth(2) : config.getWidth(5),
//                                     height: config.isWeb ? getWidth(2) : config.getWidth(5),
//                                 }]} />
//                             ) : (
//                                 <Image source={Icons.unCheckMark} resizeMode="contain" style={[styles.tickIcon, {
//                                     width: config.isWeb ? getWidth(2) : config.getWidth(5),
//                                     height: config.isWeb ? getWidth(2) : config.getWidth(5),
//                                 }]} />
//                             )}
//                         </TouchableOpacity>
//                     );
//                 }}
//                 onEndReached={handleLoadMore}
//                 onEndReachedThreshold={0.5}
//                 ListFooterComponent={renderFooter}
//                 ListEmptyComponent={
//                     <Text style={[styles.noResults,{fontSize: config.isWeb ? getWidth(1.5) : config.generateFontSizeNew(13),}]}>
//                         {searchQuery ? 'No users found matching your search' : 'No users found'}
//                     </Text>
//                 }
//             />
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
//                     <Text style={[styles.cancelText,{fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),}]}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[
//                         styles.saveButton,
//                         (!selectedUsers.length || !groupName.trim() || isCreatingGroup) &&
//                         styles.disabledButton
//                     ]}
//                     onPress={handleCreateGroup}
//                     disabled={!selectedUsers.length || !groupName.trim() || isCreatingGroup}
//                 >
//                     {isCreatingGroup ? (
//                         <ActivityIndicator size="small" color={commonColors.black} />
//                     ) : (
//                         <Text style={[styles.saveText,{fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),}]}>Save</Text>
//                     )}
//                 </TouchableOpacity>
//             </View>
//             {isCreatingGroup && (
//                 <View style={styles.loadingOverlay}>
//                     <ActivityIndicator size="large" color={commonColors.black} />
//                 </View>
//             )}
//         </View>
//     );

//     return (

//         <ScrollView onScroll={({ nativeEvent }) => {
//             const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
//             if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
//               handleLoadMore();
//             }
//           }}
//           scrollEventThrottle={400}
//         contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: config.getHeight(100) }}>
//             <WebBaseLayout rightContent={MainContent} showSearch onSearch={setSearchQuery} />
//         </ScrollView>


//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     subcontainer: {
//         flex: 1,
//         backgroundColor: commonColors.white,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: borderColors.commentTextInput,
//         padding: config.getHeight(3),
//         marginBottom: config.getHeight(2),
//     },
//     groupIcon: {
//         borderRadius: config.getWidth(12.5),
//         borderWidth: 1,
//         borderColor: borderColors.profileImage
//     },
//     input: {
//         flex: 0.8,
//         padding: config.getHeight(3),
//         fontFamily: 'regular',
//         color: commonColors.black,
//         borderBottomWidth: 1,
//         borderBottomColor: borderColors.profileImage,
//         marginLeft: config.getWidth(4),
//     },
//     membersText: {
//         fontFamily: 'regular',
//         color: commonColors.black,
//         paddingHorizontal: config.getWidth(5),
//     },
//     listContainer: {
//         padding: 16,
//         paddingBottom: 100,
//     },
//     userItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: config.getHeight(0.5),
//         paddingHorizontal: config.getWidth(1),
//         alignSelf: 'center'
//         //paddingRight: config.getWidth(4),
//     },
//     userInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     userImage: {
//         borderRadius: config.getWidth(10),
//         marginRight: config.getWidth(5),
//         borderColor: borderColors.profileImage,
//         borderWidth: 1.5
//     },
//     tickIcon: {
//         borderRadius: config.getWidth(2.5),
//     },
//     userName: {
//         fontFamily: 'regular',
//         color: '#000000',
//     },
//     userSpeciality: {

//         fontFamily: 'regular',
//         color: '#000000',
//         marginTop: 2
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         position: 'absolute',
//         bottom: 0,
//         left: config.getWidth(4),
//         right: config.getWidth(4),
//         backgroundColor: commonColors.white,
//         paddingVertical: config.getHeight(0.5),
//         paddingBottom: config.getHeight(2),
//     },
//     cancelButton: {
//         flex: 0.45,
//         borderWidth: 1,
//         borderColor: borderColors.profileImage,
//         paddingVertical: config.getHeight(1.5),
//         alignItems: 'center',
//         borderRadius: config.getWidth(4),
//     },
//     saveButton: {
//         flex: 0.45,
//         borderWidth: 1,
//         borderColor: borderColors.profileImage,
//         paddingVertical: config.getHeight(1.5),
//         alignItems: 'center',
//         borderRadius: config.getWidth(4),
//         backgroundColor: commonColors.white,
//         minHeight: config.getHeight(5),
//         justifyContent: 'center',
//     },
//     disabledButton: {
//         opacity: 0.5,
//         backgroundColor: '#d3d3d3',
//     },
//     cancelText: {
//         color: commonColors.black,
//     },
//     saveText: {
//         color: commonColors.black,
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center'
//     },
//     footerLoader: {
//         paddingVertical: config.getHeight(2)
//     },
//     noResults: {
//         textAlign: 'center',
//         marginTop: config.getHeight(5),
//         color: commonColors.black
//     },
//     loadingOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1000,
//     },
// });

// export default NewGroupWeb;






























import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
import { useSelector } from 'react-redux';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import WebBaseLayout from '@/src/components/webBaseLayout';
import alert from '@/src/utils/alert';
import { generateRandomId } from '@/src/components/GlobalConstant';

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

const NewGroupWeb: React.FC = () => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();

    const [groupName, setGroupName] = useState('');
    const [profileImage, setProfileImage] = useState<any>();
    const [imageLoading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [usersSearched, setUsersSearched] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const PAGE_SIZE = 10;

    const [getUsers] = useLazyQuery(GET_MY_LIBRARY_DATA, {
        fetchPolicy: 'network-only'
    });

    const [createGroup, { loading: createGroupLoading }] = useMutation(CREATE_DIRECTORY_GROUP);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    };

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
    };

    const getHeight = (height: number) => {
        return dimension.height * (height / 100);
    };

    // const processUsersData = (responseData: any, searchedUser: boolean, currentPage: number) => {
    //     const directories = responseData?.getMyLibraryData?.libraryData?.directories;
    //     const pagination = responseData?.getMyLibraryData?.libraryData?.directories?.pagination || {};

    //     if (directories?.data) {
    //         const newUsers: User[] = directories.data.map((user: any) => ({
    //             id: user?.id,
    //             name: user?.display_name || "Unknown",
    //             speciality: user?.speciality_info?.name ?? 'N/A',
    //             profileImage: user?.profile_image_path,
    //             email: user?.email ?? 'N/A',
    //             mobile: user?.phone ?? 'N/A',
    //             space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
    //             practice: user?.title_info?.name ?? 'N/A',
    //             subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
    //             country: user?.country_info?.name ?? 'N/A',
    //             traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
    //         }));

    //         if (searchedUser) {
    //             setUsersSearched(prevData =>
    //                 currentPage === 1 ? newUsers : [...prevData ]
    //             );
    //         } else {
    //             setUsers(prevData =>
    //                 currentPage === 1 ? newUsers : [...prevData, ...newUsers]
    //             );
    //         }

    //         setHasMoreData(pagination?.total_records > currentPage * PAGE_SIZE);
    //         setIsLoading(false);
    //     } else {
    //         setIsLoading(false);
    //         setHasMoreData(false);
    //     }
    //     setIsLoadingMore(false);
    // };


    // const processUsersData = (responseData: any, isSearchResult: boolean, currentPage: number) => {
    //     const directories = responseData?.getMyLibraryData?.libraryData?.directories;
    //     const pagination = responseData?.getMyLibraryData?.libraryData?.directories?.pagination || {};

    //     if (directories?.data) {
    //         const newUsers: User[] = directories.data.map((user: any) => ({
    //             id: user?.id,
    //             name: user?.display_name || "Unknown",
    //             speciality: user?.speciality_info?.name ?? 'N/A',
    //             profileImage: user?.profile_image_path,
    //             email: user?.email ?? 'N/A',
    //             mobile: user?.phone ?? 'N/A',
    //             space: user?.subscribed_spaces?.map((space: any) => space.name).join(', ') ?? 'N/A',
    //             practice: user?.title_info?.name ?? 'N/A',
    //             subspeciality: user?.sub_speciality_info?.name ?? 'N/A',
    //             country: user?.country_info?.name ?? 'N/A',
    //             traineeLevel: user?.trainee_level_info?.name ?? 'N/A',
    //         }));

    //         if (isSearchResult) {
    //             setUsersSearched(prevData =>
    //                 currentPage === 1 ? newUsers : [...prevData, ...newUsers]
    //             );
    //             setUsers([]);
    //         } else {
    //             setUsers(prevData =>
    //                 currentPage === 1 ? newUsers : [...prevData, ...newUsers]
    //             );
    //             setUsersSearched([]);
    //         }

    //         setHasMoreData(pagination?.total_records > currentPage * PAGE_SIZE);
    //     }

    //     setIsLoading(false);
    //     setIsLoadingMore(false);
    // };


    const processUsersData = (responseData: any, isSearchResult: boolean, currentPage: number) => {
        const directories = responseData?.getMyLibraryData?.libraryData?.directories;
        const pagination = responseData?.getMyLibraryData?.libraryData?.directories?.pagination || {};

        if (directories?.data) {
            const newUsers: User[] = directories.data.map((user: any) => ({
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

            if (isSearchResult) {
                setUsersSearched(prevData =>
                    currentPage === 1 ? newUsers : [...prevData, ...newUsers]
                );
                setUsers([]);
            } else {
                setUsers(prevData =>
                    currentPage === 1 ? newUsers : [...prevData, ...newUsers]
                );
                setUsersSearched([]);
            }

            // Check if we have more data by comparing total records with current data length
            const currentDataLength = isSearchResult ?
                (currentPage === 1 ? newUsers.length : usersSearched.length + newUsers.length) :
                (currentPage === 1 ? newUsers.length : users.length + newUsers.length);

            setHasMoreData(pagination?.total_records > currentDataLength);
        } else {
            // If no data received, set hasMoreData to false
            setHasMoreData(false);
        }

        setIsLoading(false);
        setIsLoadingMore(false);
    };

    useEffect(() => {
        const init = async () => {
            if (!searchQuery) {
                setIsLoading(true);
                const userData = await getUsers({
                    variables: {
                        input: {
                            page: 1,
                            page_size: PAGE_SIZE
                        }
                    }
                });
                processUsersData(userData?.data, false, 1);
            }
        };
        init();
    }, []);

    const onSearch = async (value: string) => {
        setPage(1);
        setIsLoading(true);
        setSearchQuery(value);

        // Clear the main users list when searching
        if (value) {
            setUsers([]);
        }

        const userData = await getUsers({
            variables: {
                input: {
                    page: 1,
                    page_size: PAGE_SIZE,
                    keyword: value
                }
            }
        });
        //console.log('Searched Users-->', userData?.data);
        processUsersData(userData?.data, Boolean(value), 1);
    };

    // const loadMoreData = async () => {
    //     if (hasMoreData) {
    //         setIsLoadingMore(true);
    //         const userData = await getUsers({
    //             variables: {
    //                 input: {
    //                     page: page + 1,
    //                     page_size: PAGE_SIZE,
    //                     ...(searchQuery ? { keyword: searchQuery } : {})
    //                 }
    //             }
    //         });
    //         processUsersData(userData?.data, Boolean(searchQuery), page + 1);
    //         setPage(page + 1);
    //     }
    // };


    const loadMoreData = async () => {
        if (hasMoreData && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            const userData = await getUsers({
                variables: {
                    input: {
                        page: page + 1,
                        page_size: PAGE_SIZE,
                        ...(searchQuery ? { keyword: searchQuery } : {})
                    }
                }
            });
            processUsersData(userData?.data, Boolean(searchQuery), page + 1);
            setPage(page + 1);
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
            alert('Error', 'Please enter a group name');
            return false;
        }
        if (selectedUsers.length === 0) {
            alert('Error', 'Please select at least one member for the group');
            return false;
        }
        return true;
    };

    const handleCreateGroup = async () => {
        if (!validateForm()) return;

        try {
            const { data } = await createGroup({
                variables: {
                    input: {
                        group_name: groupName.trim(),
                        user_ids: selectedUsers
                    }
                }
            });

            if (data?.createDirectoryGroup.success) {
                alert(
                    'Success',
                    'Group created successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigationService.reset([
                                    { name: RouteNames.Home, params: {} },
                                    { name: RouteNames.Groups, params: {} }
                                ]);
                            }
                        }
                    ]
                );
            } else {
                throw new Error(data?.createDirectoryGroup.message || 'Failed to create group');
            }
        } catch (error: any) {
            alert(
                'Error',
                error.message || 'Something went wrong while creating the group'
            );
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

    const MainContent = (
        <View style={[styles.subcontainer, { width: getWidth(60) }]}>
            {(isLoading) && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>
            )}
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={{ width: getWidth(10) }}
                    onPress={pickImage}
                >
                    {profileImage ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {imageLoading && (
                                <ActivityIndicator size='small' style={{ position: 'absolute' }} />
                            )}
                            <Image
                                style={[styles.groupIcon, {
                                    width: getWidth(10),
                                    height: getWidth(10),
                                }]}
                                source={{ uri: profileImage }}
                                resizeMode='cover'
                                onLoadStart={handleLoadStart}
                                onLoadEnd={handleLoadEnd}
                            />
                        </View>
                    ) : (
                        <Image
                            style={[styles.groupIcon, {
                                width: getWidth(10),
                                height: getWidth(10),
                            }]}
                            source={Icons.createGroup}
                            resizeMode='center'
                        />
                    )}
                </TouchableOpacity>
                <TextInput
                    allowFontScaling={false}
                    style={[styles.input, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14) }]}
                    placeholder="Group Name"
                    placeholderTextColor={textColors.search}
                    value={groupName}
                    onChangeText={setGroupName}
                />
            </View>
            <Text style={[styles.membersText, { fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(18) }]}>
                Added Members: {selectedUsers.length}
            </Text>
            <FlatList
                data={searchQuery !== "" ? usersSearched : users}
                keyExtractor={(item) => item.id + generateRandomId()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => toggleUserSelection(item.id)}
                        style={[styles.userItem, { width: getWidth(40) }]}
                    >
                        <View style={styles.userInfo}>
                            <Image
                                source={item.profileImage ? { uri: item.profileImage } : Icons.userProfile}
                                resizeMode="cover"
                                style={[styles.userImage, {
                                    width: config.isWeb ? getWidth(3) : config.getWidth(12),
                                    height: config.isWeb ? getWidth(3) : config.getHeight(6),
                                }]}
                            />
                            <View>
                                <Text style={[styles.userName, { fontSize: config.isWeb ? getWidth(1.2) : config.generateFontSizeNew(16) }]}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.userSpeciality, { fontSize: config.isWeb ? getWidth(0.8) : config.generateFontSizeNew(11) }]}>
                                    {item.speciality}
                                </Text>
                            </View>
                        </View>
                        <Image
                            source={selectedUsers.includes(item.id) ? Icons.checkMark : Icons.unCheckMark}
                            resizeMode="contain"
                            style={[styles.tickIcon, {
                                width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                height: config.isWeb ? getWidth(2) : config.getWidth(5),
                            }]}
                        />
                    </TouchableOpacity>
                )}
                // onEndReached={loadMoreData}
                // onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <Text style={[styles.noResults, { fontSize: config.isWeb ? getWidth(1.5) : config.generateFontSizeNew(13) }]}>
                        {searchQuery ? 'No users found matching your search' : 'No users found'}
                    </Text>
                }
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={[styles.cancelText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14) }]}>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        (!selectedUsers.length || !groupName.trim() || createGroupLoading) &&
                        styles.disabledButton
                    ]}
                    onPress={handleCreateGroup}
                    disabled={!selectedUsers.length || !groupName.trim() || createGroupLoading}
                >
                    {createGroupLoading ? (
                        <ActivityIndicator size="small" color={commonColors.black} />
                    ) : (
                        <Text style={[styles.saveText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14) }]}>
                            Save
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView
            onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50 &&
                    hasMoreData && !isLoadingMore && !isLoading) {
                    loadMoreData();
                }
            }}
            scrollEventThrottle={400}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}
        >
            <WebBaseLayout rightContent={MainContent} showSearch onSearch={onSearch} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subcontainer: {
        flex: 1,
        //backgroundColor: commonColors.white,
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
        borderRadius: config.getWidth(12.5),
        borderWidth: 1,
        borderColor: borderColors.profileImage
    },
    input: {
        flex: 0.8,
        padding: config.getHeight(3),
        fontFamily: 'regular',
        color: commonColors.black,
        borderBottomWidth: 1,
        borderBottomColor: borderColors.profileImage,
        marginLeft: config.getWidth(4),
    },
    membersText: {
        fontFamily: 'regular',
        color: commonColors.black,
        paddingHorizontal: config.getWidth(5),
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
        alignSelf: 'center'
        //paddingRight: config.getWidth(4),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        borderRadius: config.getWidth(10),
        marginRight: config.getWidth(5),
        borderColor: borderColors.profileImage,
        borderWidth: 1.5
    },
    tickIcon: {
        borderRadius: config.getWidth(2.5),
    },
    userName: {
        fontFamily: 'regular',
        color: '#000000',
    },
    userSpeciality: {

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
        //backgroundColor: commonColors.white,
        paddingVertical: config.getHeight(0.5),
        paddingBottom: config.getHeight(2),
    },
    cancelButton: {
        flex: 0.45,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        paddingVertical: config.getHeight(1.5),
        alignItems: 'center',
        borderRadius: config.getWidth(4),
    },
    saveButton: {
        flex: 0.45,
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
    },
    saveText: {
        color: commonColors.black,
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
        color: commonColors.black
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default NewGroupWeb;