import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ImageSourcePropType, TouchableOpacity, ScrollView } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import HeaderBack from '@/src/components/headerBack';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { borderColors, commonColors, textColors } from '@/src/utils/colors';
import { GET_USER_INFO_BY_ID } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation } from '@apollo/client';
import { REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';
import WebBaseLayout from '@/src/components/webBaseLayout';
import { useSelector } from 'react-redux';
import useFetchDimention from '@/src/customHooks/customDimentionHook';

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

const UserProfileWeb: React.FC = (props: any) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
    const { id } = props.route.params;
    const [userDetails, setUserDetail] = useState<any>(null);
    // const [imageLoading, setLoading] = useState(true);
    const [getUserDetailByID,
        {
            data: getUserDetailByIDData,
            loading: getUserDetailByIDLoading,
            error: getUserDetailByIDError,
            refetch: refetch,
        }] = useLazyQuery(GET_USER_INFO_BY_ID, { fetchPolicy: 'network-only' });

    const [handleFollowAction, { loading: followLoading, error: followError }] = useMutation(REQUEST_FOLLOW_ACTIONS);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    useEffect(() => {
        if (id) {
            getUserDetailByID({ variables: { userId: id } });
        }
    }, [id]);

    useEffect(() => {
        //console.log('Data from GET_USER_INFO_BY_ID API:', JSON.stringify(getUserDetailByIDData?.getUserDetailsById?.userInfo));
        // if (getUserDetailByIDData?.getUserDetailsById?.userInfo) {
        //     setUserDetail(getUserDetailByIDData.getUserDetailsById.userInfo);
        // }
        if (!getUserDetailByIDLoading) {
            setUserDetail(getUserDetailByIDData?.getUserDetailsById?.userInfo);
        }
    }, [getUserDetailByIDLoading]);

    // const handleLoadStart = () => {
    //     setLoading(true);
    // };


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
    }) => {
        const [imageLoading, setLoading] = useState(true);
        const handleLoadEnd = () => {
            setLoading(false);
        };

        return (
            <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                    {imageUrl ?
                        <>
                            {imageLoading && (
                                <ActivityIndicator size='small' style={{ position: 'absolute' }} />
                            )}
                            <Image style={[styles.imgStyle, {
                                width: config.isWeb ? getWidth(10) : config.getWidth(30),
                                height: config.isWeb ? getWidth(10) : config.getWidth(30),
                            }]} source={{ uri: imageUrl }} resizeMode='stretch' onLoad={handleLoadEnd} />
                        </>
                        :
                        <Image style={[styles.imgStyle, {
                            width: config.isWeb ? getWidth(10) : config.getWidth(30),
                            height: config.isWeb ? getWidth(10) : config.getWidth(30),
                        }]} source={Icons.userProfile} resizeMode='contain' />
                    }
                </View>
                <Text style={[styles.name, { fontSize: config.isWeb ? getFontSize(6) : config.generateFontSizeNew(24), }]}>{name}</Text>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{title}</Text>
                    <Text style={[styles.organization, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{organization}</Text>
                </View>
                {/* <TouchableOpacity
                style={styles.followButton}
                onPress={onFollowPress}
            >
                <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : '+ Follow'}</Text>
            </TouchableOpacity> */}
                <TouchableOpacity style={styles.followButton} onPress={onFollowPress} disabled={followLoading}>
                    <Text style={[styles.followButtonText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(15), }]}>
                        {followLoading ? <ActivityIndicator size="small" color={commonColors.black} /> : isFollowing ? 'Unfollow' : '+ Follow'}
                    </Text>
                </TouchableOpacity>

                <View style={[styles.sectionContainer, { width: getWidth(60), }]}>
                    <View style={styles.postContainer}>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{total_posts}</Text>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Posts</Text>
                    </View>
                    <TouchableOpacity style={styles.followingContainer}>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{total_following}</Text>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postsContainer}>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{total_followers}</Text>
                        <Text style={[styles.textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Followers</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.contentSection, { width: getWidth(50), }]}>
                    <View style={[styles.practiceContainer, {
                        width: getWidth(50),
                    }]}>
                        <Text style={[styles.textStyleBold, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Practice</Text>
                        <Text style={[styles.textStyleRegular, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{practice ? practice : "N/A"}</Text>
                    </View>
                    <View style={[styles.subSpecialityContainer, { width: getWidth(50), }]}>
                        <Text style={[styles.textStyleBold, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Subspeciality</Text>
                        <Text style={[styles.textStyleRegular, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{sub_speciality_info ? sub_speciality_info : "N/A"}</Text>
                    </View>
                    <View style={[styles.countryContainer, { width: getWidth(50), }]}>
                        <Text style={[styles.textStyleBold, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Country</Text>
                        <Text style={[styles.textStyleRegular, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{country_info ? country_info : "N/A"}</Text>
                    </View>
                    <View style={[styles.countryContainer, { width: getWidth(50), }]}>
                        <Text style={[styles.textStyleBold, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Trainee Level</Text>
                        <Text style={[styles.textStyleRegular, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{trainee_level_info ? trainee_level_info : "N/A"}</Text>
                    </View>
                </View>
            </View>
        )

    };


    const MainContent = (
        <View style={[styles.container, { width: getWidth(60) }]}>
            {/* <HeaderBack backgroundColor={commonColors.white} />
        <ScrollView contentContainerStyle={styles.subcontainer} showsVerticalScrollIndicator={false}> */}
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
            {/* </ScrollView> */}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: commonColors.white,
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
        marginVertical: config.getHeight(2)
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle: {

        borderRadius: config.getWidth(15),
        borderWidth: 1,
        borderColor: borderColors.profileImage,
    },
    name: {
        marginBottom: config.getHeight(1),
        textAlign: 'center',

        fontFamily: 'regular',
        color: commonColors.black,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: config.getHeight(2),
    },
    title: {
        fontFamily: 'regular',
        color: commonColors.black,
    },
    organization: {
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
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    followButtonText: {

        fontFamily: 'regular',
        color: commonColors.black,
        textAlign: 'center'
    },
    sectionContainer: {
        alignSelf: 'center',

        flexDirection: 'row',
        height: config.getHeight(10),
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
        paddingVertical: config.getHeight(3)
    },
    practiceContainer: {

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textStyleBold: {
        fontFamily: 'bold',

        color: textColors.drawerSubHeader,
        maxWidth: config.getWidth(40)
    },
    textStyleRegular: {
        fontFamily: 'regular',
        color: textColors.drawerSubHeader,
        flex: 1,
        marginLeft: config.getWidth(10),
        textAlign: 'right'
    },
    subSpecialityContainer: {
        marginVertical: config.getHeight(2),

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    countryContainer: {
        marginBottom: config.getHeight(2),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    }

});

export default UserProfileWeb;
