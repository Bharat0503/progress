import React, { } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import config from '../utils/config'
import { borderColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { useDispatch, useSelector } from 'react-redux'
import { setInfographicImageLink } from '../redux/action'


interface InfographicImageDisplayProps {
    data: any
}



const InfographicImageDisplay: React.FC<InfographicImageDisplayProps> = ({ data }) => {


    const dimension = useSelector((state: any) => state.reducer.dimentions)

    const dispatch = useDispatch()

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
            width: config.isWeb ? getViewWidth(55) : config.getWidth(90),
            height: config.isWeb ? getViewWidth(40) : config.getHeight(40),
            // backgroundColor: 'pink',
            marginVertical: config.isWeb ? getHeight(1) : config.getHeight(2),
            borderRadius: config.isWeb ? getWidth(0.88) : config.getWidth(3.5),
            borderWidth: 1, borderColor: borderColors.infographicFile
        }}>
            <ImageBackground
                source={{ uri: data?.file }}
                style={{
                    width: config.isWeb ? getViewWidth(54) : getWidth(89.5),
                    height: config.isWeb ? getViewWidth(39) : getHeight(39.5),
                    overflow: 'hidden',
                    //backgroundColor: 'pink',
                    borderRadius: config.isWeb ? getWidth(0.88) : getWidth(3.5),
                }}
                resizeMode='stretch'

            >
                <TouchableOpacity onPress={() => {
                    dispatch(setInfographicImageLink(data?.file))
                    navigationService.navigate(RouteNames.ContentInfographicImage)
                }}>
                    <Image
                        style={{
                            width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                            height: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                            alignSelf: 'flex-end',
                            marginRight: config.isWeb ? getWidth(0.5) : config.getWidth(2),
                            marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(1)
                        }}
                        source={Icons.infographicExpand}
                        resizeMode='contain'

                    />
                </TouchableOpacity>



            </ImageBackground>



        </View >


    )

}

const styles = StyleSheet.create({







})


export default InfographicImageDisplay