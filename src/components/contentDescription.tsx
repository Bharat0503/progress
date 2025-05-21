import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors';
import config from '../utils/config';
import { stripHtmlTags } from './GlobalConstant';

interface ContentDescriptionProps {
    description: string;
}

const ContentDescription: React.FC<ContentDescriptionProps> = ({ description }) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
    const [expanded, setExpanded] = useState<boolean>(false);

    const getFontSize = (size: number) =>
        (dimension.width / 320) * size;

    const getWidth = (width: number) =>
        config.isWeb ? dimension.width * (0.4 * width / 100) : dimension.width * (width / 100);

    const getHeight = (height: number) =>
        config.isWeb ? dimension.height * (0.4 * height / 100) : dimension.height * (height / 100);

    // Define two different max-heights based on expanded state.
    const collapsedMaxHeight = config.isWeb ? getHeight(60) : getHeight(10); // fixed height when not expanded
    const expandedMaxHeight = config.isWeb ? getHeight(100) : getHeight(20); // taller height when expanded

    const isDescriptionLong = description?.length > 300;

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: config.isWeb ? getWidth(140) : getWidth(90),
                marginVertical: getHeight(2),
                borderRadius: getWidth(3.5),
                borderColor: borderColors.signInBorder,
                borderWidth: 1,
                overflow: 'hidden',
            }}
        >
            <View
                style={{
                    width: config.isWeb ? getWidth(120) : getWidth(80),
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    marginVertical: getHeight(1),
                }}
            >
                <Text
                    style={{
                        color: commonColors.black,
                        fontFamily: 'bold',
                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14),
                    }}
                >
                    Description
                </Text>
                <ScrollView
                    style={{
                        maxHeight: isDescriptionLong ? (expanded ? expandedMaxHeight : collapsedMaxHeight) : undefined,
                    }}
                    nestedScrollEnabled
                >
                    <Text
                        style={{
                            color: textColors.spaceName,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(12),
                            marginTop: getHeight(2),
                        }}
                    >
                        {stripHtmlTags(description)}
                    </Text>
                </ScrollView>
            </View>
            {isDescriptionLong && (
                <Text
                    onPress={() => setExpanded(!expanded)}
                    style={{
                        color: textColors.chapterTileText,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(2.5) : config.generateFontSizeNew(12),
                        alignSelf: 'flex-end',
                        marginRight: getWidth(5),
                    }}
                >
                    {expanded ? 'see less...' : 'see more...'}
                </Text>
            )}
        </View>
    );
};

export default ContentDescription;
