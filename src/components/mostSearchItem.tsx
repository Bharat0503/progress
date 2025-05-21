import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import config from '../utils/config';
import { commonColors } from '../utils/colors';
import { useSelector } from 'react-redux';

const MostSearchItems = ({ title, searchItems, onItemClick }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions);

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

    const handleItemPress = (item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };

    return (
        <View style={[styles.container, {
            padding: config.isWeb ? getWidth(1) : config.getWidth(5),
            height: config.isWeb ? getHeight(40) : config.getHeight(25),
        }]}>
            <Text style={[styles.title, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{title}</Text>
            <FlatList
                data={searchItems}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <Text style={[styles.searchItem, {fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(15), width:config.isWeb ? getWidth(20) : config.getWidth(60)}]}>{item}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'bold',
        color: commonColors.black,
        marginBottom: 10,
    },
    searchItem: {
        color: '#A1A6B3',
        marginVertical: 5,
        fontFamily: 'regular',
        textAlign: 'center'
    },
});

export default MostSearchItems;
