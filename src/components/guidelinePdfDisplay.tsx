import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import config from '../utils/config'


import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'


import { useDispatch, useSelector } from 'react-redux'

import { setGuidelinePdfLink } from '../redux/action'
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native'

interface GuidelinePdfDisplayProps {
    data: any
}

const GuidelinePdfDisplay: React.FC<GuidelinePdfDisplayProps> = ({ data }) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const webViewRef = useRef(null);
    const isFocused = useIsFocused()
    const dispatch = useDispatch()

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
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
    //  console.log("fileURl", data?.file)
    useEffect(() => {
        if (config.isIOS) {
            webViewRef?.current?.reload();
        }

        return (() => {

        })
    }, [isFocused])

    const isPptx = (str: string) => {
        const pptxPattern = /\.pptx$/i;  // Regular expression to match .pptx (case-insensitive)
        return pptxPattern.test(str);
    };

    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getWidth(55) : config.getWidth(90),
            height: config.isWeb ? getHeight(60) : config.getHeight(40),
            marginVertical: config.isWeb ? getHeight(1) : config.getHeight(2),
            borderRadius: config.isWeb ? getWidth(0.88) : config.getWidth(3.5),
            borderWidth: 1, borderColor: borderColors.infographicFile
        }}>


            {config.isWeb ? (
                <iframe
                    allowFullScreen
                    src={data?.file ?
                        isPptx(data?.file)
                            ?
                            `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data?.file)}`
                            : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.file)}`
                        : ''}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                        overflow: 'auto',
                    }}
                />
            ) : (

                <WebView
                    ref={webViewRef}
                    source={Platform.OS === 'ios' ? { uri: data?.file ?? '' } : { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.file)}` }}
                    style={{
                        width: config.getWidth(84),
                        height: config.getHeight(30),
                        overflow: 'hidden',
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    setSupportMultipleWindows={false}

                />
            )}
            {Platform.OS === 'web' ? null :
                <TouchableOpacity onPress={() => {
                    // setRefresh(!refresh)
                    dispatch(setGuidelinePdfLink(config?.isIOS ? data?.file ?? '' : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.file)}`))
                    navigationService.navigate(RouteNames.ContentGuidelinePdf)
                }}
                    style={{ position: 'absolute', right: config.getWidth(2), top: config.getHeight(1) }}
                >
                    <Image
                        style={{ width: config.getWidth(5), height: config.getWidth(5), alignSelf: 'flex-end', marginRight: config.getWidth(2), marginTop: config.getHeight(1) }}
                        source={Icons.infographicExpand}
                        resizeMode='contain'

                    />
                </TouchableOpacity>
            }


        </View >


    )

}

const styles = StyleSheet.create({

})


export default GuidelinePdfDisplay