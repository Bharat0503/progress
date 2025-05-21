import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { backgroundColors, commonColors, textColors, tintColors } from '../utils/colors';
import config from '../utils/config';
import Icons from '../assets/icons';
import RouteNames from './routes';
import navigationService from './navigationService';

type TabBarProps = {
    state: any;
    descriptors: any;
    navigation: any;
};

const CustomDrawerContent: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {

    const handleLinkPress = (link: string) => {
        switch (link) {
            case 'Change Speciality':
                alert('Change Speciality');
                break;
            case 'Notifications':
                alert('Notifications');
                break;
            case 'My Collection':
                alert('My Collection');
                break;
            case 'Favorites':
                navigationService.navigate(RouteNames.Favorites);
                break;
            case 'History':
                navigationService.navigate(RouteNames.History);
                break;
            case 'Saved Content':
                alert('Saved Content');
                break;
            case 'Subscribed Space':
                navigationService.navigate(RouteNames.SpaceNavigator);
                break;
            case 'Downloads':
                navigationService.navigate(RouteNames.Downloads);
                break;
            case 'Account Settings':
                alert('Account Settings');
                break;
            case 'About':
                alert('About');
                break;
            case 'Feedback':
                alert('Have feedback or suggestions? Reach out to us at Info@globalcastmd.com. We appreciate hearing from you!');
                break;
            case 'Terms and condition':
                navigationService.navigate(RouteNames.TermsConditionsScreen);
                break;
            case 'Privacy policy':
                navigationService.navigate(RouteNames.PrivacyScreen);
                break;
            case 'Refer & Earn':
                alert('Refer & Earn');
                break;
            case 'Grant & Donate':
                alert('Grant & Donate');
                break;
            case 'Are you interested in a space?':
                navigationService.navigate(RouteNames.SpaceCreation);
                break;
            default:
                break;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: commonColors.white }}>
            <TouchableOpacity onPress={() => navigationService.closeDrawer()} style={{ marginTop: config.isWeb ? config.getHeight(3) : config.getHeight(5), height: config.isWeb ? config.getHeight(4) : config.getHeight(8), width: config.isWeb ? config.getWidth(5) : config.getWidth(10), justifyContent: 'center', alignItems: 'flex-start', paddingLeft: config.isWeb ? config.getWidth(0.5) : config.getWidth(2) }}>
                <Image
                    style={{ height: config.getHeight(2.5), width: config.getWidth(4) }}
                    source={Icons.backArrow}
                    resizeMode='contain'

                />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.drawerContainer}>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Speciality:{'\n'}Pediatric Care</Text>
                    {[
                        'Change Speciality',
                         'Notifications',//phase2
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.link}
                            onPress={() => handleLinkPress(item)}
                        >
                            <Text style={styles.linkText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View> */}


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Library:</Text>
                    {[
                        // 'My Collection',
                        'Favorites',
                        // 'History',
                        // 'Saved Content',
                        'Subscribed Space',
                        'Downloads',
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.link}
                            onPress={() => handleLinkPress(item)}
                        >
                            <Text style={styles.linkText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional:</Text>
                    {[
                        // 'Account Settings',
                        // 'About',
                        'Feedback',
                        'Terms and condition',
                        'Privacy policy',
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.link}
                            onPress={() => handleLinkPress(item)}
                        >
                            <Text style={styles.linkText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefit & Support:</Text>
                    {[
                        'Refer & Earn $',
                        'Grant & Donate',
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.link}
                            onPress={() => handleLinkPress(item)}
                        >
                            <Text style={styles.linkText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View> */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Request Access:</Text>
                    {[
                        'Are you interested in a space?',
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.link}
                            onPress={() => handleLinkPress(item)}
                        >
                            <Text style={styles.linkText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View >

    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flexGrow: 1,
        padding: 20,
        // backgroundColor: '#f8f9fa',
    },
    section: {
        marginBottom: config.isWeb ? config.getHeight(1) : config.getHeight(4),
    },
    sectionTitle: {
        fontSize: config.isWeb ? config.generateFontSizeNew(3.5) : config.generateFontSizeNew(16),
        fontFamily: 'bold',
        color: textColors.drawerHeader,
        marginBottom: config.getHeight(3),
    },
    speciality: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 15,
    },
    link: {
        marginVertical: config.getHeight(0.3),
        marginLeft: config.isWeb ? config.getWidth(3) : config.getWidth(3)
    },
    linkText: {
        fontSize: config.isWeb ? config.generateFontSizeNew(3.5) : config.generateFontSizeNew(16),
        fontFamily: 'regular',
        color: textColors.drawerSubHeader,
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    screenText: {
        fontSize: 20,
        color: '#333',
    },
});

export default CustomDrawerContent