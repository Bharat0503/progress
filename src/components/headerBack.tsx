import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from '../assets/icons';
import config from '../utils/config';
import navigationService from '../navigation/navigationService';
import { backgroundColors, borderColors } from '../utils/colors';

interface HeaderProps {
    title?: string;
    onBackPress?: () => void;
    backgroundColor?: string;
    rightComponent?: React.ReactNode;
    border?: boolean;
}

const HeaderBack: React.FC<HeaderProps> = ({
    title,
    onBackPress,
    rightComponent,
    backgroundColor,
    border,
}) => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigationService.goBack();
        }
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: backgroundColor || backgroundColors.offWhite },
            ]}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: backgroundColor || '#ffffff',
                        borderBottomWidth: border ? 1 : 0,
                        borderBottomColor: border ? borderColors.profileImage : 'transparent',
                    },
                ]}
            >
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Image source={Icons.backIcon} style={styles.backIcon} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
            </View>
        </SafeAreaView>
    );
};

export default HeaderBack;

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? config.getHeight(7) : config.getHeight(7),
    },
    backButton: {
        marginLeft: config.getWidth(5),
    },
    backIcon: {
        width: config.getWidth(5),
        height: config.getHeight(2),
    },
    title: {
        flex: 1,
        textAlign: 'left',
        fontSize: config.generateFontSizeNew(24),
        fontFamily: 'regular',
        color: '#000000',
        marginLeft: config.getWidth(4),
    },
    rightComponent: {
        marginRight: config.getWidth(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
