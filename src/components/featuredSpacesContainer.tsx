import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import config from '../utils/config';
import { borderColors, commonColors, textColors } from '../utils/colors';

type FeatureSpacesContainerProps = {
    text: string;
    imageUrl?: string;
    backgroundColor?: string;
    textColor?: string;
};

const FeatureSpacesContainer: React.FC<FeatureSpacesContainerProps> = ({
    text,
    imageUrl,
    backgroundColor = 'white',
    textColor = 'black',
}) => {
    // console.log("Image in FeatureSpacesContainer-->", imageUrl)
    const dimension = useSelector((state: any) => state.reducer.dimentions)

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

    return (
        <View style={{
            backgroundColor, borderRadius: config.isWeb ? getWidth(2) : config.getWidth(3),
            width: config.isWeb ? getWidth(11) : config.getWidth(25),
            height: config.isWeb ? getWidth(11) : config.getHeight(12),
            marginHorizontal: config.isWeb ? getWidth(0.75) : config.getWidth(3),
            marginVertical: config.isWeb ? getHeight(0.5) : config.getHeight(1),
            justifyContent: 'center', alignItems: 'center',
            borderColor: borderColors.spacesImage, borderWidth: 1,
        }}>
            {imageUrl ? (

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={{ uri: imageUrl }} resizeMode='contain' style={{
                        width: config.isWeb ? getWidth(10) : config.getWidth(24),
                        height: config.isWeb ? getWidth(10) : config.getHeight(11),
                        justifyContent: 'center', alignItems: "center",
                        padding: config.isWeb ? getWidth(5) : null,
                    }} />
                </View>
            ) : (
                <View style={{
                    width: config.isWeb ? getWidth(10) : config.getWidth(24.5),
                    height: config.isWeb ? getWidth(10) : config.getHeight(12),
                    justifyContent: 'center', alignItems: "center",

                }}>
                    <Text numberOfLines={2} style={{
                        color: textColors.spaceName,
                        fontFamily: 'regular',
                        // width: config.isWeb ? getWidth(10) : config.getWidth(24.5),
                        // height: config.isWeb ? getWidth(10) : config.getHeight(11),
                        fontSize: config.isWeb ? getFontSize(3) : getFontSize(16),
                        padding: config.isWeb ? getWidth(0.5) : getWidth(2),
                    }}>{text}</Text>
                </View>

            )}
        </View>
    );
};

const styles = StyleSheet.create({

});

export default FeatureSpacesContainer;
