import React, { } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
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

interface ContentActivityBarProps {
    isLiked: boolean
    isFav: boolean
    toggleLike: () => void
    toggleFav: () => void
    scrollToBottom: () => void
    onShare: () => void
}



const ContentActivityBar: React.FC<ContentActivityBarProps> = ({ isLiked, isFav, toggleLike, toggleFav, scrollToBottom, onShare }) => {


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
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(55) : getWidth(90),
            height: config.isWeb ? getViewHeight(8) : getHeight(4),
            flexDirection: 'row'
        }}>
            <TouchableOpacity onPress={() => {
                toggleLike()
            }}>
                <Image
                    style={[{
                        width: config.isWeb ? getWidth(2) : config.getWidth(5),
                        height: config.isWeb ? getWidth(2) : config.getWidth(5),
                        marginHorizontal: config.isWeb ? getWidth(0.5) : getWidth(2),
                    }, {}]}
                    source={isLiked ? Icons.contentLiked : Icons.contentLike}
                    resizeMode='contain'

                />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
                scrollToBottom()
            }}>
                <Image
                    style={{
                        width: config.isWeb ? getWidth(2) : config.getWidth(5),
                        height: config.isWeb ? getWidth(2) : config.getWidth(5),
                        marginHorizontal: config.isWeb ? getWidth(0.5) : getWidth(2),
                    }}
                    source={Icons.contentComment}
                    resizeMode='contain'

                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                toggleFav()
            }}>
                {
                    isFav ?

                        <Image
                            style={[{
                                width: config.isWeb ? getWidth(2.4) : config.getWidth(6),
                                height: config.isWeb ? getWidth(2.4) : config.getWidth(6),
                                marginHorizontal: config.isWeb ? getWidth(0.5) : getWidth(2),
                            }, {

                            }]}
                            source={Icons.favTick}
                            resizeMode='cover'

                        />
                        :
                        <Image
                            style={[{
                                width: config.isWeb ? getWidth(2) : config.getWidth(5),
                                height: config.isWeb ? getWidth(2) : config.getWidth(5),
                                marginHorizontal: config.isWeb ? getWidth(0.5) : getWidth(2),
                            }, {

                            }]}
                            source={Icons.contentDownload}
                            resizeMode='contain'

                        />
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                onShare()
            }}>



                <Image
                    style={{
                        width: config.isWeb ? getWidth(2) : config.getWidth(5),
                        height: config.isWeb ? getWidth(2) : config.getWidth(5),
                        marginHorizontal: config.isWeb ? getWidth(0.5) : getWidth(2),
                    }}
                    source={Icons.contentShare}
                    resizeMode='contain'

                />
            </TouchableOpacity>



        </View >


    )

}

const styles = StyleSheet.create({

})


export default ContentActivityBar