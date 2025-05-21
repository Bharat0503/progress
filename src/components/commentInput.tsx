import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, FlatList, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import Icons from "../assets/icons";
import config from "../utils/config";
import { backgroundColors, commonColors } from "../utils/colors";

type TagSuggestion = {
    id: string;
    username: string;
};

type CommentInputProps = {
    value: string;
    onSubmit: (comment: string) => void;
    onChangeText: (text: string) => void;
    tagSuggestions: TagSuggestion[];
    isTagging: boolean;
    onTagSelect: (tag: TagSuggestion) => void;
    // onTagSelect: (tag: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
    value,
    onChangeText,
    tagSuggestions,
    isTagging,
    onTagSelect,
    onSubmit,
}) => {
    const handlePost = () => {
        if (value.trim()) {
            // console.log("Submitting comment:", value);
            onSubmit(value.trim());
            onChangeText("");
        }
    };

    const dimension = useSelector((state: any) => state.reducer.dimentions)

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
    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    console.log("tagSuggestions", tagSuggestions)

    return (



        <View style={[styles.container, {
            alignItems: "center",
            alignSelf: "flex-start",
            width: config.isWeb ? getWidth(40) : null,
            marginVertical: config.isWeb ? getWidth(1) : config.getWidth(2),
        }]}>
            <TextInput
                allowFontScaling={false}
                style={[styles.input, {
                    marginHorizontal: config.isWeb ? getWidth(1.5) : config.getWidth(3),
                    //marginRight: config.isWeb ? getWidth(2) : 0,
                    borderRadius: config.isWeb ? getWidth(1) : config.getWidth(4),
                    paddingHorizontal: config.isWeb ? getWidth(1) : config.getWidth(6),
                    paddingVertical: config.isWeb ? getWidth(3) : config.getWidth(4),
                    height: config.isWeb ? getHeight(3) : config.getHeight(10),
                    fontSize: config.isWeb ? getFontSize(4) : 12,
                }]}
                placeholder="Your Comment"
                placeholderTextColor="#000000"
                value={value}
                onChangeText={onChangeText}
                multiline
                //numberOfLines={0}
                returnKeyType="default"
                keyboardType="default"
            />
            <TouchableOpacity
                onPress={() => Keyboard.dismiss()} // Dismiss the keyboard
            />
            <TouchableOpacity onPress={handlePost} style={styles.sendButton}>
                <Image
                    style={{
                        width: config.isWeb ? getWidth(2) : getWidth(7),
                        height: config.isWeb ? getWidth(2) : getWidth(7),
                        backgroundColor: backgroundColors.transparent,
                    }}
                    source={Icons.messageSend}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Centered Pop-Up Container */}
            {/* {isTagging && ( */}
            {tagSuggestions?.length !== 0 &&
                <View style={[styles.centeredContainer, {
                    justifyContent: 'flex-end',
                    left: config.isWeb ? getWidth(15) : config.getWidth(3),
                    top: config.isWeb ? getHeight(65) : -config.getHeight(41),
                    height: config.isWeb ? getHeight(8) : config.getHeight(40),
                    width: config.isWeb ? "40%" : "80%",
                }]}>

                    <View style={[styles.suggestionsContainer, {
                        borderRadius: config.isWeb ? getWidth(2) : config.getWidth(4),
                        padding: config.isWeb ? getWidth(1.5) : config.getWidth(4),
                    }]}>
                        <FlatList
                            data={tagSuggestions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        onTagSelect(item)
                                    }}
                                >
                                    <Text style={styles.suggestionText}>{item.username}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            }
            {/* )} */}
        </View>

    );
};

export default CommentInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",

        // marginBottom: config.getHeight(3),
        //backgroundColor: 'green',
        // position: 'absolute', bottom: 0

    },
    input: {
        flex: 1,
        borderColor: commonColors.black,
        borderWidth: 0.5,

        // paddingHorizontal: config.getWidth(6),
        // paddingVertical: config.getWidth(4),

        backgroundColor: "#FFFFFF",

        fontFamily: 'regular',
        color: '#000000',

        textAlignVertical: 'top',
    },
    sendButton: {
        borderRadius: 8,
        marginRight: 15,
    },
    sendText: {
        fontSize: config.generateFontSizeNew(16),
        color: "#fff",
        fontFamily: 'regular'
    },
    centeredContainer: {
        position: "absolute",
        // backgroundColor: 'pink',
        // transform: [{ translateX: -180 }, { translateY: -150 }],
        elevation: 0.5,
        shadowOffset: { width: 0, height: 0 },
        zIndex: 1000,
    },
    suggestionsContainer: {
        backgroundColor: "#fff",
        // minHeight: config.getHeight(40),
        elevation: 5,
        shadowColor: "#000",
        borderColor: "#CF78E9",
        borderWidth: 1,
        shadowRadius: 16,
        zIndex: 1000,
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    suggestionText: {
        fontSize: 16,
        color: "black",
        fontFamily: 'regular',
        fontWeight: "bold",
    },
    tag: {
        color: "#1F8FEA",
        fontWeight: "bold",
        fontFamily: 'regular'
    },
    noSuggestionsContainer: {
        backgroundColor: "#fff",
        borderRadius: config.getWidth(4),
        padding: config.getWidth(4),
        maxHeight: config.getHeight(200),
        elevation: 5,
        shadowColor: "#000",
        borderColor: "#CF78E9",
        borderWidth: 1,
        shadowRadius: 16,
    },
    noSuggestionsText: {
        fontSize: config.generateFontSizeNew(16),
        color: "black",
        fontWeight: "bold",
        fontFamily: 'regular',
        textAlign: "center",
    },
});
