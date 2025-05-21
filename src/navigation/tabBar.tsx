import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { backgroundColors, borderColors, commonColors, tintColors } from '../utils/colors';
import config from '../utils/config';
import Icons from '../assets/icons';
import React from 'react';

type TabBarProps = {
    state: any;
    descriptors: any;
    navigation: any;
};
const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
    // console.log("STATE", state.routes[3].params, navigation)

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
                const isActive = state.index === index;
                const handlePress = () => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: route.name }],
                    });
                };
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabItem}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: route.name }],
                        })}
                    >
                        <Image
                            style={{ width: config.getWidth(7), height: config.getWidth(7) }}
                            source={route.params.icon}
                            tintColor={isActive ? tintColors.bottomTabIcon : commonColors.black}
                            resizeMode='contain'

                        />
                        <Text style={{ textAlign: 'center', fontFamily: 'regular', fontSize: config.generateFontSizeNew(13), color: isActive ? tintColors.bottomTabIcon : commonColors.black }}>{route.params.displayName}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        height: config.getHeight(12),
        backgroundColor: backgroundColors.offWhite,
        borderWidth: 0.5,
        borderColor: borderColors.lightGray,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: config.getHeight(2),
        paddingHorizontal: config.getWidth(12)
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink'
    },
});

export default TabBar