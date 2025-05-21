import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ImageSourcePropType, TouchableOpacity, ScrollView } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import HeaderBack from '@/src/components/headerBack';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { borderColors, commonColors, textColors } from '@/src/utils/colors';
import { GET_USER_INFO_BY_ID } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';

interface ProfileCardProps {
    name?: string;
    title?: string;
    organization?: string;
    imageUrl?: any;
    onFollowPress?: () => void;
    total_posts?: number;
    total_following?: number;
    total_followers?: number;
    practice?: string;
    sub_speciality_info?: string;
    country_info?: string;
    trainee_level_info?: string;
    isFollowing?: boolean;
    isFollower?: boolean;
}

const UserProfile: React.FC = (props: any) => {
    const { id } = props.route.params;
    const [userDetails, setUserDetail] = useState<any>(null);
    const [imageLoading, setLoading] = useState(true);
    const [getUserDetailByID,
        {
            data: getUserDetailByIDData,
            loading: getUserDetailByIDLoading,
            error: getUserDetailByIDError,
            refetch: refetch,
        }] = useLazyQuery(GET_USER_INFO_BY_ID, { fetchPolicy: 'network-only' });

    const [handleFollowAction, { loading: followLoading, error: followError }] = useMutation(REQUEST_FOLLOW_ACTIONS);

    useEffect(() => {
        if (id) {
            getUserDetailByID({ variables: { userId: id } });
        }
    }, [id]);

    useEffect(() => {
        console.log('Data from GET_USER_INFO_BY_ID API:', JSON.stringify(getUserDetailByIDData?.getUserDetailsById?.userInfo));
        if (getUserDetailByIDData?.getUserDetailsById?.userInfo) {
            setUserDetail(getUserDetailByIDData.getUserDetailsById.userInfo);
        }
    }, [getUserDetailByIDData]);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    // const handleFollowPress = () => {
    //     console.log('Follow button pressed');
    // };

    const handleFollowPress = async () => {
        if (!userDetails) return;

        const isCurrentlyFollowing = userDetails.follow_status;
        const actionType = isCurrentlyFollowing ? EFollowActions.UNFOLLOW : EFollowActions.FOLLOW;

        try {
            setUserDetail((prevUser: any) => ({
                ...prevUser,
                follow_status: !isCurrentlyFollowing,
            }));

            const { data } = await handleFollowAction({
                variables: {
                    input: {
                        following_id: userDetails.id,
                        action: actionType,
                    },
                },
            });

            if (!data?.handleFollowActions?.success) {
                throw new Error(data?.handleFollowActions?.message || 'Something went wrong');
            }
            refetch();
            console.log('Follow/Unfollow Mutation Success:', data);
        } catch (error: any) {
            console.error('Follow Mutation Error:', error);
            setUserDetail((prevUser: any) => ({
                ...prevUser,
                follow_status: isCurrentlyFollowing,
            }));

            alert(error.message || 'An error occurred while updating follow status');
        }
    };


    const UserProfileDisplay: React.FC<ProfileCardProps> = ({
        name,
        title,
        organization,
        imageUrl,
        onFollowPress,
        total_posts,
        total_following,
        total_followers,
        practice,
        sub_speciality_info,
        country_info,
        trainee_level_info,
        isFollower,
        isFollowing
    }) => (
        <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
                {imageUrl ?
                    <>
                        {imageLoading && (
                            <ActivityIndicator size='small' style={{ position: 'absolute' }} />
                        )}
                        <Image style={styles.imgStyle} source={{ uri: imageUrl }} resizeMode='stretch' onLoadStart={handleLoadStart} onLoadEnd={handleLoadEnd} />
                    </>
                    :
                    <Image style={styles.imgStyle} source={Icons.userProfile} resizeMode='contain' />
                }
            </View>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.organization}>{organization}</Text>
            </View>
            {/* <TouchableOpacity
                style={styles.followButton}
                onPress={onFollowPress}
            >
                <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : '+ Follow'}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.followButton} onPress={onFollowPress} disabled={followLoading}>
                <Text style={styles.followButtonText}>
                    {followLoading ? <ActivityIndicator size="small" color={commonColors.black} /> : isFollowing ? 'Unfollow' : '+ Follow'}
                </Text>
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
                <View style={styles.postContainer}>
                    <Text style={styles.textStyle}>{total_posts}</Text>
                    <Text style={styles.textStyle}>Posts</Text>
                </View>
                <TouchableOpacity style={styles.followingContainer}>
                    <Text style={styles.textStyle}>{total_following}</Text>
                    <Text style={styles.textStyle}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postsContainer}>
                    <Text style={styles.textStyle}>{total_followers}</Text>
                    <Text style={styles.textStyle}>Followers</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.contentSection}>
                <View style={styles.practiceContainer}>
                    <Text style={styles.textStyleBold}>Practice</Text>
                    <Text style={styles.textStyleRegular}>{practice ? practice : "-"}</Text>
                </View>
                <View style={styles.subSpecialityContainer}>
                    <Text style={styles.textStyleBold}>Subspeciality</Text>
                    <Text style={styles.textStyleRegular}>{sub_speciality_info ? sub_speciality_info : "-"}</Text>
                </View>
                <View style={styles.countryContainer}>
                    <Text style={styles.textStyleBold}>Country</Text>
                    <Text style={styles.textStyleRegular}>{country_info ? country_info : "-"}</Text>
                </View>
                <View style={styles.countryContainer}>
                    <Text style={styles.textStyleBold}>Trainee Level</Text>
                    <Text style={styles.textStyleRegular}>{trainee_level_info ? trainee_level_info : "-"}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderBack backgroundColor={commonColors.white} />
            <ScrollView contentContainerStyle={styles.subcontainer} showsVerticalScrollIndicator={false}>
                {getUserDetailByIDLoading ? (
                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                           <ActivityIndicator />
                                       </View>
                ) : userDetails ? (
                    <UserProfileDisplay
                        name={userDetails?.display_name}
                        title={userDetails?.title_info?.name}
                        organization={userDetails?.affiliation_info?.name}
                        imageUrl={userDetails?.profile_image_path}
                        onFollowPress={handleFollowPress}
                        total_posts={userDetails?.total_posts}
                        total_followers={userDetails?.total_followers}
                        total_following={userDetails?.total_following}
                        practice={userDetails?.speciality_info?.name}
                        sub_speciality_info={userDetails?.sub_speciality_info?.name}
                        country_info={userDetails?.country_info?.name}
                        trainee_level_info={userDetails?.trainee_level_info?.name}
                        isFollowing={userDetails?.follow_status}
                        isFollower={userDetails?.follow_back_status}
                    />
                ) : (
                    <Text style={styles.errorText}>User details not found.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonColors.white,
    },
    loader: {
        marginTop: config.getHeight(20),
    },
    errorText: {
        textAlign: 'center',
        color: commonColors.black,
        marginTop: config.getHeight(20),
    },
    subcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        paddingHorizontal: config.getWidth(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: config.getHeight(2)
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle: {
        width: config.getWidth(25),
        height: config.getWidth(25),
        borderRadius: config.getWidth(12.5),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
    },
    name: {
        marginBottom: config.getHeight(2),
        textAlign: 'center',
        fontSize: config.generateFontSizeNew(20),
        fontFamily: 'regular',
        color: commonColors.black,
        fontWeight:'bold'
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: config.getHeight(2),
       
    },
    title: {
        fontSize: config.generateFontSizeNew(13),
        fontFamily: 'regular',
        color: commonColors.black,
    },
    organization: {
        fontSize: config.generateFontSizeNew(13),
        fontFamily: 'regular',
        color: commonColors.black,
    },
    followButton: {
        // width: config.getWidth(30),
        paddingHorizontal: config.getWidth(7),
        paddingVertical: config.getHeight(0.5),
        borderRadius: config.getWidth(25),
        backgroundColor: commonColors.white,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: config.getHeight(1),
    },
    followButtonText: {
        fontSize: config.generateFontSizeNew(14),
        fontFamily: 'regular',
        color: commonColors.black,
        textAlign: 'center'
    },
    sectionContainer: {
        alignSelf: 'center',
        width: config.getWidth(90),
        flexDirection: 'row',
        height: config.getHeight(9),
        paddingVertical: config.getHeight(1),
        borderBottomWidth: 0.5,
        borderBottomColor: borderColors.profileFolowersFollowing
    },
    postContainer: {
        flex: 0.3,
        borderRightWidth: 0.5,
        borderRightColor: borderColors.profileFolowersFollowing,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(12),
        color: textColors.drawerSubHeader
    },
    followingContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postsContainer: {
        flex: 0.3,
        borderLeftWidth: 0.5,
        borderLeftColor: borderColors.profileFolowersFollowing,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentSection: {
        alignSelf: 'center',
        width: config.getWidth(90),
        paddingVertical: config.getHeight(3)
    },
    practiceContainer: {
        width: config.getWidth(90),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textStyleBold: {
        fontFamily: 'bold',
        fontSize: config.generateFontSizeNew(12),
        color: textColors.drawerSubHeader,
        maxWidth: config.getWidth(40)
    },
    textStyleRegular: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(12),
        color: textColors.drawerSubHeader,
        flex: 1,
        marginLeft: config.getWidth(10),
        textAlign: 'right'
    },
    subSpecialityContainer: {
        marginVertical: config.getHeight(2),
        width: config.getWidth(90),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    countryContainer: {
        marginBottom: config.getHeight(2),
        width: config.getWidth(90),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    }

});

export default UserProfile;
