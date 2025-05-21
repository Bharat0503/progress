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
import HeaderWeb from "@/src/components/headerWeb";
import { useSelector } from "react-redux";
import useFetchDimention from "@/src/customHooks/customDimentionHook";
import WebBaseLayout from "@/src/components/webBaseLayout";

type Comment = {
    id: string;
    message: string;
    username: string;
    timeAgo: string;
    likes: number;
    isLiked: boolean;
};

const CommentsScreenWeb: React.FC = () => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    useFetchDimention();
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

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }
    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    // useEffect(() => {
    //     getComments(commentsID);
    // }, []);

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

    // Change date format----

    const extractDate = (isoString: string): string => {
        const date = new Date(isoString);
        const day = date.getDate();
        const shortMonth = date.toLocaleString('en-US', { month: 'short' });

        return `${day} ${shortMonth}`;
    };

    // for getting comments-----

    // const getComments = async (commentsID: string) => {

    //     try {
    //         await getCommentsList({
    //             variables: {
    //                 input: { content_id: parseInt(commentsID, 10) },
    //             },
    //         });
    //     } catch (error) {
    //         console.error("Error fetching comments:", error);
    //     }
    // };

    // Like comment-----

    const toggleLike = async (comment_id: number) => {

        try {
            // const commentIndex = comments.findIndex((comment) => comment.id === comment_id);
            // console.log("comment index:", commentIndex);
            // if (commentIndex === -1) {
            //     console.error("Comment not found with id:", comment_id);
            //     return;
            // }

            // const comment = comments[commentIndex];
            //console.log("Toggling like for comment:", parseInt(comment_id, 10));

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
                // console.log("responseCommentRefetch", responseCommentRefetch?.data)
                if (responseCommentRefetch?.data?.getContentInfoById?.success) {
                    getComment(responseCommentRefetch?.data?.getContentInfoById?.contentInfo?.content_comments)

                }

                //     setComments((prev) =>
                //         prev.map((comment) =>
                //             comment.id === comment_id
                //                 ? { ...comment, likes: comment.likes + (isLiked ? -1 : 1) }
                //                 : comment
                //         )
                //     );
                //     setIsLiked(!isLiked);
                //     console.log(`Successfully toggled like for comment ID: ${comment_id}`);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    //   For posting comment------
    // const addComment = async (message: string) => {
    //     try {



    //     }
    //     catch (err) {
    //         console.error("Error posting comment:", err);
    //     }
    // };


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
            // console.log("responseCommentRefetch", responseCommentRefetch?.data)
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
        // const mentionData = mentionMatches.map(match => ({
        //     name: match[1], // Extract name (e.g., "john")
        //     index: match.index, // Get position in the string
        //     id: nameIdMap[match[1]] || null, // Map to ID from nameIdMap
        // }));

        return indexes


    }

    const getComment = (value: any) => {
        const serverComments = value || [];
        // const formattedComments = serverComments.map(function (comment) {

        //     const parsedObject = safeParse(comment.comment);
        //     var message = (parsedObject as { message?: string }).message;
        //     console.log("message", message);

        //     var mentionedUserId = (parsedObject as { id?: string }).id;
        //     return {
        //         mentionedUserId,
        //         id: comment.id.toString(),
        //         message: data[key]?.comment.replace(/<([^|]+)\|[^>]+>/g, '@$1'),
        //         username: comment.commentor_info?.display_name || "Anonymous",
        //         timeAgo: extractDate(comment?.createdAt),
        //         likes: comment.total_comment_likes || 0,

        //     };
        // });
        let comments = []
        for (let key in serverComments) {
            // isJSONString(serverComments[key]?.comment)

            let comment = {
                id: serverComments[key]?.id,
                timeAgo: extractDate(serverComments[key]?.createdAt),
                message: serverComments[key]?.comment,
                username: serverComments[key].commentor_info?.display_name || "Anonymous",
                commentor_name: serverComments[key]?.commentor_info?.display_name,
                is_Liked: serverComments[key]?.is_liked,
                total_likes: serverComments[key]?.total_comment_likes,
                // tagIdList: getTagIds(serverComments[key]?.comment)
            }
            //  console.log("CONTENTCOMMENTS", comment?.is_Liked)
            comments.push(comment)
        }
        // console.log("CONTENTCOMMENTS", data)
        setComments(comments)
        // setComments(formattedComments);
        console.log("formattedComments", serverComments);
    }

    // const handleTextChange = (text: string) => {
    //     setCommentText(text);
    //     const match = text.match(/@\w*$/);
    //     if (match) {
    //         const prefix = match[0].slice(1);
    //         fetchTagSuggestions(prefix);
    //         setIsTagging(true);
    //     } else {
    //         setIsTagging(false);
    //         setTagSuggestions([]);
    //     }
    // };

    const handleTextChange = (text: string) => {
        setCommentText(text);
        // addComment(text)
        // setCommentAPIText(text)
        console.log("handleTextChange", text);
        // setCommentAPIText(text)
        const match = text.match(/@\w*$/);
        if (match) {
            const prefix = match[0].slice(1);
            fetchTagSuggestions(prefix);
            // setIsTagging(true);
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

    // const fetchTagSuggestions = async (prefix: string) => {
    //     try {
    //         if (prefix.length >= 1) {
    //             await getSearchedUsers({
    //                 variables: {
    //                     input: {
    //                         keyword: prefix,
    //                     },
    //                 },
    //             });
    //         } else {

    //             setTagSuggestions([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching tag suggestions:", error);
    //     }
    // };

    const handleTagSelect = (item: any) => {


        const tagsNews = tagsNew != null ? tagsNew : {}
        console.log("handleTagSelect11", tagsNews, item?.username);
        tagsNews[item?.username.trim()] = item?.id.trim()
        console.log("handleTagSelect22", tagsNews, item);
        setTagsNew(tagsNews)

        const trimedcomment = commentText.replace(/@\w*$/, "",);

        const updatedText = trimedcomment.trim() + ` @${item?.username?.trim()} `
        console.log("trimedcomment", updatedText);
        // const updatedText = comment.replace(/@\w*$/, ` @${item.username} `,);
        // setTags(tagss); // Add the formatted tag


        setCommentText(updatedText)

        setTagSuggestions([]);








    };

    const onSendComment = () => {

        let commentDummy = commentText

        // console.log("updatedStr11", comment, tagsNew?.length, tagsNew);
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
            // addComment(comment)
            setCommentText("")
            setTagsNew(null)
            setTimeout(() => {
                addCommentAPI(commentText)
            }, 1000)
        }

    }

    // const handleTagSelect = (tag: { id: string; username: string }) => {
    //     const updatedText = commentText.replace(/@\w*$/, `@${tag.username}`,);
    //     const updatedId = commentText.replace(/@\w*$/, `${tag.id}`,);
    //     setCommentText(updatedText);
    //     setUserId(updatedId),
    //         setIsTagging(false),
    //         setTagSuggestions([]);
    // };

    // const handleTagPress = (mentionedUserId: string | undefined) => {
    //     console.log(mentionedUserId, 'mentionedUserId');
    //     if (mentionedUserId) {
    //         navigationService.navigate(RouteNames.UserProfile, { id: mentionedUserId });
    //     }
    // };



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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ paddingBottom: config.isWeb ? getHeight(5) : null, height: getHeight(100) }}>
            <WebBaseLayout showSearch={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : "position"}
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                    }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? config.getHeight(1) : 0}
                >
                    {/* <HeaderWeb /> */}
                    <View style={{
                        marginBottom: config.getHeight(46), width: getWidth(60),

                        //backgroundColor: 'white', height: config.getHeight(100)
                    }}>
                        <View style={{ zIndex: 1000, alignSelf: 'flex-start', }}>
                            <CommentInput
                                value={commentText}
                                onChangeText={handleTextChange}
                                tagSuggestions={tagSuggestions}
                                isTagging={isTagging}
                                onTagSelect={handleTagSelect}
                                onSubmit={() => {
                                    onSendComment()
                                    // addComment(commentText);
                                    // setCommentText('');
                                }}
                            />
                        </View>

                        {getCommentsLoading ? (
                            <View style={{ alignSelf: 'center' }}>
                                <ActivityIndicator />
                            </View>
                        ) : (
                            <View style={{ alignSelf: 'flex-start', }}>

                                <CommentsList
                                    comments={comments}
                                    isLiked={isLiked}
                                    toggleLike={toggleLike}
                                    onTagPress={handleTagPress}
                                    tagSuggestions={tagSuggestions}
                                />
                            </View>
                        )}

                    </View>
                </KeyboardAvoidingView>
            </WebBaseLayout>

        </ScrollView>
    );
};

export default CommentsScreenWeb;