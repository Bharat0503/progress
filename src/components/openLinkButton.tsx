import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert, StyleProp, ViewStyle, TextStyle } from 'react-native';
import config from '../utils/config';
import { textColors } from '../utils/colors';
import alert from '../utils/alert';
import { useSelector } from 'react-redux';

interface OpenArticleLinkButtonProps {
    url: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const OpenArticleLinkButton: React.FC<OpenArticleLinkButtonProps> = ({
    url,
    style,
    textStyle
}) => {
    console.log('urlurlurlurlurlurl' + url);
    const dimension = useSelector((state: any) => state.reducer.dimentions);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    };

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
    };

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

    const handlePress = async (): Promise<void> => {
        try {
            if (config.isWeb) {
                // Open in a new tab on Web
                window.open(url, '_blank');
            } else {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    alert("Error", "Cannot open this URL", [{ text: "OK" }]);
                }
            }
        } catch (error) {
            alert("Error", "An error occurred while opening the URL", [{ text: "OK" }]);
        }
    };


    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Text style={[styles.buttonText, textStyle, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14), }]}>Open Link</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        paddingVertical: config.getHeight(1),
        paddingHorizontal: config.getWidth(3),
        borderRadius: config.getWidth(5),
        borderWidth: 1,
        borderColor: textColors.chapterTileText,
        marginVertical: config.getHeight(2)
    },
    buttonText: {
        color: '#4A4A4A',

        fontFamily: 'bold',
        textAlign: 'center',
    },
});

export default OpenArticleLinkButton;