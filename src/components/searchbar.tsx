
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputSubmitEditingEventData, NativeSyntheticEvent } from 'react-native';
import config from '../utils/config';
import { useSelector } from 'react-redux';
import Analytics from '../services/Analytics';

interface SearchBarProps {
  isOnKeyboardSearch?: boolean;
  onSearch: (query: string) => void;
  onChangeSearch?: (query: string) => void;
  containerWidth?: number
  bgColor?: string;
  borderColor?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onChangeSearch, containerWidth, bgColor, borderColor, isOnKeyboardSearch = false }) => {
  const [query, setQuery] = useState('');
  const dimension = useSelector((state: any) => state.reducer.dimentions)

  const getFontSize = (size: number) => {
    // if (config.isWeb) {
    //   const webSize = 0.20 * size
    //   return dimension.width * (webSize / 100)
    // }

    return (dimension.width / 320) * size
  }

  const getWidth = (width: number) => {
    // if (config.isWeb) {
    //   const webWidth = 0.4 * width
    //   return dimension.width * (webWidth / 100)
    // }
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

  const handleSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const text = event.nativeEvent.text.trim();
    onSearch(text);
    if (onChangeSearch) {
      onChangeSearch(text)
    }
    Analytics.logSearchEvent(text);
  };

  return (
    <View style={{ padding: config.isWeb ? getWidth(1.25) : config.getWidth(5), width: containerWidth ? containerWidth : null, backgroundColor: config.isWeb ? bgColor || null : bgColor || '#ffffff' }}>
      <TextInput
        allowFontScaling={false}
        style={[styles.searchInput, {
          borderColor: borderColor || '#B8D1F1', fontFamily: 'medium',
          fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
          paddingLeft: config.isWeb ? getWidth(1.25) : config.getWidth(5),
          height: config.isWeb ? config.getHeight(6) : config.getHeight(6),
          padding: config.isWeb ? config.getWidth(1) : config.getWidth(4),
          borderRadius: config.isWeb ? config.getHeight(3) : config.getWidth(5),
          borderWidth: 2,
        }]}
        placeholder="Search"
        value={query}
        onChangeText={(value) => {

          setQuery(value)
          if (onChangeSearch) {
            onChangeSearch(value)
          }
        }}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#999"
        returnKeyType={isOnKeyboardSearch ? 'done' : "search"}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  searchInput: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'regular',
  },
});