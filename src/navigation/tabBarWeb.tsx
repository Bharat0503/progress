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
const TabBarWeb: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
    // console.log("STATE", state.routes[3].params, navigation)

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
                const isActive = state.index === index;


                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabItem}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <Image
                            style={{ width: config.getWidth(2), height: config.getWidth(2) }}
                            source={route.params.icon}
                            tintColor={isActive ? tintColors.bottomTabIcon : commonColors.black}
                            resizeMode='contain'

                        />
                        <Text style={{ fontFamily: 'regular', fontSize: config.generateFontSizeNew(2.5), color: isActive ? tintColors.bottomTabIcon : commonColors.black }}>{route.params.displayName}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: config.getHeight(8),
        width: config.getWidth(20),
        position: 'absolute',
        left: config.getWidth(10),
        bottom: config.getHeight(8),

        borderWidth: 0.1,
        borderColor: borderColors.webBottomTab,
        borderRadius: config.getWidth(1),
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: commonColors.white
        // paddingVertical: config.getHeight(2),
        // backgroundColor: "red",
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        // overflow: 'hidden',
    },
});

export default TabBarWeb