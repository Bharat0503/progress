import { PRIVACY_POLICY_URL } from '@/src/components/GlobalConstant';
import Header from '@/src/components/header';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const PrivacyScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header back={true} profile={false} />
            <WebView
                source={{ uri: PRIVACY_POLICY_URL }}
                style={styles.webView}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webView: {
        flex: 1,
    },
});

export default PrivacyScreen;
