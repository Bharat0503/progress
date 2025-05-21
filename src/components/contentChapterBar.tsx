import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Platform, PixelRatio } from 'react-native'
import config from '../utils/config'


import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import LogoText from './logoText'
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux'
import useFetchDimention from '../customHooks/customDimentionHook'
import { setCurrentTab } from '../redux/action'

interface ContentChapterBarProps {
    data?: any
    currentTime?: number
    changeChapter: (time: number) => void
}



const ContentChapterBar: React.FC<ContentChapterBarProps> = ({ data, currentTime, changeChapter }) => {
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

    const formatSeconds = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours === 0) {
            return [minutes, secs]
                .map(unit => String(unit).padStart(2, '0'))
                .join(':');
        }
        else {

            return [hours, minutes, secs]
                .map(unit => String(unit).padStart(2, '0'))
                .join(':');
        }
    }

    type ItemProps = { item: any };

    const Item = ({ item }: ItemProps) => (

        item?.time === currentTime
            ?


            <TouchableOpacity onPress={() => {
                changeChapter(item?.time)
            }} style={{
                justifyContent: 'center', alignItems: 'center',
                height: config.isWeb ? getHeight(10) : config.getHeight(10),
                borderRadius: config.isWeb ? getWidth(0.87) : config.getWidth(3.5),
                backgroundColor: backgroundColors.chapterTile,
                paddingHorizontal: config.isWeb ? getWidth(1) : config.getWidth(4),
                marginHorizontal: config.isWeb ? getWidth(0.25) : getWidth(1)
            }}>

                <Text style={[styles.chapterText, { color: textColors.chapterTileText, fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16) }]}>
                    {formatSeconds(item?.time)}
                </Text>
                <Text style={[styles.chapterText, { color: textColors.chapterTileText, fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16) }]}>
                    {item?.title}
                </Text>

            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => {
                changeChapter(item?.time)
            }} style={{
                justifyContent: 'center', alignItems: 'center',
                height: config.isWeb ? getHeight(10) : config.getHeight(10),
                borderRadius: config.isWeb ? getWidth(0.87) : config.getWidth(3.5),
                backgroundColor: backgroundColors.chapterTileNotSelected,
                paddingHorizontal: config.isWeb ? getWidth(1) : config.getWidth(4),
                marginHorizontal: config.isWeb ? getWidth(0.25) : getWidth(1)
            }}>

                <Text style={[styles.chapterText, { color: textColors.chapterTileTextNotSelected, fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16) }]}>
                    {formatSeconds(item?.time)}
                </Text>
                <Text style={[styles.chapterText, { color: textColors.chapterTileTextNotSelected, fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16) }]}>
                    {item?.title}
                </Text>

            </TouchableOpacity>
    );

    return (

        <View style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(60) : config.getWidth(100),
            height: config.isWeb ? getHeight(13) : config.getHeight(13),
            backgroundColor: config.isWeb ? null : commonColors.white,

            flexDirection: 'row',
            marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(2)
        }}>
            <FlatList
                data={data}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: config.isWeb ? getWidth(19.8) : config.getWidth(33), paddingRight: config.isWeb ? getWidth(0.5) : config.getWidth(2) }}
            />
        </View >


    )

}

const styles = StyleSheet.create({
    chapterText: {
        fontFamily: 'regular',
    }

})


export default ContentChapterBar