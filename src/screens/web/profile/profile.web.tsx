import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import Icons from '@/src/assets/icons';
import { GET_USER_DETAILS } from '@/src/services/QueryMethod';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_ACCOUNT } from '@/src/services/MutationMethod';
import { setTempToken, setTempUserId, setToken, setUserDetails, setUserId } from '@/src/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import HeaderWeb from '@/src/components/headerWeb';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import { useIsFocused } from '@react-navigation/native';


const Profile: React.FC = (props) => {

    const { loading, error, data, refetch } = useQuery(GET_USER_DETAILS);
    const [userDetails, setUserDetail] = useState<any>()
    const [deleteModalVisible, setdeleteModalVisible] = useState(false);
    const [logoutModalVisible, setlogoutModalVisible] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [deleteAccount] = useMutation(DELETE_ACCOUNT)
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [imageLoading, setLoading] = useState(true);
    // useFetchDimention();
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    useEffect(() => {
        if (!loading) {
            console.log("userDetailsResponse", data?.getUserDetails?.userInfo)
            setUserDetail(data?.getUserDetails?.userInfo)
            dispatch(setUserDetails(data?.getUserDetails?.userInfo))
        }


    }, [loading]);

    useEffect(() => {
        if (isFocused) {


            const fetchUserDetails = async () => {
                let userDetails = await refetch()
                console.log("fetchuserDetailsResponse", userDetails?.data?.getUserDetails?.userInfo)
                setUserDetail(userDetails?.data?.getUserDetails?.userInfo);
                dispatch(setUserDetails(userDetails?.data?.getUserDetails?.userInfo))
            }

            fetchUserDetails()

        }

    }, [isFocused])


    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }
    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const getInitials = (fullName?: string) => {
        if (!fullName) return ''; // Return empty string if fullName is undefined or null

        const nameParts = fullName.trim().split(' ');
        if (nameParts.length > 1) {
            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        }
        return nameParts[0].substring(0, 2).toUpperCase();
    };

    return (
        <View style={styles.container}>
            <HeaderWeb />
            {
                loading
                    ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        < ActivityIndicator />
                    </View>

                    :
                    <View style={{
                        // backgroundColor: 'pink',
                        width: '100%'
                    }}>
                        <View style={{
                            width: '100%',
                            marginTop: '2%',
                            // backgroundColor: 'green',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'bold',
                                fontSize: getFontSize(6),
                                color: commonColors.black
                            }}>
                                Profile
                            </Text>
                        </View>
                        <View style={{
                            width: getWidth(100),
                            //padding: '2%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: 'green'
                        }}>
                            <View style={{
                                width: getWidth(50), borderRightWidth: getHeight(0.1), borderRightColor: borderColors.profileImage, height: getHeight(70), alignItems: 'flex-end', justifyContent: 'center', paddingRight: getWidth(5),
                                // backgroundColor: 'orange'
                            }}>
                                {
                                    userDetails?.profile_image_path
                                        ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            {imageLoading && (
                                                <ActivityIndicator
                                                    size='small'
                                                    style={{
                                                        position: 'absolute',
                                                    }}
                                                />
                                            )}
                                            <Image
                                                style={{
                                                    width: getWidth(16),
                                                    height: getWidth(16),
                                                    borderRadius: getWidth(8),
                                                    borderWidth: 1, borderColor: borderColors.profileImage
                                                }}
                                                source={{ uri: userDetails?.profile_image_path }}
                                                resizeMode='stretch'
                                                onLoadStart={handleLoadStart}
                                                onLoadEnd={handleLoadEnd}

                                            />

                                        </View>

                                        :
                                        // <Image
                                        //     style={{
                                        //         // width: '25%',
                                        //         // height: '58%',
                                        //         width: getWidth(16),
                                        //         height: getWidth(16),
                                        //         borderRadius: getWidth(8),
                                        //         borderWidth: 1, borderColor: borderColors.profileImage
                                        //     }}
                                        //     source={Icons.userProfile}
                                        //     resizeMode='contain'

                                        // />


                                        <View style={[styles.avatarCircle,{
                                            width: config.isWeb ? getWidth(15) : config.getWidth(32), 
                                            height: config.isWeb ? getWidth(15) : config.getWidth(32), 
                                            borderRadius: config.isWeb ? getWidth(8) : config.getWidth(16),
                                        }]}>
                                        <Text style={[styles.avatarText,{fontSize: config.isWeb ? getFontSize(20) : config.generateFontSizeNew(50),}]}>{getInitials(userDetails?.display_name)}</Text>
                                    </View>
                                }
                                <TouchableOpacity onPress={() => {
                                    navigationService.navigate(RouteNames.EditProfile)
                                }} style={{ backgroundColor: backgroundColors.editProfile, width: getWidth(10), height: getHeight(5.5), marginRight: getWidth(3), marginTop: getHeight(2), borderRadius: getWidth(1), borderWidth: 1, borderColor: borderColors.profileImage, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: commonColors.white, fontFamily: 'bold', fontSize: getFontSize(3) }}>
                                        Edit Profile
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {
                                deleteConfirmation ?
                                    <View style={{ width: getWidth(50), height: getHeight(70), borderLeftWidth: getHeight(0.1), borderLeftColor: borderColors.profileImage, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: getWidth(5) }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ paddingVertical: getHeight(1), borderWidth: 1, borderBottomColor: borderColors.DeleteAccount, marginTop: getHeight(1), backgroundColor: commonColors.white, justifyContent: 'center', alignItems: 'center', borderRadius: getWidth(2) }}>
                                                <Image
                                                    style={{ width: getWidth(6), height: getHeight(6), marginVertical: getHeight(2) }}
                                                    source={Icons.DeleteAccountWarning}
                                                    resizeMode='contain'

                                                />
                                                <View style={{ marginHorizontal: getWidth(2) }}>
                                                    <Text style={{ textAlign: 'center', color: textColors.DeleteAccountQuestion, fontFamily: 'regular', fontSize: getFontSize(4) }}>
                                                        Are you sure you want to permanently delete your{'\n'}account?
                                                    </Text>
                                                    <Text style={{ textAlign: 'center', color: commonColors.black, fontFamily: 'regular', fontSize: getFontSize(4) }}>
                                                        All the data associated with your account will be{'\n'}deleted. You will not be able retrieve those data once{'\n'}you delete the account
                                                    </Text>
                                                </View>

                                            </View>
                                            <TouchableOpacity onPress={async () => {
                                                const deleteAccountResponse = await deleteAccount()
                                                console.log("deleteAccountResponse", deleteAccountResponse)
                                                if (deleteAccountResponse?.data) {
                                                    AsyncStorage.removeItem(keys.userToken)
                                                    AsyncStorage.removeItem(keys.userId)
                                                    AsyncStorage.removeItem(keys.tempUserToken)
                                                    AsyncStorage.removeItem(keys.tempUserId)
                                                    dispatch(setToken(null))
                                                    dispatch(setUserId(null))
                                                    dispatch(setTempToken(null))
                                                    dispatch(setTempUserId(null))
                                                }
                                            }} style={{
                                                width: getWidth(17),
                                                height: getHeight(5),
                                                flexDirection: 'row',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                borderRadius: getHeight(2.5),
                                                alignItems: 'center',
                                                backgroundColor: backgroundColors.deleteAccount, marginTop: getHeight(3)
                                            }}>


                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Confirm and Delete Accounts
                                                </Text>


                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    :

                                    <View style={{
                                        width: getWidth(50), borderLeftWidth: getHeight(0.1), borderLeftColor: borderColors.profileImage, height: getHeight(70), alignItems: 'flex-start', justifyContent: 'center', paddingLeft: getWidth(5),
                                        // backgroundColor: 'pink'
                                    }}>
                                        <View style={{ width: getWidth(25) }}>
                                            <View style={{}}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(5), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.display_name}
                                                </Text>
                                            </View>
                                            {
                                                userDetails?.email &&
                                                <View style={{ marginTop: getHeight(0.5) }}>
                                                    <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                        Email: <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader, marginLeft: 1 }}>
                                                            {userDetails?.email}
                                                        </Text>
                                                    </Text>

                                                </View>
                                            }
                                            {
                                                userDetails?.phone &&
                                                <View style={{ marginTop: getHeight(0.5) }}>
                                                    <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                        Phone Number: <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader, marginLeft: 1 }}>
                                                            {userDetails?.phone}
                                                        </Text>
                                                    </Text>

                                                </View>
                                            }
                                            <View style={{ marginTop: getHeight(0.5) }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Title: <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader, marginLeft: 1 }}>
                                                        {userDetails?.title_info?.name !== "Others" ? userDetails?.title_info?.name : userDetails?.custom_info?.custom_title}
                                                    </Text>
                                                </Text>

                                            </View>
                                            <View style={{ marginTop: getHeight(0.5) }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Specialty: <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader, marginLeft: 1 }}>
                                                        {userDetails?.speciality_info?.name !== "Others" ? userDetails?.speciality_info?.name : userDetails?.custom_info?.custom_speciality}
                                                    </Text>
                                                </Text>

                                            </View>
                                            <View style={{ marginTop: getHeight(0.5) }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Affiliation: <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                        {userDetails?.affiliation_info?.name !== "Others" ? userDetails?.affiliation_info?.name : userDetails?.custom_info?.custom_affiliation}
                                                    </Text>
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ width: getWidth(25), flexDirection: 'row', height: getHeight(7), paddingVertical: getHeight(1), borderBottomWidth: 0.5, borderBottomColor: borderColors.profileFolowersFollowing, marginTop: getHeight(1) }}>
                                            <View style={{ flex: 0.3, borderRightWidth: 0.5, borderRightColor: borderColors.profileFolowersFollowing, justifyContent: 'center', alignItems: 'center' }}>

                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.total_posts}
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Posts
                                                </Text>
                                            </View>
                                            <TouchableOpacity style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => navigationService.navigate(RouteNames.FollowersFollowing, { activeTab: 'following' })}>
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.total_following}
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Following
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 0.3, borderLeftWidth: 0.5, borderLeftColor: borderColors.profileFolowersFollowing, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => navigationService.navigate(RouteNames.FollowersFollowing, { activeTab: 'followers' })}>
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.total_followers}
                                                </Text>
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    Followers
                                                </Text>
                                            </TouchableOpacity>

                                        </View>

                                        <View style={{ width: getWidth(25), marginTop: getHeight(2.5), borderBottomWidth: 0.5, borderBottomColor: borderColors.profileFolowersFollowing }}>

                                            <View style={{ marginBottom: getHeight(2.5), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader, flex: 0.3, }}>
                                                    Subspeciality

                                                </Text>
                                                <Text style={{ position: "absolute", left: getWidth(9), fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.sub_speciality_info ? userDetails?.sub_speciality_info?.name : "-"}
                                                </Text>

                                            </View>
                                            <View style={{ marginBottom: getHeight(2.5), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader, flex: 0.3, }}>
                                                    Country

                                                </Text>
                                                <Text style={{ position: "absolute", left: getWidth(9), fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.country_info ? userDetails?.country_info?.name : "-"}
                                                </Text>

                                            </View>
                                            <View style={{ marginBottom: getHeight(2.5), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.drawerSubHeader, flex: 0.3 }}>
                                                    Trainee Level

                                                </Text>
                                                <Text style={{ position: "absolute", left: getWidth(9), fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    {userDetails?.trainee_level_info ? userDetails?.trainee_level_info?.name : "-"}

                                                </Text>

                                            </View>


                                        </View>


                                        <View style={{ width: getWidth(25), marginTop: getHeight(2.5), borderBottomWidth: 0.5, borderBottomColor: borderColors.profileFolowersFollowing }}>
                                            <TouchableOpacity style={{ marginBottom: getHeight(2.5), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                                                onPress={() => navigationService.navigate(RouteNames.UserSearch)}>
                                                <Image
                                                    style={{ width: getWidth(1.5), height: getWidth(1.5) }}
                                                    source={Icons.userSearch}
                                                    resizeMode='contain'

                                                />
                                                <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                    User Search
                                                </Text>
                                            </TouchableOpacity>
                                        </View>


                                        <TouchableOpacity onPress={() => {
                                            setlogoutModalVisible(true)
                                        }} style={{
                                            width: getWidth(17),
                                            height: getHeight(5),
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: getHeight(2.5),
                                            backgroundColor: backgroundColors.headerTitle, marginLeft: getWidth(4), marginTop: getHeight(1)
                                        }}>


                                            <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                Logout
                                            </Text>


                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setDeleteConfirmation(true)
                                            // setdeleteModalVisible(true)
                                        }} style={{
                                            width: getWidth(17),
                                            height: getHeight(5),
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            borderRadius: getHeight(2.5),
                                            alignItems: 'center',
                                            backgroundColor: backgroundColors.deleteAccount, marginLeft: getWidth(4), marginTop: getHeight(1)
                                        }}>


                                            <Text style={{ fontFamily: 'regular', fontSize: getFontSize(3), color: textColors.drawerSubHeader }}>
                                                Delete Account
                                            </Text>


                                        </TouchableOpacity>
                                    </View>
                            }




                        </View>
                    </View>



                // <ScrollView
                //     style={{ width: getWidth(100) }}
                //     showsVerticalScrollIndicator={false}
                // >



                //     <View style={{ alignSelf: 'center', width: getWidth(100), flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: getWidth(5), marginTop: getHeight(1) }}>
                //         <View style={{ width: getWidth(30) }}>
                //             <Image
                //                 style={{ width: getWidth(30), height: getWidth(30), borderRadius: getWidth(15), borderWidth: 1, borderColor: borderColors.profileImage }}
                //                 source={Icons.userProfile}
                //                 resizeMode='contain'

                //             />
                //         </View>
                //         <View style={{ width: getWidth(50) }}>
                //             <View style={{}}>
                //                 <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader }}>
                //                     {userDetails?.display_name}
                //                 </Text>
                //                 <Text numberOfLines={1} style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                //                     {userDetails?.email}
                //                 </Text>
                //             </View>
                //             <View style={{}}>
                //                 <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader }}>
                //                     Title: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                //                         {userDetails?.title_info?.name}
                //                     </Text>
                //                 </Text>

                //             </View>
                //             <View style={{}}>
                //                 <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader }}>
                //                     Specialty: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                //                         {userDetails?.speciality_info?.name}
                //                     </Text>
                //                 </Text>

                //             </View>
                //             <View style={{}}>
                //                 <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader }}>
                //                     Affiliation: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                //                         {userDetails?.affiliation_info?.name}
                //                     </Text>
                //                 </Text>

                //             </View>
                //         </View>
                //     </View>




                //     {/* </View> */}
                // </ScrollView>

            }


            <Modal
                animationType="slide" // 'slide', 'fade', or 'none'
                transparent={true}    // Whether the modal is transparent
                visible={logoutModalVisible} // Control visibility
                onRequestClose={() => setlogoutModalVisible(false)} // Required for Android back button
            >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalContent, { width: getWidth(20), height: getHeight(35), }]}>

                        <View style={[styles.modalSubContent, { justifyContent: 'center', width: getWidth(19) }]}>
                            <Text style={[styles.text, { textAlign: 'center', marginHorizontal: getWidth(3), fontSize: getFontSize(4), }]}>
                                Are you sure you want to Logout?
                            </Text>
                        </View>
                        <View style={[styles.modalSubContent, { flexDirection: 'row', justifyContent: 'space-evenly', width: getWidth(19) }]}>
                            <TouchableOpacity onPress={() => {
                                setlogoutModalVisible(false)
                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: getWidth(5), marginTop: getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: getWidth(2), marginVertical: getHeight(1.5), fontFamily: 'regular', color: commonColors.black, fontSize: config.generateFontSizeNew(3) }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () => {

                                AsyncStorage.removeItem(keys.userToken)
                                AsyncStorage.removeItem(keys.userId)
                                AsyncStorage.removeItem(keys.tempUserToken)
                                AsyncStorage.removeItem(keys.tempUserId)
                                dispatch(setToken(null))
                                dispatch(setUserId(null))
                                dispatch(setTempToken(null))
                                dispatch(setTempUserId(null))

                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: getWidth(5), marginTop: getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: getWidth(2), marginVertical: getHeight(1.5), fontFamily: 'bold', color: commonColors.black, fontSize: config.generateFontSizeNew(3) }}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </Modal>


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center'
    },
    logoutText: {
        color: commonColors.white,
        fontSize: config.isWeb ? config.generateFontSizeNew(3.5) : config.generateFontSizeNew(18),
        fontFamily: 'regular',
        zIndex: -1,
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: commonColors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: commonColors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalSubContent: {
        flex: 1,
        alignItems: 'center'
    },
    text: {
        //marginBottom: 10,
        fontFamily: 'regular',
        color: commonColors.black
    },
    avatarCircle: {
       
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#707070'
    },
    avatarText: {
        color: '#000000',
        
    },
})

export default Profile



// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
// import Header from './components/Header';
// import ProfileInfo from './components/ProfileInfo';
// import Stats from './components/Stats';
// import AdditionalDetails from './components/AdditionalDetails';
// import ActionButtons from './components/ActionButtons';
// import axios from 'axios';
// import Header from '../../../components/header';

// interface UserProfile {
//     name: string;
//     email: string;
//     title: string;
//     specialty: string;
//     affiliation: string;
//     practice: string;
//     subspecialty: string;
//     country: string;
//     traineeLevel: string;
//     posts: number;
//     following: number;
//     followers: number;
//     profileImage: string;
// }

// const ProfileScreen: React.FC = () => {
//     const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         // const fetchProfileData = async () => {
//         //     try {
//         //         // Replace with your API endpoint
//         //         const response = await axios.get('https://api.example.com/user/profile');
//         //         setUserInfo(response.data);
//         //     } catch (error) {
//         //         console.error('Error fetching profile data:', error);
//         //     } finally {
//         //         setLoading(false);
//         //     }
//         // };

//         // fetchProfileData();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.loader}>
//                 <ActivityIndicator size="large" color="#000" />
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     if (!userInfo) {
//         return (
//             <View style={styles.loader}>
//                 <Text>Error loading profile data.</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView style={styles.container}>
//             <Header />
//             <ProfileInfo
//                 profileImage={userInfo.profileImage}
//                 name={userInfo.name}
//                 email={userInfo.email}
//                 title={userInfo.title}
//                 specialty={userInfo.specialty}
//                 affiliation={userInfo.affiliation}
//             />
//             <Stats posts={userInfo.posts} following={userInfo.following} followers={userInfo.followers} />
//             <AdditionalDetails
//                 practice={userInfo.practice}
//                 subspecialty={userInfo.subspecialty}
//                 country={userInfo.country}
//                 traineeLevel={userInfo.traineeLevel}
//             />
//             <ActionButtons />
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default ProfileScreen;
