import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import Icons from "../assets/icons";
import config from "../utils/config";
import { commonColors, textColors } from "../utils/colors";

type CommentBoxProps = {
    item: any
    message: string;
    username: string;
    timeAgo: string;
    likes: number;
    isLiked: boolean;
    toggleLike: () => void;
    onTagPress: (id: any) => void;
    tagSuggestions: { username: string, id: string }[];
    mentionedUserId?: string;
};

const CommentBox: React.FC<CommentBoxProps> = ({
    item,
    message,
    username,
    timeAgo,
    likes,
    isLiked, toggleLike,
    onTagPress,
    tagSuggestions,
}) => {
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

    const replaceCommentTag = (value: string) => {
        return value.replace(/<([^|]+)\|[^>]+>/g, '@$1')
    }


    const renderMessage = (text: string = "") => {
        const regex = /(@\w+\s?\w*)/g;
        const words = text.split(regex);

        return text?.split(/(\<[^>]+\>)/).filter(Boolean).map((part: string, index: number) =>
            /<([^|]+)\|[^>]+>/g.test(part) ?
                (
                    <Text
                        key={index}
                        style={{
                            fontFamily: 'bold',
                            fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: commonColors.black
                        }}
                        onPress={() => {
                            const textWithIds = part.split("|")
                            const textWithIds1 = textWithIds[1].split(">")

                            console.log("TAGCLICK", textWithIds1[0])
                            if (textWithIds1[0]) {
                                onTagPress(textWithIds1[0])
                            }

                        }}
                    >
                        {replaceCommentTag(part)}
                    </Text>
                )
                :
                (
                    <Text style={{
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: textColors.commentText
                    }} key={index}>
                        {part}</Text>
                )











        );
    };


    return (
        <View style={[styles.container, {
            alignSelf: config.isWeb ? "center" : "flex-start",
            padding: config.isWeb ? getWidth(1) : config.getWidth(4),
            borderRadius: config.isWeb ? getWidth(1) : config.getWidth(4),
            width: config.isWeb ? getWidth(40) : dimension.width - config.getWidth(8),
        }]}>
            {/* Message */}

            <View style={styles.messageContainer} >
                {renderMessage(message)}
                {/* <Text style={styles.messageContainer}>{renderMessage(message)}</Text> */}
            </View>

            {/* Username and Like */}
            <View style={styles.bottomRow}>
                <View style={{ marginRight: 13 }}>
                    <Text style={[styles.username, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(12), }]}>{username}</Text>
                    <Text style={[styles.timeAgo, { fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(10), }]}>{timeAgo}</Text>
                </View>
                <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={toggleLike}>
                        <Image
                            style={{
                                // tintColor: isLiked ? 'red' : "",
                                width: config.isWeb ? getWidth(2) : getWidth(6),
                                height: config.isWeb ? getWidth(2) : getWidth(6),
                            }}
                            source={isLiked ? Icons.likeIcon : Icons.likeIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{likes}</Text>
                </View>
            </View>
        </View>
    );
};

export default CommentBox;

const styles = StyleSheet.create({
    container: {

        backgroundColor: "#fff",
        borderColor: commonColors.black,
        borderWidth: 0.5,


        marginVertical: config.getHeight(1),
        // marginHorizontal: config.getWidth(4),
    },
    messageContainer: {
        marginBottom: config.getHeight(2),
        flexDirection: "row",
        flexWrap: "wrap",
    },
    messageText: {
        fontSize: config.generateFontSizeNew(14),
        fontFamily: "regular"
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "flex-end",
    },
    username: {

        fontFamily: "regular"
    },
    timeAgo: {
        fontSize: config.generateFontSizeNew(10),
        textAlign: 'left', fontFamily: "regular",
    },
    likeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    likeText: {
        fontSize: config.generateFontSizeNew(9),
        color: "gray",
        marginRight: 4,
        fontFamily: "regular"
    },
    likeCount: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: "regular"
    },
    mention: {
        fontSize: config.generateFontSizeNew(14),
        color: "#1F8FEA",
        fontFamily: "regular",
        fontWeight: "bold",
        marginLeft: config.getWidth(-2),
    },
});
