import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashBoard: React.FC = (props) => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: config.generateFontSizeNew(20) }}>
                DASHBOARD
            </Text>
            <TouchableOpacity onPress={() => {
                navigationService.navigate(RouteNames.Splash, { animation: true })
                AsyncStorage.removeItem(keys.userToken)
                AsyncStorage.removeItem(keys.userId)

            }} style={styles.logoutTextContainer}>
                <Text style={styles.logoutText}>
                    Logout
                </Text>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    logoutText: {
        color: commonColors.white,
        fontSize: config.isWeb ? config.generateFontSizeNew(3.5) : config.generateFontSizeNew(18),
        fontFamily: 'regular',
        zIndex: -1,
    },
    logoutTextContainer: {
        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -2,
        width: config.isWeb ? config.getWidth(8) : config.getWidth(40),
        height: config.isWeb ? config.getHeight(5) : config.getHeight(7),
        backgroundColor: backgroundColors.signInButton,
        marginTop: config.getHeight(4),
        marginBottom: config.getHeight(4)
    }
})



export default DashBoard