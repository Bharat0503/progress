import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, StatusBar } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { SearchBar } from '@/src/components/searchbar';
import { UserListItem } from '@/src/components/userListItem';
import HeaderBack from '@/src/components/headerBack';
import { GET_CONTENT_DETAILS_BY_ID_MOBILE, GET_GROUP_DIRECTORY_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { backgroundColors, borderColors, commonColors, textColors } from '@/src/utils/colors';
import { DELETE_DIRECTORY_GROUP, REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { EFollowActions } from '@/src/utils/keys';
import { useDispatch } from 'react-redux';
import { setContentId } from '@/src/redux/action';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { useFocusEffect } from '@react-navigation/native';

const Groups: React.FC = () => {
    const dispatch = useDispatch();
    const { loading, error, data, refetch } = useQuery(GET_GROUP_DIRECTORY_DATA, {
        variables: { input: {} }
    });
    const [deleteGroup, { loading: deleting }] = useMutation(DELETE_DIRECTORY_GROUP);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState(new Set());

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    const transformedGroups = data?.getGroupDirectories?.directoryGroups?.map((group: {
        id: { toString: () => any; };
        group_name: any; group_directories: string | any[];
    }) => ({
        id: group?.id.toString(),
        name: group?.group_name,
        count: group?.group_directories?.length || 0
    })) || [];

    const toggleSelection = (id) => {
        setSelectedGroups(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const handleDelete = async () => {
        if (selectedGroups.size === 0) return;
        Alert.alert('Confirm Deletion', 'Are you sure you want to delete selected groups?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', onPress: async () => {
                    console.log('Item id --->', Array.from(selectedGroups).map(Number));
                    try {
                        const { data } = await deleteGroup({ variables: { input: { group_ids: Array.from(selectedGroups).map(Number) } } });
                        if (data?.deleteDirectoryGroup?.success) {
                            Alert.alert('Success', 'Groups deleted successfully');
                            setIsDeleteMode(false);
                            setSelectedGroups(new Set());
                            refetch();
                        } else {
                            Alert.alert('Error', data?.deleteDirectoryGroup?.message || 'Deletion failed');
                        }
                    } catch (err) {
                        Alert.alert('Error', 'Something went wrong. Please try again.');
                    }
                }
            }
        ]);
    };

    const renderGroup = ({ item }) => {
        return (
            <TouchableOpacity style={styles.groupItem} onPress={() => isDeleteMode ? toggleSelection(item.id) :
                navigationService.navigate(RouteNames.GroupName, { id: item.id })}>
                {isDeleteMode && <View style={styles.checkbox}>{selectedGroups.has(item.id) && <Text>✔</Text>}</View>}
                <Image source={Icons.groupIcon} resizeMode='contain' style={styles.groupIcon} />
                <Text style={styles.groupText}>{item.name}</Text>
                <Text style={styles.groupCount}>{item.count}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <HeaderBack title='Groups' backgroundColor='#F8F8F8' />
            <View style={styles.subcontainer}>
                <View style={styles.header}>
                    <Text style={styles.allGroupsText}>All Groups</Text>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity onPress={() => setIsDeleteMode(!isDeleteMode)}>
                            {/* <Text style={styles.icon}>🗑️</Text> */}
                            <Image source={Icons.deleteGroup} resizeMode='contain' style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigationService.navigate(RouteNames.NewGroup)}>
                            <Image source={Icons.addGroup} resizeMode='contain' style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator />
                    </View>
                )} */}
                {(error) && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load groups</Text>
                        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {(transformedGroups.length === 0) && (
                    <View style={styles.noGroupsContainer}>
                    <Text style={[styles.noGroupsText, { fontSize: config.generateFontSizeNew(14), }]}>No groups found</Text>
                </View>
                )}
                <FlatList
                    data={transformedGroups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGroup}
                    contentContainerStyle={{
                        paddingVertical: config.getHeight(4),
                        paddingHorizontal: config.getWidth(4)
                    }}
                    onRefresh={refetch}
                    refreshing={loading}
                />

                {isDeleteMode && selectedGroups.size > 0 && (
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
                        <Text style={styles.deleteButtonText}>{deleting ? 'Deleting...' : 'Delete Selected Groups'}</Text>
                    </TouchableOpacity>
                )}
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
        padding: config.getWidth(1),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: config.getWidth(8),
        paddingVertical: config.getHeight(1.5),
        borderBottomWidth: 1,
        borderBottomColor: borderColors.commentTextInput,
    },
    allGroupsText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        textAlign: 'center'
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    icon: {
        width: 25,
        height: 25,
        marginLeft: 15,
    },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //paddingHorizontal: config.getWidth(4),
        paddingVertical: config.getHeight(1.5),
    },
    groupIcon: {
        width: config.getWidth(10),
        height: config.getHeight(4),
    },
    groupText: {
        flex: 1,
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(16),
        color: commonColors.black,
        textAlign: 'left',
        marginLeft: config.getWidth(6),
    },
    groupCount: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(16),
        color: commonColors.black,
        textAlign: 'center',
        marginRight: config.getWidth(6),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.black,
        marginBottom: config.getHeight(2),
    },
    retryButton: {
        padding: config.getWidth(3),
        backgroundColor: commonColors.white,
        borderRadius: 5,
    },
    retryText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.white,
    },
    deleteButton: {
        position: 'absolute',
        bottom: config.getHeight(2),
        left: config.getWidth(4),
        right: config.getWidth(4),
        padding: config.getWidth(3),
        backgroundColor: commonColors.red,
        alignItems: 'center',
        borderRadius: config.getWidth(2)
    },
    deleteButtonText: {
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        color: commonColors.white,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'black',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    noGroupsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(10)
    },
    noGroupsText: {
        fontFamily: 'regular',
        color: commonColors.black,
    },
});

export default Groups;
