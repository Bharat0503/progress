import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import config from '../utils/config';
import ContentTabBar from './contectTabBar';
import Icons from '../assets/icons';
import { ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { stripHtmlTags } from './GlobalConstant';
import { commonColors } from '../utils/colors';

interface CardProps {
  type: number;
  title: string;
  views: string;
  imageSource: any;
  onPress?: () => void;
  org: string;
  onDownloadPress?: () => void;
  isLoading?: boolean;
  progress?: number;
  isDownloaded?: boolean;
  fromHistory?: boolean;
  onSharePress?: () => void;
}

const CardHistory: React.FC<CardProps> = ({ type, title, views, imageSource, onPress, org, onDownloadPress, isLoading, progress = 0, isDownloaded, fromHistory, onSharePress }) => {
  // console.log("Type received in CardHistory:", type);
  const progressValue = Math.min(Math.max(progress / 100, 0), 1).toFixed(2);
  const dimension = useSelector((state: any) => state.reducer.dimentions);

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
    <View style={styles.container} >
      <View style={[styles.card, { borderRadius: config.isWeb ? getWidth(1.5) : config.getWidth(5), }]}>
        <ContentTabBar type={type} isMenu={true} onDownloadPress={onDownloadPress} isDownloaded={isDownloaded} fromHistory={fromHistory} onSharePress={onSharePress} />
        <TouchableOpacity style={styles.subContainer} onPress={onPress}>
          <Image source={imageSource ? { uri: imageSource } : Icons.contentThumbnail} style={[styles.image, {
            height: config.isWeb ? getWidth(10) : config.getHeight(15),
            width: config.isWeb ? getWidth(15) : config.getHeight(15),
            borderRadius: config.isWeb ? getWidth(1) : config.getWidth(4),
          }]} />
          <View style={[styles.contentContainer, { paddingLeft: config.isWeb ? getWidth(5) : config.getWidth(8) }]}>
            <Text style={[styles.titleText, {
              //lineHeight: config.isWeb ? getHeight(6) : null,
              fontSize: config.isWeb ? getFontSize(5) : config.generateFontSizeNew(18),
            }]} numberOfLines={2}>{title}</Text>
            <Text numberOfLines={3} style={[styles.typeText, {

              fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(14),
            }]}>{stripHtmlTags(org)}</Text>
            <View style={styles.typeContainer}>
              <Text style={[styles.typeText, {
                marginTop: config.isWeb ? getHeight(2) : config.getHeight(1),
                fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(14),
              }]}>{views} Views</Text>
            </View>
          </View>
        </TouchableOpacity>
        {isLoading && (
          <View style={[styles.loaderOverlay, { borderRadius: config.isWeb ? getWidth(4) : config.getWidth(5) }]}>
            <ActivityIndicator size="large" color="#8737B1" />

            <Text style={[styles.progressText, { fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(18), }]}>{`${Math.round(progress)}%`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: config.getHeight(1),

  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: commonColors.black,
    paddingHorizontal: config.getWidth(2)
  },
  subContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    margin: config.getHeight(1)
  },
  image: {
    //backgroundColor: 'pink',
    //flex: 0.5,

  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: config.getWidth(3),
    paddingVertical: config.getHeight(1),
    //backgroundColor: 'pink'
  },
  titleText: {
    fontSize: config.generateFontSizeNew(14),
    fontFamily: 'regular',
    color: '#000000',
    textAlign: 'left',
    // height: config.getHeight(6),
    marginBottom: config.getHeight(1),
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    //fontSize: config.generateFontSizeNew(10),
    fontFamily: 'regular',
    color: '#000000',
    textAlign: 'left',

  },
  loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', borderRadius: config.getWidth(5), },
  progressBar: { width: 100, marginTop: 20, borderRadius: 5 },
  progressText: {

    fontFamily: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginTop: 5,
  },
});

export default CardHistory;