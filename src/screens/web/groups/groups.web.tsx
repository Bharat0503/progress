import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import config from '../../../utils/config';
import Icons from '../../../assets/icons/index';
import { GET_CONTENT_DETAILS_BY_ID_MOBILE, GET_GROUP_DIRECTORY_DATA } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { backgroundColors, borderColors, commonColors, textColors } from '@/src/utils/colors';
import { DELETE_DIRECTORY_GROUP, REQUEST_FOLLOW_ACTIONS } from '@/src/services/MutationMethod';
import { useDispatch, useSelector } from 'react-redux';
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { useFocusEffect } from '@react-navigation/native';
import WebBaseLayout from '@/src/components/webBaseLayout';
import useFetchDimention from '@/src/customHooks/customDimentionHook';
import alert from '@/src/utils/alert';

const GroupsWeb: React.FC = () => {
    const dispatch = useDispatch();
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    useFetchDimention();
    const { loading, error, data, refetch } = useQuery(GET_GROUP_DIRECTORY_DATA, {
        variables: { input: {} }
    });
    const [deleteGroup, { loading: deleting }] = useMutation(DELETE_DIRECTORY_GROUP);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState(new Set());

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

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

    const toggleSelection = (id: unknown) => {
        setSelectedGroups(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const handleDelete = async () => {
        if (selectedGroups.size === 0) return;
        alert('Confirm Deletion', 'Are you sure you want to delete selected groups?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', onPress: async () => {
                    console.log('Item id --->', Array.from(selectedGroups).map(Number));
                    try {
                        const { data } = await deleteGroup({ variables: { input: { group_ids: Array.from(selectedGroups).map(Number) } } });
                        if (data?.deleteDirectoryGroup?.success) {
                            alert('Success', 'Groups deleted successfully');
                            setIsDeleteMode(false);
                            setSelectedGroups(new Set());
                            refetch();
                        } else {
                            alert('Error', data?.deleteDirectoryGroup?.message || 'Deletion failed');
                        }
                    } catch (err) {
                        alert('Error', 'Something went wrong. Please try again.');
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
                <Text style={[styles.groupText, { fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(15), }]}>{item.name}</Text>
                <Text style={[styles.groupCount, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{item.count}</Text>
            </TouchableOpacity>
        )
    };

    const MainContent = (
        <View style={[styles.subcontainer, { width: getWidth(60), }]}>
            <View style={styles.header}>
                <Text style={[styles.allGroupsText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}>All Groups</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => setIsDeleteMode(!isDeleteMode)}>
                        {/* <Text style={styles.icon}>🗑️</Text> */}
                        <Image source={Icons.deleteGroup} resizeMode='contain' style={[styles.icon, {
                            height: config.isWeb ? getWidth(2) : 25,
                            width: config.isWeb ? getWidth(2) : 25,
                        }]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigationService.navigate(RouteNames.NewGroup)}>
                        <Image source={Icons.addGroup} resizeMode='contain' style={[styles.icon, {
                            height: config.isWeb ? getWidth(2) : 25,
                            width: config.isWeb ? getWidth(2) : 25,
                        }]} />
                    </TouchableOpacity>
                </View>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={commonColors.black} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}>Failed to load groups</Text>
                    {/* <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                        <Text style={[styles.retryText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Retry</Text>
                    </TouchableOpacity> */}
                </View>
            ) : transformedGroups.length === 0 ? (
                <View style={styles.noGroupsContainer}>
                    <Text style={[styles.noGroupsText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}>No groups found</Text>
                </View>
            ) : (
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
            )}
            {isDeleteMode && selectedGroups.size > 0 && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
                    <Text style={[styles.deleteButtonText, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>{deleting ? 'Deleting...' : 'Delete Selected Groups'}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout rightContent={MainContent} showSearch={false} />
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

        color: commonColors.black,
        textAlign: 'center'
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    icon: {

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

        color: commonColors.black,
        textAlign: 'left',
        marginLeft: config.getWidth(6),
    },
    groupCount: {
        fontFamily: 'regular',

        color: commonColors.black,
        textAlign: 'center',
        marginRight: config.getWidth(6),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(10)
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: config.getHeight(10)
    },
    errorText: {
        fontFamily: 'regular',

        color: commonColors.black,
        marginBottom: config.getHeight(2),
    },
    retryButton: {
        padding: config.getWidth(1),
        backgroundColor: backgroundColors.editProfile,
        borderRadius: config.getWidth(1),
    },
    retryText: {
        fontFamily: 'regular',
        color: commonColors.white,
    },
    deleteButton: {
        position: 'absolute',
        bottom: config.getHeight(1),
        left: config.getWidth(15),
        right: config.getWidth(15),
        padding: config.getWidth(1),
        backgroundColor: commonColors.red,
        alignItems: 'center',
        borderRadius: config.getWidth(2)
    },
    deleteButtonText: {
        fontFamily: 'regular',

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

export default GroupsWeb;
