import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import HeaderWeb from './headerWeb';
import LogoText from './logoText';
import Search from './search';
import config from '../utils/config';


type WebBaseLayoutProps = {
    onSelect?: (filter: string) => void
    children?: any;
    showSearch?: boolean;
    leftContent?: any;
    rightContent?: any;
    onSearch?: () => void;
    searchText?: string;
    showFilter?: boolean;
    onSearchBoxClick?: () => void;
};

const WebBaseLayout: React.FC<WebBaseLayoutProps> = ({ onSelect, children, showSearch = true, leftContent, rightContent, searchText, onSearch, showFilter, onSearchBoxClick }) => {
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
        <View style={{
            flex: 1,
            alignItems: 'center',



        }}>
            <HeaderWeb />

            <View style={{
                width: getWidth(100),
                flex: 1,
                marginTop: getHeight(4),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <View style={{
                    width: getWidth(38),
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginTop: getHeight(5),
                    }}>
                        <LogoText />
                        {showSearch &&
                            <Search
                                onSelect={onSelect}
                                filter={showFilter}
                                isAutoFocus={true}
                                isSearchIconVisible={true}
                                isMicIconVisible={true}
                                onSearch={onSearch}
                                initialSearchText={searchText}
                                isSearchOnKeyboardButton={true}
                                onSearchBoxClick={onSearchBoxClick}
                            />
                        }
                        {leftContent}
                    </View>
                </View>

                <View style={{
                    width: getWidth(60),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {children || rightContent}
                </View>
            </View>

        </View>

    );
};

export default WebBaseLayout;