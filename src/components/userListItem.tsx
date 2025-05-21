import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import config from '../utils/config';
import navigationService from '../navigation/navigationService';
import RouteNames from '../navigation/routes';
import { borderColors } from '../utils/colors';
import Icons from '../assets/icons';
import { useSelector } from 'react-redux';

interface UserListItemProps {
  item?: any
  onClickUser?: (item: any) => void
  staffDirectory?: boolean
  name: string;
  folllowUnfollow?: boolean
  paddingHor?: boolean
  profileImage: string;
  buttonLabel?: string;
  onPress?: () => void;
  id: string;
  borderless?: boolean;
  speciality?: string;
  isSelected?: boolean;
  onItemPress?: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  item,
  onClickUser,
  staffDirectory,
  name,
  folllowUnfollow,
  paddingHor,
  profileImage,
  buttonLabel,
  onPress,
  id,
  borderless,
  speciality,
  isSelected,
  onItemPress
}) => {


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

  const getInitials = (fullName?: string) => {
    if (!fullName) return "NA"; // Handle undefined names
    const nameParts = fullName.split(' ');
    return nameParts.length > 1
      ? (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();
  };


  const handlePress = () => {
    if (staffDirectory && onClickUser) {
      onClickUser(item);
    } else if (onItemPress) {
      onItemPress();
    } else if (id) {
      navigationService.navigate(RouteNames.UserProfile, { id });
    } else {
      console.warn("Navigation ID is missing");
    }
  };


  return (
    <View style={paddingHor
      ?
      [styles.listItem, {
        height: config.isWeb ? getHeight(15) : getHeight(8),
        paddingHorizontal: getWidth(6)
      },
      isSelected
        ?
        styles.selectedItem : {}]
      :
      [styles.listItem,
      { height: config.isWeb ? getHeight(15) : getHeight(8) },
      isSelected
        ?
        styles.selectedItem
        : {}]}>
      <TouchableOpacity onPress={handlePress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {(profileImage != null || undefined) ? (
          <Image source={{ uri: profileImage }} style={[styles.profileImage, {

            width: config.isWeb ? getWidth(5) : getWidth(13),
            height: config.isWeb ? getWidth(5) : getWidth(13),
            borderRadius: getWidth(6.5)

          }]} />
        )
          :
          (
            <View style={[styles.avatarCircle, {
              width: config.isWeb ? getWidth(5) : getWidth(13),
              height: config.isWeb ? getWidth(5) : getWidth(13),
              borderRadius: getWidth(6.5)
            }]}>
              <Text style={[styles.avatarText, { fontSize: config.isWeb ? getFontSize(8) : config.generateFontSizeNew(16), }]}>{getInitials(name ?? "Unknown")}</Text>
            </View>
          )
        }
        <View>
          <Text style={[styles.nameText, {
            marginTop: config.isWeb ? getHeight(1) : getHeight(1),
            marginLeft: config.isWeb ? getWidth(4) : getWidth(4),
            fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
          }]}>{name}</Text>
          {speciality && <Text style={[styles.specText, {
            marginLeft: config.isWeb ? getWidth(4) : getWidth(4),
            fontSize: config.isWeb ? getFontSize(2.5) : config.generateFontSizeNew(10),
          }]}>{speciality}</Text>}




        </View>

      </TouchableOpacity>
      {
        folllowUnfollow
          ?
          borderless ? (
            <TouchableOpacity style={[styles.followButtonBorderless, {

              paddingHorizontal: getWidth(4),
              paddingVertical: getHeight(0.5),
            }]} onPress={onPress}>
              <Text style={[styles.addText, { fontSize: config.isWeb ? getFontSize(6) : config.generateFontSizeNew(20), }]}> {buttonLabel === 'Follow' ? '+' : null} </Text>
              <Text style={[styles.followButtonTextBorderless, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), }]}>{buttonLabel}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.followButton, {
              paddingHorizontal: getWidth(3),
              paddingVertical: getHeight(0.3),
            }]} onPress={onPress}>
              <Text style={[styles.followButtonText, { fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(14), }]}>{buttonLabel}</Text>




            </TouchableOpacity>
          )

          : null
      }
    </View >
  )
};

const styles = StyleSheet.create({
  listItem: {

    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {

    borderWidth: 1,
    borderColor: '#707070'
  },
  nameText: {
    //flex: 1,
    marginLeft: config.getWidth(5),
    fontSize: config.generateFontSizeNew(12),
    fontFamily: 'regular',
    color: '#000000',
    width: Platform.OS === 'ios' ? config.getWidth(38) : config.getWidth(45)
  },
  specText: {
    //flex: 1,
    marginLeft: config.getWidth(5),
    fontSize: config.generateFontSizeNew(9),
    fontFamily: 'regular',
    color: '#000000',
    bottom: 3
  },
  followButton: {
    paddingHorizontal: config.getWidth(6),
    paddingVertical: config.getHeight(0.2),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#707070',
  },
  followButtonBorderless: {

    flexDirection: 'row',
    alignItems: 'center'
  },
  followingButton: {
    borderWidth: 1,
    borderColor: '#707070',
  },
  followButtonText: {
    fontSize: config.generateFontSizeNew(11),
    fontFamily: 'regular',
    color: '#000000',
  },
  followButtonTextBorderless: {
    fontSize: config.generateFontSizeNew(14),

    fontFamily: 'regular',
    color: '#000000',
  },
  addText: {
    fontSize: config.generateFontSizeNew(18),
    fontFamily: 'regular',
    color: '#000000',
  },
  followingButtonText: {
    color: '#000000',
  },
  avatarCircle: {

    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#707070'
  },
  avatarText: {
    color: '#000000',

  },
  selectedItem: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: borderColors.profileImage,
    backgroundColor: '#A8E1F052',
  },
});