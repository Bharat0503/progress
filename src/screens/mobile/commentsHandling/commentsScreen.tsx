import CommentInput from "@/src/components/commentInput";
import CommentsList from "@/src/components/commentsList";
import HeaderBack from "@/src/components/headerBack";
import { TOGGLE_COMMENT_LIKE } from "@/src/services/MutationMethod";
import { GET_COMMENT_DETAILS_BY_CONTENT_ID_MOBILE, GET_SEARCHED_USERS, POST_COMMENTS } from "@/src/services/QueryMethod";
import config from "@/src/utils/config";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import navigationService from "@/src/navigation/navigationService";
import RouteNames from "@/src/navigation/routes";
import Header from "@/src/components/header";
import { useRoute } from "@react-navigation/native";
import { backgroundColors, commonColors } from "@/src/utils/colors";

type Comment = {
    id: string;
    message: string;
    username: string;
    timeAgo: string;
    likes: number;
    isLiked: boolean;
};

const CommentsScreen: React.FC = () => {
    const route = useRoute();
    const commentsID = route?.params?.commentsID || '';
    const [commentText, setCommentText] = useState("");
    const [userid, setUserId] = useState("");
    const [comments, setComments] = useState<any>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [requestToggleLike] = useMutation(TOGGLE_COMMENT_LIKE)
    const [isTagging, setIsTagging] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState<[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Comment[]>([]);
    const [tagsNew, setTagsNew] = useState<any>(null);
    const [getSearchedUsers,
        {
            data: searchedUserData,
            loading: searchedUserLoading,
            error: searchedUserError
        }] = useLazyQuery(GET_SEARCHED_USERS, { fetchPolicy: 'network-only' });
    const [tags, setTags] = useState<any>([]);

    const { data: getCommentsData, loading: getCommentsLoading, error: getCommentsError, refetch: commentRefetch } = useQuery(GET_COMMENT_DETAILS_BY_CONTENT_ID_MOBILE, {
        variables: {
            input: { content_id: parseInt(commentsID, 10) },
        },
    });
    const [postComment] = useMutation(POST_COMMENTS);

    useEffect(() => {
        if (!getCommentsLoading) {
            getComment(getCommentsData?.getContentInfoById?.contentInfo?.content_comments)
        }
    }, [getCommentsLoading]);

    useEffect(() => {
        if (searchedUserData) {
            const suggestions = searchedUserData.getAllUsers.users.map((user: any) => ({
                id: user.id.toString(),
                username: user.display_name,
            }));
            console.log(suggestions, 'suggestions');
            setTagSuggestions(suggestions);
        }
    }, [searchedUserData]);

    useEffect(() => {
        if (searchedUserData) {
            arrangeUserData(searchedUserData);
        }
    }, [searchedUserData]);


    function safeParse(input: string | object): object {
        try {
            if (typeof input === "string") {
                return JSON.parse(input);
            }
            if (typeof input === "object" && input !== null) {
                return input;
            }
            throw new Error("Invalid input type");
        } catch (error) {
            return {};
        }
    }


    const extractDate = (isoString: string): string => {
        const date = new Date(isoString);
        const day = date.getDate();
        const shortMonth = date.toLocaleString('en-US', { month: 'short' });

        return `${day} ${shortMonth}`;
    };


    const toggleLike = async (comment_id: number) => {
        try {
            const responseToggleLiked = await requestToggleLike({
                variables: {
                    input: {
                        comment_id: comment_id,
                        like: true,
                    },
                },
            });

            console.log("ResponsefromtoggleCommentLike:", responseToggleLiked);

            if (responseToggleLiked?.data?.toggleCommentLike?.success) {
                const responseCommentRefetch = await commentRefetch({
                    variables: {
                        input: {
                            content_id: commentsID
                        }
                    }
                })
               
                if (responseCommentRefetch?.data?.getContentInfoById?.success) {
                    getComment(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments)

                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const addCommentAPI = async (value: string) => {
        const responseComment = await postComment({
            variables: {
                input: {
                    content_id: commentsID,
                    comment: value
                }
            }
        })

        if (responseComment?.data?.commentContent?.success) {

            const responseCommentRefetch = await commentRefetch({
                variables: {
                    input: {
                        content_id: commentsID
                    }
                }
            })
            if (responseCommentRefetch?.data?.getContentInfoById?.success) {
                getComment(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments)
            }
        }

        console.log("responseComment", responseComment)
    }

    const getTagIds = (value: string) => {
        const regex = /<([^|]+)\|([^>]+)>/g;
        const textWithIds = value
        const idMatches = [...textWithIds.matchAll(regex)];

        const nameIdMap = idMatches.reduce((acc: any, match: any) => {
            acc[match[1]] = match[2]; // { "john": "123", "alice": "456" }
            return acc;
        }, {});


        const mentionRegex = /@(\w+)/; // Match @name
        const textWithMentions = value.replace(/<([^|]+)\|[^>]+>/g, '@$1')
        const textWithMentionsSplit = textWithMentions.split(" ")
        const indexes = textWithMentionsSplit.map((item, index) => {
            if (mentionRegex.test(item)) {
                const name = item.slice(1); // Remove '@' to get the name
                return { index, id: nameIdMap[name] || null }; // Store index & ID
            }
            return null; // Ignore non-mentions
        }).filter(index => index !== null);
        console.log("getTagIds11", nameIdMap);
        return indexes
    }

    const getComment = (value: any) => {
        const serverComments = value || [];
        let comments = []
        for (let key in serverComments) {
            let comment = {
                id: serverComments[key]?.id,
                timeAgo: extractDate(serverComments[key]?.createdAt),
                message: serverComments[key]?.comment,
                username: serverComments[key].commentor_info?.display_name || "Anonymous",
                commentor_name: serverComments[key]?.commentor_info?.display_name,
                is_Liked: serverComments[key]?.is_liked,
                total_likes: serverComments[key]?.total_comment_likes,
            }
            comments.push(comment)
        }
        setComments(comments)
        console.log("formattedComments", serverComments);
    }

    const handleTextChange = (text: string) => {
        setCommentText(text);
        console.log("handleTextChange", text);
        const match = text.match(/@\w*$/);
        if (match) {
            const prefix = match[0].slice(1);
            fetchTagSuggestions(prefix);
        } else {
            setTagSuggestions([]);
        }
    };

    const fetchTagSuggestions = async (prefix: string) => {
        try {
            if (prefix.length >= 1) {
                const userListResponse = await getSearchedUsers({
                    variables: {
                        input: {
                            keyword: prefix,
                        },
                    },
                });

                const suggestions = userListResponse?.data?.getAllUsers.users.map((user: any) => ({
                    id: user?.id.toString(),
                    username: user?.display_name,
                }));
                console.log("userListResponse", suggestions)
                setTagSuggestions(suggestions);
            }
            else {

                setTagSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching tag suggestions:", error);
        }
    };

    const handleTagSelect = (item: any) => {
        const tagsNews = tagsNew != null ? tagsNew : {}
        console.log("handleTagSelect11", tagsNews, item?.username);
        tagsNews[item?.username.trim()] = item?.id.trim()
        console.log("handleTagSelect22", tagsNews, item);
        setTagsNew(tagsNews)

        const trimedcomment = commentText.replace(/@\w*$/, "",);

        const updatedText = trimedcomment.trim() + ` @${item?.username?.trim()} `
        console.log("trimedcomment", updatedText);
        setCommentText(updatedText)
        setTagSuggestions([]);
    };

    const onSendComment = () => {
        let commentDummy = commentText
        if (tagsNew !== null) {
            const allName = Object.keys(tagsNew)
            for (let key in allName) {
                console.log("updatedStr00", commentDummy, allName[key]);
                if ("@" + allName[key].includes(commentDummy)) {
                    console.log("updatedStr", commentDummy, allName[key]);
                    commentDummy = commentDummy.replace("@" + allName[key], `<${allName[key]}|${tagsNew[allName[key]]}>`);
                    console.log("updatedStr111", commentDummy);
                }
            }

            setCommentText("")
            setTagsNew(null)
            setTagSuggestions([]);
            setTimeout(() => {
                addCommentAPI(commentDummy)
            }, 1000)
        }
        else {
            setCommentText("")
            setTagsNew(null)
            setTimeout(() => {
                addCommentAPI(commentText)
            }, 1000)
        }

    }

    const handleTagPress = (id: any) => {
        if (id) {
            navigationService.navigate(RouteNames.UserProfile, { id: id });
        }

    }

    const arrangeUserData = (data: any) => {
        if (!data || !data.getAllUsers) return;
        const result = data.getAllUsers.users.map((user: any) => ({
            id: user.id.toString(),
            name: user.display_name,
            profileImage: user.profile_image_path,
            isFollowing: user.follow_status,
        }));
        setFilteredUsers(result);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? config.getHeight(1) : 0}
        >
            <Header back={true} profile={true} />

            <View style={{ flex: 1, backgroundColor: backgroundColors.offWhite }}>
                {getCommentsLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: config.getHeight(10) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CommentsList
                            comments={comments}
                            isLiked={isLiked}
                            toggleLike={toggleLike}
                            onTagPress={handleTagPress}
                            tagSuggestions={tagSuggestions}
                        />
                    </ScrollView>
                )}
            </View>

            <View style={{ backgroundColor: backgroundColors.offWhite, padding: config.getHeight(1) }}>
                <CommentInput
                    value={commentText}
                    onChangeText={handleTextChange}
                    tagSuggestions={tagSuggestions}
                    isTagging={isTagging}
                    onTagSelect={handleTagSelect}
                    onSubmit={onSendComment}
                />
            </View>
        </KeyboardAvoidingView>
    );

};

export default CommentsScreen;