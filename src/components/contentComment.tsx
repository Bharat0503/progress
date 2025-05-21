import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList } from 'react-native'
import config from '../utils/config'


import { backgroundColors, borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import LogoText from './logoText'
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux'
import useFetchDimention from '../customHooks/customDimentionHook'
import { setCurrentTab } from '../redux/action'
import { GET_SEARCHED_USERS } from '../services/QueryMethod'
import { useLazyQuery } from '@apollo/client'

interface ContentCommentProps {
    comments: any,
    totalComments: number,
    addComment: (value: string) => void
    addCommentAPI: (value: string) => void
    toggleCommentLike: (id: number) => void
    isAutoFocused?: boolean
    onBlur?:() => void
}



const ContentComment: React.FC<ContentCommentProps> = ({ comments, totalComments, addComment, addCommentAPI, toggleCommentLike, isAutoFocused = false, onBlur }) => {

    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const [comment, setComment] = useState<string>("")
    const [tagSuggestions, setTagSuggestions] = useState<[]>([]);
    const [tags, setTags] = useState<any>([]);
    const [tagsNew, setTagsNew] = useState<any>(null);
    const [getSearchedUsers,
        {
            data: searchedUserData,
            loading: searchedUserLoading,
            error: searchedUserError
        }] = useLazyQuery(GET_SEARCHED_USERS, { fetchPolicy: 'network-only' });


    const inputRef = useRef(null);

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

    const getTagMessage = (tagMsg: object) => {
        console.log("tagMsg", tagMsg)
        return tagMsg
    }

    useEffect(() => {
        if (isAutoFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAutoFocused]);

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
                    // username: user?.first_name + user?.last_name,
                    username: user?.display_name
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

    

    const handleTextChange = (text: string) => {
        setComment(text)
        console.log("handleTextChange", text);
        const match = text.match(/@\w*$/);
        if (match) {
            const prefix = match[0].slice(1);

            fetchTagSuggestions(prefix);
        } else {
            setTagSuggestions([]);
        }
    };

    const handleTagSelect = (item: any) => {

        const tagsNews = tagsNew != null ? tagsNew : {}
        console.log("handleTagSelect11", tagsNews, item?.username);
        tagsNews[item?.username.trim()] = item?.id.trim()
        console.log("handleTagSelect22", tagsNews, item);
        setTagsNew(tagsNews)
        const trimedcomment = comment.replace(/@\w*$/, "",);
        const updatedText = trimedcomment.trim() + ` @${item?.username?.trim()} `
        console.log("trimedcomment", updatedText);
        setComment(updatedText)
        setTagSuggestions([]);
    };

    const onSendComment = () => {

        let commentDummy = comment
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


            addComment(commentDummy)
            setComment("")
            setTagsNew(null)
            setTagSuggestions([]);
            setTimeout(() => {
                addCommentAPI(commentDummy)
            }, 1000)
        }
        else {
            addComment(comment)
            setComment("")
            setTagsNew(null)
            setTimeout(() => {
                addCommentAPI(comment)
            }, 1000)
        }


    }



    const handleTagPress = (id: any) => {
        if (id) {
            navigationService.navigate(RouteNames.UserProfile, { id: id });
        }

    }

    const replaceCommentTag = (value: string) => {
        return value.replace(/<([^|]+)\|[^>]+>/g, '@$1')
    }

    const handleBlur = () => {
        if (onBlur) {
            onBlur(); // Call the onBlur prop to notify the parent component
        }
    };


    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: config.isWeb ? getViewWidth(55) : getWidth(90),
            marginVertical: config.isWeb ? getHeight(0.5) : config.getHeight(2),
            borderRadius: config.isWeb ? getWidth(0.88) : config.getWidth(3.5),
            marginTop: config.isWeb ? getHeight(0.5) : config.getHeight(1),
            borderColor: borderColors.signInBorder, borderWidth: 1
        }}>
            {
                tagSuggestions?.length !== 0
                    ?
                    <View style={{
                        position: 'absolute',
                        top: config.isWeb ? -getHeight(8) : -config.getHeight(16),
                        // bottom: config.isWeb ? getHeight(10) : null,
                        width: config.isWeb ? getViewWidth(55) : config.getWidth(90),
                        height: config.isWeb ? getHeight(10) : config.getHeight(20),
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        // overflow: 'hidden',
                        alignItems: 'flex-end',
                        zIndex: 999,

                    }}>
                        <View style={{
                            width: config.isWeb ? getViewWidth(55) : getWidth(90),
                            backgroundColor: 'red',

                            borderWidth: 1,
                            borderRadius: config.isWeb ? getWidth(0.5) : config.getWidth(2),
                            overflow: 'hidden',
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <FlatList
                                data={tagSuggestions}
                                keyExtractor={item => item?.id}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                // scrollEnabled={false}
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity
                                        style={{ padding: config.isWeb ? getWidth(0.25) : config.getWidth(1) }}
                                        onPress={() => handleTagSelect(item)}
                                    >
                                        <Text style={{

                                        }}>{item?.username}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{}}
                                style={{ backgroundColor: commonColors.white, }}

                            />
                        </View>

                    </View>
                    : null
            }

            <View style={{
                width: config.isWeb ? getViewWidth(50) : config.getWidth(80),
                // backgroundColor: 'pink',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: config.isWeb ? getHeight(0.5) : config.getHeight(1), flexDirection: 'row'
            }}>

                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'bold',
                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16)
                }}>
                    Comments
                </Text>

                <Text style={{
                    color: textColors.spaceName,
                    fontFamily: 'bold',
                    fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(14)
                }}>
                    {comments?.length} Comments
                </Text>




            </View>

            <View style={{
                width: config.isWeb ? getViewWidth(50) : getWidth(80),

                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1, borderBottomColor: borderColors.commentTextInput,
                flexDirection: 'row',

            }}>
                <TextInput
                    allowFontScaling={false}
                    ref={inputRef}
                    style={{
                        color: textColors.commentText,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3) : config.generateFontSizeNew(16),
                        height: config.isWeb ? getHeight(5) : config.getHeight(5),
                        width: config.isWeb ? getViewWidth(46) : config.getWidth(71),
                        padding: config.isWeb ? getViewWidth(1) : null,

                    }}
                    placeholderTextColor={textColors.commentText}
                    onChangeText={(value) => handleTextChange(value)}
                    value={comment}
                    placeholder="Add a comment..."
                    keyboardType="email-address"
                    autoFocus={isAutoFocused}
                    onBlur={handleBlur}
                />
                <TouchableOpacity onPress={() => {
                    onSendComment()
                }} style={{
                    width: config.isWeb ? getWidth(2.25) : config.getWidth(9),
                    height: config.isWeb ? getHeight(2.5) : config.getHeight(5),
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Image
                        style={{
                            width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                            height: config.isWeb ? getHeight(2.5) : config.getHeight(5),
                        }}

                        source={Icons.messageSend}
                        resizeMode='contain'

                    />
                </TouchableOpacity>

            </View>

            <View style={{
                width: config.isWeb ? getViewWidth(50) : getWidth(80),
                minHeight: config.isWeb ? getHeight(2) : config.getHeight(4),
                maxHeight: config.isWeb ? getHeight(20) : config.getHeight(40),
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <FlatList
                    data={comments}
                    keyExtractor={item => item?.id}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}

                    renderItem={({ item }: any) => (


                        < View style={{
                            width: config.isWeb ? getViewWidth(50) : config.getWidth(80),
                            marginVertical: config.getHeight(1),
                            paddingVertical: config.getHeight(1),
                            // backgroundColor: 'pink'
                        }}>
                            <View style={{}}>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        fontFamily: 'bold',
                                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: commonColors.black
                                    }}>
                                        {item?.commentor_name} <Text style={{
                                            fontFamily: 'regular',
                                            fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: textColors.commentText
                                        }}>
                                            {item?.createdAt}
                                        </Text>
                                    </Text>



                                </View>
                                <View style={{}}>


                                    <Text style={{

                                        flexDirection: 'row', // Ensures text stays in one line
                                        flexWrap: 'wrap',
                                    }}>


                                        {item?.comment.split(/(\<[^>]+\>)/).filter(Boolean).map((part: string, index: number) =>
                                            /<([^|]+)\|[^>]+>/g.test(part) ? (
                                                <Text
                                                    key={index}
                                                    style={{
                                                        fontFamily: 'bold',
                                                        fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: commonColors.black
                                                    }}
                                                    onPress={() => {
                                                        const textWithIds = part.split("|")
                                                        const textWithIds1 = textWithIds[1].split(">")
                                                        if (textWithIds1[0]) {
                                                            handleTagPress(textWithIds1[0])
                                                        }

                                                    }}
                                                >
                                                    {replaceCommentTag(part)}
                                                </Text>
                                            ) : (
                                                <Text style={{
                                                    fontFamily: 'regular',
                                                    fontSize: config.isWeb ? getFontSize(4) : config.generateFontSizeNew(16), color: textColors.commentText
                                                }} key={index}>{part}</Text>
                                            )

                                        )}
                                    </Text>



                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                toggleCommentLike(item?.id)
                            }} style={{
                                justifyContent: 'center', alignItems: 'flex-end',
                                paddingRight: config.isWeb ? getWidth(0.25) : config.getWidth(1)
                            }}>
                                <Image
                                    style={{
                                        width: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                        height: config.isWeb ? getWidth(1.25) : config.getWidth(5),
                                    }}
                                    source={item?.is_Liked ? Icons.contentLiked : Icons.contentLike}
                                    resizeMode='contain'

                                />
                            </TouchableOpacity>

                        </View>
                    )}

                />


            </View>


        </View >


    )

}

const styles = StyleSheet.create({

})


export default ContentComment