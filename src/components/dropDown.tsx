import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import config from '../utils/config';
import { backgroundColors, borderColors, commonColors } from '../utils/colors';
import { useSelector } from 'react-redux';

interface DropDownProps {
    title: string;
    data: any;
    initialData?: any;
    notImp?: any;
    setDropdown: (value: string, valueId: number) => void | undefined;
}

const DropDown: React.FC<DropDownProps> = ({ title, data, initialData, notImp, setDropdown }) => {
    const [value, setValue] = useState<string>(initialData);
    const [valueId, setValueId] = useState<number>();
    const [valueVisible, setValueVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    type ItemProps = { title: string; id: number };
    const dimension = useSelector((state: any) => state.reducer.dimentions);

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size;
    };

    const getWidth = (width: number) => {
        return dimension.width * (width / 100);
    };

    const getHeight = (height: number) => {
        if (config.isWeb) {
            if (dimension?.height > 820) {
                return dimension.height * (height / 100);
            } else {
                return 820 * (height / 100);
            }
        } else {
            return dimension.height * (height / 100);
        }
    };

    const filteredData = data.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Item = ({ title, id }: ItemProps) => (
        <TouchableOpacity
            onPress={() => {
                setValue(title);
                setValueId(id);
                setValueVisible(false);
                setDropdown(title, id);
                setSearchQuery(title);
            }}
            style={{
                backgroundColor: commonColors.white,
                marginHorizontal: config.isWeb ? getWidth(0.02) : config.getWidth(0.1),
            }}
        >
            <Text
                style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14),
                    marginHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(1.5),
                    marginBottom: config.isWeb ? config.getHeight(0.2) : config.getHeight(0.5),
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View
            style={{
                marginTop: config.isWeb ? getHeight(0.6) : config.getHeight(2),            
                flex: 1
            }}

        >
            <Text
                style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                    alignSelf: 'flex-start',
                    marginBottom: config.isWeb ? getHeight(0.5) : config.getHeight(1),
                }}
            >
                {title}
                {!notImp && (
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                            marginBottom: config.isWeb ? getHeight(0.5) : config.getHeight(1),
                        }}
                    >
                        *
                    </Text>
                )}
            </Text>
            <View
                // onPress={() => {
                //     setValueVisible(!valueVisible);
                // }}
                style={{
                    height: config.isWeb ? config.getHeight(5.4) : config.getHeight(7),
                    //width: config.isWeb ? getWidth(19) : config.getWidth(90),
                    borderColor: borderColors.textInputBorder,
                    borderWidth: config.isWeb ? 0.1 : 1,
                    borderTopLeftRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                    borderTopRightRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                    borderBottomLeftRadius: valueVisible ? 0 : config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                    borderBottomRightRadius: valueVisible ? 0 : config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: config.getHeight(0.5)
                }}
            >
                <TextInput
                    style={{
                        height: config.isWeb ? config.getHeight(5) : config.getHeight(7),
                        flex: 1,
                        borderColor: backgroundColors.transparent,
                        borderWidth: 0,
                        borderRadius: config.isWeb ? config.getWidth(0.5) : config.getWidth(2),
                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                        backgroundColor: backgroundColors.transparent,
                        fontFamily: 'regular',
                        color: commonColors.black,
                        paddingHorizontal: config.isWeb ? getWidth(1) : config.getWidth(0)
                    }}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setValueVisible(true)}
                />
                <Image
                    style={{
                        height: config.isWeb ? getHeight(0.7) : config.getHeight(2),
                        width: config.isWeb ? getWidth(0.5) : config.getWidth(3),
                        marginRight: config.isWeb ? config.getWidth(0.6) : config.getWidth(5),
                        marginTop: config.isWeb ? 1 : 3,
                    }}
                    source={require('../assets/icons/DropDown.png')}
                    resizeMode="contain"
                />
            </View>
            {valueVisible ? (
                <View
                    style={[
                        {
                            marginTop: config.isWeb ? getHeight(0.1) : getHeight(-0.5),
                            zIndex: 1,
                            borderColor: borderColors.textInputBorder,
                            borderWidth: config.isWeb ? 0.1 : 1,
                            borderTopLeftRadius: valueVisible ? 0 : config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                            borderTopRightRadius: valueVisible ? 0 : config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                            borderBottomLeftRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                            borderBottomRightRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                            overflow: 'hidden',
                            flex: 1,
                            padding: 5,
                            backgroundColor: commonColors.white,
                        },
                    ]}
                >

                    <FlatList
                        data={filteredData}
                        renderItem={({ item }) => <Item title={item.name} id={item.id} />}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        style={{ height: config.isWeb ? getHeight(10) : config.getHeight(10) }}
                    />
                </View>
            ) : null}
        </View>
    );
};

export default DropDown;

