import React from "react";
import { FlatList, StyleSheet, View, Text, ScrollView } from "react-native";
import CommentBox from "./commentBox";
import config from "../utils/config";
import navigationService from "../navigation/navigationService";
import RouteNames from "../navigation/routes";
import { backgroundColors, commonColors } from "../utils/colors";
import { useSelector } from "react-redux";

type Comment = {
    id: string;
    message: string;
    username: string;
    timeAgo: string;
    likes: number;
    isLiked: boolean;
    toggleLike: () => void;
    onTagPress: () => void;
    tagSuggestions: { username: string, id: string; }[];
};

type CommentsListProps = {
    comments: Comment[];
    onLike?: (id: string) => void;
    isLiked: boolean;
    toggleLike: (commentId: number) => void;
    onTagPress: (id: any) => void;
    tagSuggestions: { username: string, id: string; }[];
};

const CommentsList: React.FC<CommentsListProps> = ({ comments, onLike, isLiked, toggleLike, onTagPress,
    tagSuggestions
}) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions);
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

    const EmptyComp = () => (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(14), }]}>No Comments</Text>
        </View>
    );

    if (!comments || comments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(14), }]}>No comments yet. Be the first to comment!</Text>
            </View>
        );
    }



    return (
        // <View style={{ backgroundColor: 'pink', height: config.getHeight(70) }}>
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ backgroundColor: config.isWeb ? null : backgroundColors.offWhite }}>
            <FlatList
                data={comments}
                // keyExtractor={(item) => `${item.id}-${item.message}`}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                // keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                //scrollEnabled={false}
                renderItem={({ item }: any) => (

                    //console.log("COMMENTITEM", item),

                    <CommentBox
                        item={item}
                        message={item.message}
                        username={item.username}
                        timeAgo={item.timeAgo}
                        likes={item.total_likes}
                        isLiked={item.is_Liked}
                        toggleLike={() => toggleLike(item.id)}
                        tagSuggestions={tagSuggestions}

                        mentionedUserId={item.mentionedUserId}
                        onTagPress={(id: any) => {
                            onTagPress(id)
                        }}
                    />
                )}
                ListEmptyComponent={EmptyComp}
                contentContainerStyle={styles.list}
            />
        </ScrollView>
        // </View>


    );
};

export default CommentsList;

const styles = StyleSheet.create({
    list: {
        padding: 16,
        // backgroundColor: 'pink',
    },
    emptyText: {
        width: config.getWidth(50),

        color: '#707070',
        textAlign: 'center',
        fontFamily: 'regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'regular',
        fontSize: config.generateFontSizeNew(14),
        marginTop: config.getHeight(20),
    },
});
