import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Dimensions, FlatList, Image } from 'react-native';
import Icons from '../assets/icons';
import config from '../utils/config';
import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors';
import { useSelector } from 'react-redux';

interface ExpandableButtonProps {
    isDefaultIsExpanded: boolean;
    isAllowExpandCollaps: boolean;
    isExpandTopView: boolean;
    title: string;
    data: { id: string; items: string[] }[];
    onPressExpandIcon: (isExpanded: boolean) => void;
    onItemPress: (item: string) => void;
    onTextClick: (item: string) => void;
    onListItemPress: (sectionId: string, itemId: string | number) => void;
}

const ExpandableButton: React.FC<ExpandableButtonProps> = ({
    title,
    data,
    onPressExpandIcon,
    isDefaultIsExpanded = false,
    isAllowExpandCollaps = true,
    isExpandTopView = false,
    onItemPress,
    onTextClick,
    onListItemPress
}) => {
    const [isExpanded, setIsExpanded] = useState(isDefaultIsExpanded);
    const dimension = useSelector((state: any) => state.reducer.dimentions);

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
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

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    }

    useEffect(() => {
        setIsExpanded(isDefaultIsExpanded);
    }, [isDefaultIsExpanded]);

    const toggleExpand = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        if (!newExpandedState) {
            onPressExpandIcon(false);
        }
    };

    const toggleExpandTopView = () => {
        onPressExpandIcon(!isExpandTopView);
    };


    const renderFixedGrid = (item: { id: string; items: { name: string; icon: any }[] }, tintColor: any) => {

        const gridItems = item.items.slice(0, 4);


        while (gridItems.length < 4) {
            gridItems.push(null);
        }

        return (
            <View style={[styles.fixedGridContainer, { marginVertical: config.isWeb ? getHeight(5) : config.getHeight(2), }]}>

                <View style={[styles.gridRow, { height: config.isWeb ? getHeight(11) : config.getHeight(7), marginTop: config.isWeb ? getHeight(1) : config.getHeight(2) }]}>

                    {renderGridItem(gridItems[0], 0, tintColor)}

                    {renderGridItem(gridItems[1], 1, tintColor)}
                </View>


                <View style={[styles.gridRow, {
                    height: config.isWeb ? getHeight(12) : config.getHeight(7),
                    marginTop: config.isWeb ? getHeight(12) : config.getHeight(6),
                }]}>

                    {renderGridItem(gridItems[2], 2, tintColor)}

                    {renderGridItem(gridItems[3], 3, tintColor)}
                </View>
            </View>
        );
    };


    const renderGridItem = (item, index, tintColor) => {
        if (!item) return <View style={styles.gridCell} />;
        return (
            <View style={[styles.gridCell, {
                //backgroundColor: 'pink',
                padding: config.isWeb ? getWidth(1) : config.getWidth(1)
            }]}>
                <TouchableOpacity
                    style={[styles.gridItemContent, {
                    }]}
                    onPress={() => onItemPress(item.name)}
                >
                    <View style={[styles.iconWrapper, {

                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: config.isWeb ? getWidth(1) : config.getWidth(6),
                        backgroundColor: backgroundColors.content,
                        borderWidth: 1,
                        borderColor: commonColors.black,
                        borderRadius: config.isWeb ? getWidth(0.5) : getWidth(3),
                        marginBottom: config.isWeb ? getHeight(2) : getHeight(0.5), 

                    }]}>
                       
                            <Image
                                source={item.icon}
                                style={{
                                    width: config.isWeb ? getWidth(5) : config.getWidth(10),
                                    height: config.isWeb ? getWidth(5) : config.getHeight(9.5),
                                }}
                                resizeMode="contain"
                            />
                        
                       
                    </View>
                    <Text
                        //numberOfLines={1}
                        style={[styles.gridItemTitle, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(13), }]}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };


    const renderListItem = (item: { id: string; items: { id: any; image: any }[] }, tintColor: any) => {
        const hasData = item.items && item.items.length > 0;

        return (
            <View style={styles.listItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.rowTitle, { fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(14) }]}>
                        {item.id}
                    </Text>
                    {hasData && (
                        <TouchableOpacity onPress={() => onTextClick(item.id)}>
                            <Text style={[styles.seeall, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14) }]}>
                                {'See All'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.horizontalScroll}>
                    {hasData ? (
                        item.items.slice(0, 4).map((boxItem, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.listItemBox,
                                    {
                                        width: config.isWeb ? getWidth(8) : config.getWidth(18.5),
                                        height: config.isWeb ? getWidth(8) : config.getHeight(9),
                                        borderRadius: config.isWeb ? getWidth(2) : config.getWidth(5),
                                    },
                                ]}
                                onPress={() => onListItemPress(item.id, boxItem.id.toString())}
                            >
                                <Image
                                    source={boxItem.image ? { uri: boxItem.image } : Icons.contentThumbnail}
                                    style={{
                                        width: config.isWeb ? getWidth(6) : config.getWidth(14),
                                        height: config.isWeb ? getWidth(6) : config.getHeight(14),
                                        borderRadius: getWidth(1),
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ color: 'black', fontFamily: 'regular' }}>{'No data available.'}</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, {
            width: isExpandTopView ? config.isWeb ? getWidth(50) : config.getWidth(95) : config.isWeb ? getWidth(40) : config.getWidth(85),
            borderRadius: config.isWeb ? getWidth(2) : config.getWidth(5),
        }]}>
            <TouchableOpacity
                style={styles.headerButton}
                onPress={isAllowExpandCollaps ? toggleExpand : undefined}
            >
                <Text style={[styles.headerTitle, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{title}</Text>
                {isExpanded && (
                    <TouchableOpacity
                        style={[styles.expandIconButton, { marginLeft: isExpandTopView ? config.isWeb ? getWidth(42) : config.getWidth(82) : config.isWeb ? getWidth(32) : config.getWidth(70) }]}
                        onPress={toggleExpandTopView}
                    >
                        <Image
                            source={!isExpandTopView ? Icons.expandedIcon : Icons.collapseIcon}
                            style={!isExpandTopView ? {
                                width: config.isWeb ? getWidth(6) : config.getWidth(10),
                                height: config.isWeb ? getHeight(6) : config.getHeight(10),
                            } : {
                                width: config.isWeb ? getWidth(5) : config.getWidth(6),
                                height: config.isWeb ? getHeight(5) : config.getHeight(6),
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {isExpanded && (
                <>
                    <View style={styles.separator} />
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) =>
                            !isExpandTopView ? renderFixedGrid(item, borderColors.profileImage) : renderListItem(item, borderColors.profileImage)
                        }
                        contentContainerStyle={[styles.contentContainer, { padding: config.isWeb ? getHeight(3) : config.getWidth(5), }]}
                        scrollEnabled={false}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: commonColors.white,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
    },
    headerButton: {
        height: config.getHeight(7),
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'bold',
        textAlign: 'center',
        color: 'black',
        flex: 1,
    },
    expandIconButton: {
        position: 'absolute',
    },
    separator: {
        height: config.getHeight(0.2),
        backgroundColor: borderColors.profileImage,
    },
    contentContainer: {

    },

    fixedGridContainer: {
        width: '100%',

    },
    gridRow: {
        flexDirection: 'row',
        width: '100%',

        marginBottom: config.getHeight(2),
    },
    gridCell: {
        width: '50%',
        height: '100%',
    },
    gridItemContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        // width: config.isWeb ? '60%' : config.getWidth(23),
        // height: config.isWeb ? '60%' : config.getHeight(8),
        //borderWidth: 1,
        //borderRadius: config.getWidth(3.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    gridIcon: {
        width: '70%',
        height: '70%',
    },
    gridItemTitle: {
        fontFamily: 'regular',
        textAlign: 'center',
        color: textColors.spaceName,
    },
    listItemContainer: {
        marginBottom: config.getHeight(2),
    },
    horizontalScroll: {
        paddingRight: config.getWidth(0),
        flexDirection: 'row',
        alignItems: 'center'
    },
    listItemBox: {
        backgroundColor: commonColors.white,
        borderWidth: 1,
        borderColor: borderColors.profileImage,
        marginRight: config.getWidth(3),
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowTitle: {
        fontFamily: 'bold',
        textAlign: 'left',
        color: commonColors.black,
        flex: 1,
        marginBottom: config.getHeight(1),
    },
    seeall: {
        fontFamily: 'regular',
        textAlign: 'right',
        color: textColors.signUp,
        flex: 1,
        marginBottom: config.getHeight(1),
    },
});

export default ExpandableButton;