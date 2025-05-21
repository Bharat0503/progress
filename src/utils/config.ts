
import {
    Platform,
    Dimensions,
    PixelRatio
} from 'react-native'


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const platform = Platform.OS
const isIOS = Platform.OS === 'ios'
const isAndroid = Platform.OS === 'android'
const isWeb = Platform.OS === 'web'
const isIphoneX =
    platform === 'ios' && deviceHeight === 812 && deviceWidth === 375

const isIphoneXR =
    platform === 'ios' && deviceHeight === 896 && deviceWidth === 414

const isIphone12 =
    platform === 'ios' && deviceHeight === 844 && deviceWidth === 390

const isIphone12ProMax =
    platform === 'ios' && deviceHeight === 926 && deviceWidth === 428

const isXSeries = () => {
    if (isIphoneX || isIphoneXR || isIphone12 || isIphone12ProMax) {
        return true
    }
    return false
}

const scale = (Platform.OS === 'web') ? deviceWidth / 320 : deviceWidth / 440;


const getWidth = (width:number) => {
    return deviceWidth * (width / 100)
}

const getHeight = (height:number) => {
    return deviceHeight * (height / 100)
}

const generateFontSize = (size: number) => {
    return Math.round(size * ((deviceWidth - 25) / 400))
}

const generateFontSizeNew = (size:number) => {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export default {

    platform,
    isIOS,
    isAndroid,
    isWeb,
    isIphoneX,
    deviceHeight,
    deviceWidth,
    getWidth,
    getHeight,
    generateFontSize,
    generateFontSizeNew,
    isXSeries,
}
