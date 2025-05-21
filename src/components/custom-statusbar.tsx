import React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';

interface CustomStatusBarProps {
    translucent?: boolean;
    backgroundColor?: string;
    barStyle?: StatusBarStyle;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
    translucent = false,
    backgroundColor = '#f8f8f8',
    barStyle = 'dark-content',
}) => (
    <StatusBar
        translucent={translucent}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
    />
);

export default CustomStatusBar;
