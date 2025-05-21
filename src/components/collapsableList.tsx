import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import config from '../utils/config';
import { commonColors, textColors } from '../utils/colors';
import CollapsibleList from './collapsibleList';
import { useSelector } from 'react-redux';

interface ChannelContainerProps {
    subscribedSpaces?: any
    loadMoreData?: () => void
    isLoadingMore?: boolean
    seeMoreClick?: () => void
    spaceCount?: number
}

const ChannelContainer: React.FC<ChannelContainerProps> = ({ subscribedSpaces, loadMoreData, isLoadingMore, seeMoreClick, spaceCount }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
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

    useEffect(() => {

    }, [])

    return (
        subscribedSpaces.length !== 0
            ?
            <View style={{
                flex: 1, 
                maxHeight: subscribedSpaces.length > 5
                    ? config.getHeight(37.5)
                    : null, }}>
                <FlatList
                    data={subscribedSpaces}
                    keyExtractor={(item) => item?.id}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                        <CollapsibleList
                            lastitemName={subscribedSpaces[subscribedSpaces.length - 1]?.name}
                            key={item?.id}
                            title={item?.name}
                            color={item?.color}
                            spaceItem={item}
                        />
                    )}
                    style={[styles.mainContainer, { borderRadius: config.isWeb ? getWidth(2) : config.getWidth(4) }]}
                />
                {
                    spaceCount > subscribedSpaces.length
                        ?
                        <Text
                            onPress={() => {
                                seeMoreClick()
                            }}
                            style={{
                                color: textColors.chapterTileText,
                                fontFamily: 'regular',
                                fontSize: config.isWeb ? getFontSize(2.5) : config.generateFontSizeNew(12),
                                alignSelf: 'flex-end',
                                marginRight: getWidth(5),
                                marginVertical: config.isWeb ? getHeight(0.5) : config.getHeight(2)
                            }}
                        >
                            {'see more...'}
                        </Text>
                        : null
                }
            </View>
            : null
    );
};


export default ChannelContainer;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: commonColors.white,
        borderWidth: 1,
        borderColor: '#707070',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
