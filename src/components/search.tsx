import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native'
import config from '../utils/config'
import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import { useSelector } from 'react-redux'
import Analytics from '../services/Analytics'

interface SearchProps {
    isAutoFocus?: boolean,
    isSearchIconVisible?: boolean,
    isMicIconVisible?: boolean,
    filter?: boolean
    onSelect?: (filter: string) => void
    onSearch?: (search: string) => void
    initialSearchText?: string;
    isSearchOnKeyboardButton?: boolean
    onSearchBoxClick?: () => void;
}

const Search: React.FC<SearchProps> = ({ isAutoFocus, isSearchIconVisible, isMicIconVisible, filter, onSelect, onSearch, initialSearchText, isSearchOnKeyboardButton, onSearchBoxClick }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [filterVisible, setFilterVisible] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<string>("")
    const [searchText, setSearchText] = useState<string>(initialSearchText || "");
    const filterRef = useRef(null);
    const isSafari = typeof navigator !== 'undefined' && navigator?.userAgent?.includes('Safari') && !navigator?.userAgent?.includes('Chrome');

    useEffect(() => {
        setSearchText(initialSearchText || "");
        Analytics.logSearchEvent(initialSearchText || '');
    }, [initialSearchText]);

    // Handle clicks outside the filter dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // @ts-ignore
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterVisible(false);
            }
        };

        // Only add listeners for web
        if (config.isWeb && filterVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            if (config.isWeb) {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, [filterVisible]);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

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

    // Method to toggle filter visibility
    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    };

    // Method to handle backdrop press for mobile
    const handleBackdropPress = () => {
        if (filterVisible) {
            setFilterVisible(false);
        }
    };

    return (
        <>
            {/* Invisible backdrop for mobile to catch touches outside the dropdown */}
            {!config.isWeb && filterVisible && (
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        zIndex: 10
                    }} />
                </TouchableWithoutFeedback>
            )}

            <View style={{
                justifyContent: 'flex-start', alignItems: 'center',
                width: config.isWeb ? getWidth(25) : config.getWidth(90),
                height: config.isWeb ? getHeight(8) : config.getHeight(10),
                flexDirection: 'row',
                position: 'relative',
                zIndex: 20,
                 ...(isSafari && { marginLeft: getWidth(3) })
            }}>
                <TouchableOpacity onPress={onSearchBoxClick}
                    style={{
                        width: config.isWeb ? getWidth(20) : config.getWidth(75),
                        height: config.isWeb ? getHeight(6.5) : config.getHeight(7),
                        borderRadius: config.isWeb ? getWidth(1) : config.getWidth(3),
                        borderWidth: 1,
                        backgroundColor: config.isWeb ? commonColors.white : commonColors.white,
                        borderColor: borderColors.signInBorder,
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1
                    }}>
                    {isSearchOnKeyboardButton ? (
                        <TextInput
                            allowFontScaling={false}
                            style={{
                                height: config.isWeb ? getHeight(6) : config.getHeight(6),
                                flex: 1,
                                borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                                paddingHorizontal: config.isWeb ? null : 10,
                                fontFamily: 'medium',
                                paddingLeft: config.isWeb ? getWidth(2) : config.getWidth(5),
                                fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16),
                                color: textColors.search,
                                backgroundColor: commonColors.white,
                                borderColor: borderColors.signInBorder,
                            }}
                            maxLength={100}
                            value={searchText}
                            placeholder="Search"
                            placeholderTextColor="#A1A6B3"
                            returnKeyType='search'
                            onChangeText={(value) => {
                                if (value === "") {
                                    if (onSearch) {
                                        onSearch(value);
                                    }
                                }
                                setSearchText(value);
                                Analytics.logSearchEvent(value);
                            }}
                            onSubmitEditing={() => {
                                if (onSearch) {
                                    onSearch(searchText);
                                }
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={isAutoFocus}
                        />
                    ) : (
                        <TextInput
                            allowFontScaling={false}
                            style={{
                                height: config.isWeb ? getHeight(6) : config.getHeight(6),
                                flex: 1,
                                borderRadius: config.isWeb ? getWidth(0.75) : config.getWidth(3),
                                paddingHorizontal: 10,
                                fontFamily: 'medium',
                                paddingLeft: config.isWeb ? getWidth(5) : config.getWidth(5),
                                fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16),
                                color: textColors.search,
                                backgroundColor: commonColors.white,
                                borderColor: borderColors.signInBorder,
                            }}
                            maxLength={100}
                            value={searchText}
                            placeholder='Search'
                            placeholderTextColor={"#A1A6B3"}
                            onChangeText={(value) => {
                                setSearchText(value);
                                Analytics.logSearchEvent(value);
                                if (onSearch) {
                                    onSearch(value)
                                }
                            }}
                            keyboardType='email-address'
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={isAutoFocus}
                        />
                    )}
                    {isSearchIconVisible && (
                        config.isWeb ?
                            <TouchableOpacity onPress={() => {
                                if (onSearch) {
                                    onSearch(searchText);
                                }
                            }}>
                                <Image
                                    style={{
                                        width: config.isWeb ? getWidth(1.25) : config.getWidth(4),
                                        height: config.isWeb ? getWidth(2.5) : config.getWidth(4),
                                        marginHorizontal: config.isWeb ? getWidth(1.5) : config.getWidth(5),
                                        ...(isSafari && { marginRight: getWidth(5) })
                                    }}
                                    source={Icons.search}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            :
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(1.25) : config.getWidth(4),
                                    height: config.isWeb ? getWidth(2.5) : config.getWidth(4),
                                    marginHorizontal: config.isWeb ? getWidth(0.6) : config.getWidth(5),
                                }}
                                source={Icons.search}
                                resizeMode='contain'
                            />

                    )}
                </TouchableOpacity>

                {filter && (
                    <View
                        style={{ position: 'relative' }}
                        ref={filterRef}
                    >
                        <TouchableOpacity
                            onPress={toggleFilter}
                            activeOpacity={0.7}
                        >
                            <Image
                                style={{
                                    width: config.isWeb ? getWidth(3) : config.getWidth(10),
                                    height: config.isWeb ? getWidth(3) : config.getWidth(10),
                                    marginHorizontal: config.isWeb ? getWidth(0.7) : config.getWidth(2)
                                }}
                                source={Icons.filter}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                        {filterVisible && (
                            <View
                                style={{
                                    width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                    height: config.isWeb ? getWidth(9) : config.getWidth(45),
                                    position: 'absolute',
                                    backgroundColor: commonColors.white,
                                    right: config.isWeb ? -getWidth(4) : 0,
                                    top: config.isWeb ? getHeight(3.5) : config.getHeight(5),
                                    zIndex: 1000,
                                    borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(3),
                                    borderWidth: 1,
                                    borderColor: borderColors.profileImage,
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                    elevation: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect && onSelect("Alphabetically A-Z");
                                        setSelectedFilter("1");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(1.8) : config.getHeight(3),
                                        borderTopWidth: selectedFilter === "1" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "1" ? 1 : 0,
                                        borderColor: selectedFilter === "1" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "1" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16)
                                    }}>
                                        Name A - Z
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect && onSelect("Alphabetically Z-A");
                                        setSelectedFilter("2");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(1.8) : config.getHeight(3),
                                        borderTopWidth: selectedFilter === "2" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "2" ? 1 : 0,
                                        borderColor: selectedFilter === "2" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "2" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16)
                                    }}>
                                        Name Z - A
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect && onSelect("Created most recently");
                                        setSelectedFilter("3");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(1.8) : config.getHeight(3),
                                        borderTopWidth: selectedFilter === "3" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "3" ? 1 : 0,
                                        borderColor: selectedFilter === "3" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "3" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16)
                                    }}>
                                        Created most recently
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect && onSelect("Created last 30 days ago");
                                        setSelectedFilter("4");
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                        width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                        height: config.isWeb ? getHeight(1.8) : config.getHeight(3),
                                        borderTopWidth: selectedFilter === "4" ? 1 : 0,
                                        borderBottomWidth: selectedFilter === "4" ? 1 : 0,
                                        borderColor: selectedFilter === "4" ? borderColors.profileImage : null,
                                        backgroundColor: selectedFilter === "4" ? backgroundColors.selectedFilter : null,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Text style={{
                                        color: commonColors.black,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(16)
                                    }}>
                                        Created most 30 days ago
                                    </Text>
                                </TouchableOpacity>

                                <View style={{
                                    width: config.isWeb ? getWidth(10) : config.getWidth(55),
                                    height: config.isWeb ? getHeight(1.7) : config.getHeight(3),
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelect && onSelect("ClearAll");
                                            setSelectedFilter("");
                                            setFilterVisible(false);
                                        }}
                                        style={{
                                            width: config.isWeb ? getWidth(4) : config.getWidth(20),
                                            height: config.isWeb ? getHeight(1.7) : config.getHeight(2.5),
                                            borderRadius: config.isWeb ? getHeight(0.85) : config.getHeight(1.25),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: config.isWeb ? getWidth(0.3) : config.getWidth(2),
                                            borderWidth: 1,
                                            borderColor: commonColors.black
                                        }}
                                    >
                                        <Text style={{
                                            color: commonColors.black,
                                            fontFamily: 'regular',
                                            fontSize: config.isWeb ? getFontSize(2) : config.generateFontSizeNew(14)
                                        }}>
                                            Clear All
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </>
    )
}

export default Search