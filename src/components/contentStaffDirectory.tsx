import React, { } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from 'react-native'
import config from '../utils/config'
import { borderColors } from '../utils/colors'
import { useDispatch, useSelector } from 'react-redux'


import { UserListItem } from './userListItem'

interface GuidelinePdfDisplayProps {
    data: any
    onClickUser: (item: any) => void,
    onLoadMore: () => void,
    isLoadingMore: boolean
}



const ContentStaffDirectory: React.FC<GuidelinePdfDisplayProps> = ({ data, onClickUser, onLoadMore, isLoadingMore }) => {

    const space = useSelector((state: any) => state.reducer.space)
    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const dispatch = useDispatch()

    const getFontSize = (size: number) => {
        if (config.isWeb) {
            const webSize = 0.20 * size
            return dimension.width * (webSize / 100)
        }

        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        if (config.isWeb) {
            const webWidth = 0.4 * width
            return dimension.width * (webWidth / 100)
        }
        return dimension.width * (width / 100)
    }

    const getViewWidth = (width: number) => {

        return dimension.width * (width / 100)
    }
    const getViewHeight = (height: number) => {

        return dimension.height * (height / 100)
    }

    const getHeight = (height: number) => {
        if (config.isWeb) {
            const webHeight = 0.4 * height
            return dimension.width * (webHeight / 100)
        }
        return dimension.height * (height / 100)
    }

    //  const handleFollowPress = async (userId: string, isFollowing: boolean) => {
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

    const renderFooter = () => {

        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );



    };

    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(55) : getWidth(90),
            // backgroundColor: 'pink',
            marginVertical: getHeight(2),
            borderRadius: getWidth(3.5),
            borderWidth: 1,
            borderColor: borderColors.infographicFile
        }}>

            <FlatList
                data={data}
                // keyExtractor={item => item.id}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReached={onLoadMore}
                onEndReachedThreshold={1}
                ListFooterComponent={renderFooter}
                renderItem={({ item }) => (
                    <UserListItem
                        item={item}
                        onClickUser={onClickUser}
                        staffDirectory={true}
                        folllowUnfollow={false}
                        paddingHor={false}
                        name={item?.display_name}
                        profileImage={item.profileImage}
                        id={item.id}

                    />
                )}
                style={{
                    width: config.isWeb ? getViewWidth(52) : config.getWidth(86),
                    marginVertical: getHeight(2)
                }}
            // ListEmptyComponent={EmptyComp}
            />







        </View >


    )

}

const styles = StyleSheet.create({
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
})


export default ContentStaffDirectory