import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Clipboard, Alert } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import Icons from '@/src/assets/icons';
import { GET_USER_DETAILS } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_ACCOUNT } from '@/src/services/MutationMethod';
import { setTempToken, setTempUserId, setToken, setUserDetails, setUserId } from '@/src/redux/action';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';



const Profile: React.FC = (props) => {

    const { loading, error, data, refetch } = useQuery(GET_USER_DETAILS);
    const [userDetails, setUserDetail] = useState<any>()
    const [deleteModalVisible, setdeleteModalVisible] = useState(false);
    const [logoutModalVisible, setlogoutModalVisible] = useState(false);
    const [deleteAccount] = useMutation(DELETE_ACCOUNT)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const [imageLoading, setLoading] = useState(true);
    useEffect(() => {


        if (!loading) {
            console.log("RefetchuserDetailsResponse", data?.getUserDetails?.userInfo)
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
            <Header back={true} editProfile={true} />
            {
                loading
                &&
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator />
                </View>

            }
            <ScrollView
                style={{ width: config.getWidth(100), backgroundColor: backgroundColors.offWhite }}
                showsVerticalScrollIndicator={false}
            >



                <View style={{ alignSelf: 'center', width: config.getWidth(100), flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: config.getWidth(5), marginTop: config.getHeight(1) }}>
                    <View style={{ width: config.getWidth(25) }}>
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
                                        style={{ width: config.getWidth(30), height: config.getWidth(30), borderRadius: config.getWidth(15), borderWidth: 1, borderColor: borderColors.profileImage }}
                                        source={{ uri: userDetails?.profile_image_path }}
                                        resizeMode='stretch'
                                        onLoadStart={handleLoadStart}
                                        onLoadEnd={handleLoadEnd}

                                    />

                                </View>

                                :
                                // <Image
                                //     style={{ width: config.getWidth(30), height: config.getWidth(30), borderRadius: config.getWidth(15), borderWidth: 1, borderColor: borderColors.profileImage }}
                                //     source={Icons.userProfile}
                                //     resizeMode='contain'

                                // />

                                <View style={styles.avatarCircle}>
                                    <Text style={styles.avatarText}>{getInitials(userDetails?.display_name)}</Text>
                                </View>

                        }

                    </View>
                    <View style={{ width: config.getWidth(55), paddingLeft: config.getWidth(3) }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader, marginTop: config.getHeight(0.5), marginBottom: config.getHeight(0.5) }}>
                                {userDetails?.display_name}
                            </Text>
                            {
                                userDetails?.email &&
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: config.getHeight(1) }}>
                                    <Text numberOfLines={1} style={{ marginLeft: config.getWidth(-2.5), fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                                        {userDetails?.email}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        Alert.alert("Email copied")
                                        Clipboard.setString(userDetails?.email);
                                    }}>
                                        <Image
                                            source={Icons.copyIcon}
                                            style={{ width: config.getWidth(4), height: config.getWidth(4), marginLeft: config.getWidth(1) }}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>

                                </View>


                            }

                            {
                                userDetails?.phone &&
                                <Text numberOfLines={1} style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader, marginBottom: config.getHeight(0.5) }}>
                                    {userDetails?.phone}
                                </Text>

                            }

                        </View>
                        <View style={{}}>
                            <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader, marginBottom: config.getHeight(0.5) }}>
                                Title: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                                    {userDetails?.title_info?.name !== "Others" ? userDetails?.title_info?.name : userDetails?.custom_info?.custom_title}
                                </Text>
                            </Text>

                        </View>
                        <View style={{}}>
                            <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader, marginBottom: config.getHeight(0.5) }}>
                                Specialty: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                                    {userDetails?.speciality_info?.name !== "Others" ? userDetails?.speciality_info?.name : userDetails?.custom_info?.custom_speciality}
                                </Text>
                            </Text>

                        </View>
                        <View style={{}}>
                            <Text numberOfLines={0} style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(16), color: textColors.drawerSubHeader, marginBottom: config.getHeight(0.5), lineHeight: config.getHeight(3) }}>
                                Affiliation: <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>

                                    {userDetails?.affiliation_info?.name !== "Others" ? userDetails?.affiliation_info?.name : userDetails?.custom_info?.custom_affiliation}
                                </Text>
                            </Text>

                        </View>
                    </View>
                </View>

                <View style={{ marginTop: config.getHeight(1.5), alignSelf: 'center', width: config.getWidth(90), flexDirection: 'row', height: config.getHeight(8), paddingVertical: config.getHeight(0.5), borderBottomWidth: 1, borderBottomColor: borderColors.profileFolowersFollowing }}>
                    <View style={{ flex: 0.3, borderRightWidth: 1, marginBottom: config.getHeight(1), borderRightColor: borderColors.profileFolowersFollowing, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, marginBottom: config.getHeight(1) }}>
                            {userDetails?.total_posts}
                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                            Posts
                        </Text>
                    </View>
                    <TouchableOpacity style={{ flex: 0.4, marginBottom: config.getHeight(1), justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigationService.navigate(RouteNames.FollowersFollowing, { activeTab: 'following' })}>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, marginBottom: config.getHeight(1) }}>
                            {userDetails?.total_following}
                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                            Following
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 0.3, marginBottom: config.getHeight(1), borderLeftWidth: 1, borderLeftColor: borderColors.profileFolowersFollowing, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigationService.navigate(RouteNames.FollowersFollowing, { activeTab: 'followers' })}>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, marginBottom: config.getHeight(1) }}>
                            {userDetails?.total_followers}
                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                            Followers
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={{ alignSelf: 'center', width: config.getWidth(90), paddingVertical: config.getHeight(1.5), borderBottomWidth: 1, borderBottomColor: borderColors.profileFolowersFollowing }}>
                    <View style={{ marginVertical: config.getHeight(2), width: config.getWidth(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, maxWidth: config.getWidth(40) }}>
                            Practice

                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, flex: 1, marginLeft: config.getWidth(10), textAlign: 'right' }}>
                            {userDetails?.speciality_info ? userDetails?.speciality_info?.name : "-"}
                        </Text>

                    </View>
                    <View style={{ marginBottom: config.getHeight(2), width: config.getWidth(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, maxWidth: config.getWidth(40) }}>
                            Subspeciality

                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, flex: 1, marginLeft: config.getWidth(10), textAlign: 'right' }}>
                            {userDetails?.sub_speciality_info ? userDetails?.sub_speciality_info?.name : "-"}
                        </Text>

                    </View>
                    <View style={{ marginBottom: config.getHeight(2), width: config.getWidth(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, maxWidth: config.getWidth(40) }}>
                            Country

                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, flex: 1, marginLeft: config.getWidth(10), textAlign: 'right' }}>
                            {userDetails?.country_info ? userDetails?.country_info?.name : "-"}
                        </Text>

                    </View>
                    <View style={{ marginBottom: config.getHeight(2), width: config.getWidth(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'bold', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, maxWidth: config.getWidth(40) }}>
                            Trainee Level

                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader, flex: 1, marginLeft: config.getWidth(10), textAlign: 'right' }}>
                            {userDetails?.trainee_level_info ? userDetails?.trainee_level_info?.name : "-"}
                        </Text>

                    </View>
                </View>

                <TouchableOpacity style={{ alignSelf: 'center', width: config.getWidth(90), height: config.getHeight(6), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                    onPress={() => navigationService.navigate(RouteNames.UserSearch)}>

                    <Image
                        style={{ width: config.getWidth(5), height: config.getWidth(5), marginLeft: config.getWidth(1) }}
                        source={Icons.userSearch}
                        resizeMode='contain'

                    />
                    <Text style={{ marginLeft: config.getWidth(5), fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                        User Search
                    </Text>


                </TouchableOpacity>
                {/* <View style={{ alignSelf: 'center', width: config.getWidth(90), height: config.getHeight(7), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                            <Image
                                style={{ width: config.getWidth(5), height: config.getWidth(5), marginLeft: config.getWidth(3) }}
                                source={Icons.easyPayHub}
                                resizeMode='contain'

                            />
                            <Text style={{ marginLeft: config.getWidth(5), fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                                Easy Pay Hub
                            </Text>


                        </View> */}
                <TouchableOpacity onPress={() => {
                    setlogoutModalVisible(true)
                }} style={{ alignSelf: 'center', width: config.getWidth(90), height: config.getHeight(6), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Image
                        style={{ width: config.getWidth(5), height: config.getWidth(5), marginLeft: config.getWidth(1) }}
                        source={Icons.logout}
                        resizeMode='contain'

                    />
                    <Text style={{ marginLeft: config.getWidth(5), fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                        Logout
                    </Text>


                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setdeleteModalVisible(true)
                }} style={{ alignSelf: 'center', width: config.getWidth(90), height: config.getHeight(6), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Image
                        style={{ width: config.getWidth(5), height: config.getWidth(5), marginLeft: config.getWidth(1) }}
                        source={Icons.deleteAccount}
                        resizeMode='contain'

                    />
                    <Text style={{ marginLeft: config.getWidth(5), fontFamily: 'regular', fontSize: config.generateFontSizeNew(14), color: textColors.drawerSubHeader }}>
                        Delete Account
                    </Text>


                </TouchableOpacity>
                {/* </View> */}
            </ScrollView>


            <Modal
                animationType="slide" // 'slide', 'fade', or 'none'
                transparent={true}    // Whether the modal is transparent
                visible={deleteModalVisible} // Control visibility
                onRequestClose={() => setdeleteModalVisible(false)} // Required for Android back button
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>

                        <View style={[styles.modalSubContent, { justifyContent: 'center' }]}>
                            <Text style={[styles.text, { textAlign: 'center', marginHorizontal: config.getWidth(3) }]}>Are you sure you want to{`\n`}delete your account?</Text>
                        </View>
                        <View style={[styles.modalSubContent, { flexDirection: 'row', flex: 1, justifyContent: 'space-evenly' }]}>
                            <TouchableOpacity onPress={() => {
                                setdeleteModalVisible(false)
                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: config.getWidth(5), marginTop: config.getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: config.getWidth(10), marginVertical: config.getHeight(1.5), fontFamily: 'regular', color: commonColors.black, fontSize: config.generateFontSizeNew(14) }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
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
                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: config.getWidth(5), marginTop: config.getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: config.getWidth(10), marginVertical: config.getHeight(1.5), fontFamily: 'bold', color: commonColors.black, fontSize: config.generateFontSizeNew(14) }}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </Modal>

            <Modal
                animationType="slide" // 'slide', 'fade', or 'none'
                transparent={true}    // Whether the modal is transparent
                visible={logoutModalVisible} // Control visibility
                onRequestClose={() => setlogoutModalVisible(false)} // Required for Android back button
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>

                        <View style={[styles.modalSubContent, { justifyContent: 'center' }]}>
                            <Text style={[styles.text, { textAlign: 'center', marginHorizontal: config.getWidth(3) }]}>Are you sure you want to{`\n`}Logout?</Text>
                        </View>
                        <View style={[styles.modalSubContent, { flexDirection: 'row', flex: 1, justifyContent: 'space-evenly' }]}>
                            <TouchableOpacity onPress={() => {
                                setlogoutModalVisible(false)
                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: config.getWidth(5), marginTop: config.getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: config.getWidth(10), marginVertical: config.getHeight(1.5), fontFamily: 'regular', color: commonColors.black, fontSize: config.generateFontSizeNew(14) }}>
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

                            }} style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: config.getWidth(5), marginTop: config.getHeight(8), borderColor: commonColors.black, borderWidth: 1 }}>
                                <Text style={{ marginHorizontal: config.getWidth(10), marginVertical: config.getHeight(1.5), fontFamily: 'bold', color: commonColors.black, fontSize: config.generateFontSizeNew(14) }}>
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
    logoutTextContainer: {
        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -2,
        width: config.isWeb ? config.getWidth(8) : config.getWidth(40),
        height: config.isWeb ? config.getHeight(5) : config.getHeight(7),
        backgroundColor: backgroundColors.signInButton,
        marginTop: config.getHeight(4),
        marginBottom: config.getHeight(4)
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: commonColors.white,
        width: config.getWidth(80),
        height: config.getHeight(35),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: commonColors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalSubContent: {
        flex: 1,
        alignItems: 'center',
        width: config.getWidth(78)
    },
    text: {
        //marginBottom: 10,
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(20),
        color: commonColors.black
    },
    avatarCircle: {
        width: config.getWidth(32), height: config.getWidth(32), borderRadius: config.getWidth(16),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#707070'
    },
    avatarText: {
        color: '#000000',
        fontSize: config.generateFontSizeNew(50),
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
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
