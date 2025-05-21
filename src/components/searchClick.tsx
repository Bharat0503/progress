import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import config from '../utils/config';
import { borderColors, commonColors } from '../utils/colors';
import Icons from '../assets/icons';
import { useSelector } from 'react-redux';
import Analytics from '../services/Analytics';

interface SearchProps {
    filter?: boolean;
    onSelect?: (filter: string) => void | undefined;
    onSearch?: (search: string) => void | undefined;
}

const SearchClick: React.FC<SearchProps> = ({ filter, onSelect, onSearch }) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

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

    const handleSearchBarPress = () => {
        if (onSearch) {
            onSearch(searchText);
        }
        Analytics.logSearchEvent(searchText)
    };

    return (
        <View
            style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: config.isWeb ? getWidth(25) : config.getWidth(90),
                height: config.isWeb ? getHeight(8) : config.getHeight(7),
                flexDirection: 'row',
            }}>
            <View
                style={{
                    width: config.isWeb ? getWidth(20) : config.getWidth(75),
                    height: config.isWeb ? getHeight(6.5) : config.getHeight(7),
                    borderRadius: config.isWeb ? getWidth(1) : config.getWidth(4),
                    borderWidth: 1,
                    backgroundColor: commonColors.white,
                    borderColor: borderColors.signInBorder,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}>
                <TouchableWithoutFeedback onPress={handleSearchBarPress}>
                    <View
                        style={{
                            height: config.isWeb ? getHeight(2.5) : config.getHeight(6),
                            flex: 1,
                            borderRadius: config.isWeb ? getWidth(1.25) : config.getWidth(3),
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: 'transparent',
                        }}
                    >
                        {!searchText && (
                            <Text
                                style={{
                                    fontFamily: 'medium',
                                    fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16),
                                    color: '#A1A6B3',
                                    marginLeft: config.isWeb ? getWidth(5) : config.getWidth(5)
                                }}
                            >
                                Search
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
                <Image
                    style={{
                        width: config.isWeb ? getWidth(1.25) : config.getWidth(4),
                        height: config.isWeb ? getWidth(2.5) : config.getWidth(4),
                        marginHorizontal: config.isWeb ? getWidth(0.6) : config.getWidth(5),
                    }}
                    source={Icons.search}
                    resizeMode="contain"
                />
            </View>
            {filter && (
                <TouchableOpacity
                    onPress={() => {
                        setFilterVisible(!filterVisible);
                    }}>
                    <Image
                        style={{
                            width: config.isWeb ? getWidth(3) : config.getWidth(10),
                            height: config.isWeb ? getWidth(3) : config.getWidth(10),
                            marginHorizontal: config.isWeb ? getWidth(0.7) : config.getWidth(2),
                        }}
                        source={Icons.filter}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchClick;
