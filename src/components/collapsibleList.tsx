import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../utils/config';
import { GET_SPACE_INFO_BY_ID } from '../services/QueryMethod';
import { useLazyQuery, useQuery } from '@apollo/client';
import navigationService from '../navigation/navigationService';
import { setCurrentTab, setSelectedSpaceHomeDashboard, setSpace } from '../redux/action';
import RouteNames from '../navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import ContentIcon from './atoms/contentIcon/contentIcon';
import { borderColors, commonColors } from '../utils/colors';
import Icons from '../assets/icons';
import ContentType from '../utils/contentTypeIds';


interface CollapsibleListProps {
    spaceItem: any;
    title: string;
    lastitemName?: string
    content?: Array<{ id: string; name: string; icon: JSX.Element }>;
    color: string
}


const CollapsibleList: React.FC<CollapsibleListProps> = ({ spaceItem, title, lastitemName, content, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const selectedSpace = useSelector((state: any) => state.reducer.homeDashboardSpace)
    const [featuredContentData, setFeaturedContentData] = useState<any>(null)
    const [isloading, setLoading] = useState(true)

    const [getSpaceInfo] = useLazyQuery(GET_SPACE_INFO_BY_ID, {
        fetchPolicy: "network-only",
    });

    const getFontSize = (size: number) => {


        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {

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
            if (dimension?.height > 820) {
                return dimension.height * (height / 100)
            }
            else {
                return 820 * (height / 100)
            }
        }
        else {
            return dimension.height * (height / 100)
        }
    }

    const handleFeatureClick = (item: any) => {
        let space = {
            id: item?.id,
            logo: item?.imageUrl,
            name: item?.name,
        }
        dispatch(setSpace(space))
        if (config.isWeb) {
            navigationService.navigate(RouteNames.SpaceDashBoard)
            dispatch(setCurrentTab("Spaces"))
        }
        else {
            navigationService.navigate(RouteNames.SpaceNavigator, { screen: RouteNames.SpaceDashBoard });
        }

    }

    useEffect(() => {

        const init = async () => {
            console.log('selectedSpace?.idselectedSpace?.id' + selectedSpace?.id);
            if (selectedSpace?.id !== undefined) {
                console.log('undefinedundefinedundefined');

                const getSpaceInfoResponse = await getSpaceInfo({
                    variables: {
                        input: {
                            space_id: selectedSpace?.id
                        }
                    }
                }
                )
                const space_cards_info = getSpaceInfoResponse?.data?.getSpaceInfoById?.spaceInfo?.space_cards
                console.log('space_cards_infospace_cards_info' + JSON.stringify(space_cards_info));

                for (let key in space_cards_info) {
                    if (space_cards_info[key]?.name === "Featured Content") {

                        const associate_content = space_cards_info[key]?.associated_content_types

                        const associatedContentTypes = []
                        for (let i in associate_content) {


                            const content = {
                                content_type_id: associate_content[i]?.id,
                                card_id: space_cards_info[key]?.id,
                                space_id: selectedSpace?.id,
                                title: associate_content[i]?.name,
                                icon: associate_content[i]?.content_icon,

                            }


                            associatedContentTypes.push(content)
                        }

                        const content = {
                            content_type_id: ContentType.DIRECTORY,
                            card_id: null,
                            space_id: selectedSpace?.id,
                            title: "Directory",
                            icon: Icons.contentDirectory,

                        }

                        associatedContentTypes.push(content)
                        setFeaturedContentData(associatedContentTypes)


                    }

                }
                setLoading(false)
            }

        }
        init()
    }, [selectedSpace])


    return (
        <View style={lastitemName === title ? [styles.container, { width: config.isWeb ? getWidth(50) : config.getWidth(85) }] : [styles.container, { width: config.isWeb ? getWidth(50) : config.getWidth(85), borderBottomWidth: 0.5 }]}>
            <TouchableOpacity
                style={[styles.header, {
                    paddingVertical: config.isWeb ? getWidth(1) : config.getWidth(5),
                    paddingHorizontal: config.isWeb ? getWidth(1) : config.getWidth(8),
                    marginBottom: isOpen ? config.getHeight(2) : config.getHeight(0),
                    borderBottomWidth: selectedSpace?.id === spaceItem?.id ? 0.5 : 0,
                    borderBottomColor: lastitemName === title ? borderColors.profileImage : "",

                }]}
                onPress={() => {

                    if (selectedSpace?.id === spaceItem?.id) {
                        setFeaturedContentData(null)

                        dispatch(setSelectedSpaceHomeDashboard(null))


                    }
                    else {
                        setFeaturedContentData(null)
                        setLoading(true)

                        let space = {
                            id: spaceItem?.id,
                            logo: spaceItem?.logo_path,
                            title: spaceItem?.name,
                        }
                        dispatch(setSelectedSpaceHomeDashboard(space))

                    }

                }}
            >
                <Text style={[styles.title, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16) }]}>{title}</Text>
                <Icon
                    style={{
                        position: 'absolute',
                        right: config.getWidth(3),
                    }}
                    name={selectedSpace?.id === spaceItem?.id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#000"
                />
            </TouchableOpacity>
            {


                selectedSpace?.id === spaceItem?.id && (

                    !isloading ?

                        <View style={styles.contentContainer}>

                            <FlatList
                                scrollEnabled={false}
                                data={featuredContentData}
                                keyExtractor={(item) => item?.id}
                                numColumns={3}
                                style={{ marginVertical: config.isWeb ? getHeight(0.2) : config.getHeight(2), }}
                                extraData={featuredContentData}
                                renderItem={({ item, index }) => <ContentIcon spaceColor={color} item={item} lastRow={index >= featuredContentData.length - 4} />}
                                contentContainerStyle={{}}
                            />

                            <TouchableOpacity style={[styles.spaceHomePage, {}]} onPress={async () => {
                                handleFeatureClick(spaceItem)
                            }}>
                                <View style={{
                                    height: config.isWeb ? getHeight(4) : config.getHeight(4),
                                    width: config.isWeb ? getWidth(20) : config.getWidth(60),
                                    backgroundColor: color, justifyContent: 'center', alignItems: 'center',
                                    marginBottom: config.isWeb ? getHeight(1) : config.getHeight(2),
                                    borderRadius: config.isWeb ? getHeight(2) : config.getHeight(2),
                                }}>
                                    <Text style={[styles.spaceHomeText, {
                                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                    }]}>
                                        Space Homepage
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        :

                        <View style={[styles.loaderContainer, {
                            width: config.getWidth(20),
                            height: config.getWidth(20),
                        }]}>
                            <ActivityIndicator />
                        </View>


                )
            }
        </View>
    );
};

export default CollapsibleList
const styles = StyleSheet.create({
    spaceHomePage: {

        justifyContent: 'center',
        alignItems: 'center',

    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    spaceHomeText: {
        color: commonColors.white,
        fontFamily: 'bold',
        textAlign: 'center',

    },
    container: {
        overflow: 'hidden',
        borderBottomColor: '#707070',

    },
    openContainer: {
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: config.getWidth(20),
        height: config.getHeight(9),
        borderRadius: config.getWidth(4),
        borderWidth: 1,
        borderColor: '#AD63A7',
    },
    title: {
        fontFamily: 'bold',
        textAlign: 'center',
        color: 'black',
        flex: 1,
    },
    contentContainer: {
        marginHorizontal: config.getWidth(2.5)
    },

    itemIcon: {
        width: config.getWidth(10),
        height: config.getHeight(10),

    },
    itemText: {
        marginTop: 5,
        fontSize: config.generateFontSizeNew(16),
        textAlign: 'center',
        color: '#000',
        fontFamily: 'regular'
    },
});