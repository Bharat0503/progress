import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import config from '../utils/config'
import { borderColors, commonColors, backgroundColors } from '../utils/colors'
import { useDispatch, useSelector } from 'react-redux'
import { handleUpdateProfileAPI } from '../api/commonApiMethod'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_PROFILE, GET_CONFIG, UPDATE_PROFILE } from '../services/MutationMethod'
import { setLoading, setToken, setUserId, setAffiliations, setSpecialities, setTitles } from '../redux/action'
import navigationService from '../navigation/navigationService'
import RouteNames from '../navigation/routes'
import { setAsyncData } from '../utils/storage'
import { keys } from '../utils/keys'
import { configAPIDataHandling } from '@/src/api/commonDataHandling';
import useFetchDimention from '../customHooks/customDimentionHook'



const SignupForm: React.FC = () => {
    useFetchDimention();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [yearsOfPractice, setYearsOfPractice] = useState<number>();
    const [customTitle, setCustomTitle] = useState('');
    const [customAffiliation, setCustomAffiliation] = useState('');
    const [customSpeciality, setCustomSpeciality] = useState('');
    const [speciality, setSpeciality] = useState("")
    const [specialityId, setSpecialityId] = useState(0)
    const [specialityVisible, setSpecialityVisible] = useState(false)
    const [title, setTitle] = useState("")
    const [titleId, setTitleId] = useState(0)
    const [titleVisible, setTitleVisible] = useState(false)
    const [affiliation, setAffiliation] = useState("")
    const [affiliationId, setAffiliationId] = useState(0)
    const [affiliationVisible, setAffiliationVisible] = useState(false)
    const SpecialityData = useSelector((state: any) => state.reducer.specialities)
    const tempToken = useSelector((state: any) => state.reducer.tempToken)
    const tempUserId = useSelector((state: any) => state.reducer.tempUserId)
    // const SpecialityData = [
    //     { id: 1, name: 'Dr.' },
    //     { id: 2, name: 'Dr.' },
    //     { id: 3, name: 'Dr.' },
    //     { id: 4, name: 'Dr.' },
    // ]
    const TitlesData = useSelector((state: any) => state.reducer.titles)
    // const TitlesData = [
    //     { id: 1, name: 'Dr.' },
    //     { id: 2, name: 'Dr.' },
    //     { id: 3, name: 'Dr.' },
    //     { id: 4, name: 'Dr.' },
    // ]
    // const slideAnim = useRef(new Animated.Value(-100)).current;

    const AffiliationsData = useSelector((state: any) => state.reducer.affiliation)
    // const AffiliationsData =
    //     [
    //         { id: 1, name: 'Dr.' },
    //         { id: 2, name: 'Dr.' },
    //         { id: 3, name: 'Dr.' },
    //         { id: 4, name: 'Dr.' },
    //     ]
    const [errorMessage, setErrorMessage] = useState("")
    const [updateProfile] = useMutation(CREATE_PROFILE);
    const [message, setMessage] = useState("")
    type ItemProps = { title: string, id: number, type: string };
    const isLoading = useSelector((state: any) => state.reducer.loading)
    const dispatch = useDispatch()
    const [enableScroll, onEnableScroll] = useState(false)
    const { loading, error, data } = useQuery(GET_CONFIG);

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



    useEffect(() => {
        if (!loading) {
            // console.log("CONFIG DATA", data, loading)
            const { affiliation, specialities, titles } = configAPIDataHandling(data)
            console.log("CONFIG DATA", specialities)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setTitles(titles))

        }
    }, [loading])

    const errorHandling = (errorMessage: any) => {
        setErrorMessage(errorMessage)
        dispatch(setLoading(false))
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    const handleProfileUpdateAPI = async () => {
        dispatch(setLoading(true))



        const response = await handleUpdateProfileAPI(updateProfile, firstname, lastname, affiliationId, specialityId, titleId, customAffiliation, customSpeciality, customTitle, yearsOfPractice, errorHandling)
        console.log("handleProfileUpdateAPI", response)
        if (response?.data) {
            setMessage(response?.data?.createProfile?.message)

            setAsyncData(keys.userToken, tempToken)
            setAsyncData(keys.userId, tempUserId)
            dispatch(setToken(tempToken))
            dispatch(setUserId(tempUserId))

            dispatch(setLoading(false))
            // navigationService.navigate(RouteNames.Home)
            setTimeout(() => {
                setMessage("")
            }, 4000)
        }
    }

    const Item = ({ title, id, type }: ItemProps) => (

        <TouchableOpacity onPress={() => {
            if (type === 'Speciality') {
                setSpeciality(title)
                setSpecialityId(id)
                setSpecialityVisible(false)
            }
            else if (type === 'Title') {
                setTitle(title)
                setTitleId(id)
                setTitleVisible(false)
            }
            else {
                setAffiliation(title)
                setAffiliationId(id)
                setAffiliationVisible(false)
            }
        }} style={{
            backgroundColor: commonColors.white, marginHorizontal: config.getWidth(0.1), zIndex: 999,
        }}>
            <Text style={{
                color: commonColors.black,
                fontFamily: 'regular',
                fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                marginHorizontal: config.isWeb ? getWidth(0.3) : config.getWidth(1.5), zIndex: 999,

            }}>{title}</Text>
        </TouchableOpacity>

    );





    console.log('SpecialityData' + JSON.stringify(SpecialityData))


    return (

        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>



            <Text style={{
                color: commonColors.black,
                fontFamily: 'regular',
                fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                marginTop: config.isWeb ? getHeight(2) : 0,
                marginBottom: config.isWeb ? getHeight(3.5) : config.getHeight(3.5)
            }}>
                To help us customize your app experience, please complete the following profile information
            </Text>

            <View style={{

                width: config.isWeb ? getWidth(60) : config.getWidth(90)
            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.isWeb ? getHeight(1) : config.getHeight(1),
                }}>
                    Title <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.isWeb ? getHeight(1) : config.getHeight(1),
                    }}>*</Text>
                </Text>

                <TouchableOpacity onPress={() => {

                    setTitleVisible(!titleVisible)

                }
                } style={{
                    height: config.isWeb ? getHeight(5) : config.getHeight(7),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    borderColor: borderColors.textInputBorder,
                    borderWidth: config.isWeb ? 0.1 : 1,
                    borderTopLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderTopRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomLeftRadius: titleVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomRightRadius: titleVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Text style={{ color: commonColors.black }}>
                        {title}
                    </Text>
                    <Image
                        style={{
                            height: config.isWeb ? getHeight(0.7) : config.getHeight(2),
                            width: config.isWeb ? getWidth(0.5) : config.getWidth(3),
                            marginRight: config.isWeb ? getWidth(0.6) : config.getWidth(1.2),
                            marginTop: config.isWeb ? 1 : 3
                        }}
                        source={require('../assets/icons/DropDown.png')}
                        resizeMode='contain'

                    />

                </TouchableOpacity>
                {titleVisible ?
                    <View style={[{
                        marginTop: config.getHeight(0.2),
                        position: 'absolute',
                        bottom: config.isWeb ? -config.getHeight(9.5) : -config.getHeight(10.5),
                        zIndex: 1,
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        // borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                        borderTopLeftRadius: titleVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderTopRightRadius: titleVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        overflow: 'hidden',
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        // height: config.getHeight(20),
                        padding: 5,
                        backgroundColor: commonColors.white
                    },
                    ]}>
                        <FlatList
                            data={TitlesData}
                            renderItem={({ item }) => <Item title={item.name} id={item.id} type='Title' />}
                            keyExtractor={item => item.id}
                            // style={{ flex: 1, backgroundColor: backgroundColors.offWhite }}
                            style={{ height: config.isWeb ? getHeight(8.5) : config.getHeight(10) }}
                            onTouchStart={() => {
                                onEnableScroll(false);
                            }}
                            nestedScrollEnabled
                            onMomentumScrollEnd={() => {
                                onEnableScroll(true);
                            }}
                        />

                    </View>
                    : null}


            </View>
            {
                title === "Others" &&


                <View style={{
                    marginTop: config.getHeight(2),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    zIndex: -1

                }}>
                    <Text style={{
                        color: commonColors.black,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        alignSelf: 'flex-start',
                        marginBottom: config.getHeight(1)
                    }}>
                        Current Title <Text style={{
                            color: commonColors.red,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                            marginBottom: config.getHeight(1)
                        }}>*</Text>
                    </Text>

                    <TextInput
                        allowFontScaling={false}
                        style={{
                            height: config.isWeb ? getHeight(5) : config.getHeight(7),
                            width: config.isWeb ? getWidth(60) : config.getWidth(90),
                            borderColor: borderColors.textInputBorder,
                            borderWidth: config.isWeb ? 0.1 : 1,
                            borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                            paddingHorizontal: 10,
                            backgroundColor: '#fff',
                        }}
                        maxLength={100}
                        value={customTitle}
                        onChangeText={setCustomTitle}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            }


            <View style={{
                marginTop: config.getHeight(2),
                width: config.isWeb ? getWidth(60) : config.getWidth(90),
                zIndex: -1

            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.getHeight(1)
                }}>
                    First name <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.getHeight(1)
                    }}>*</Text>
                </Text>

                <TextInput
                    allowFontScaling={false}
                    style={{
                        height: config.isWeb ? getHeight(5) : config.getHeight(7),
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        paddingHorizontal: 10,
                        backgroundColor: '#fff',
                    }}
                    maxLength={100}
                    value={firstname}
                    onChangeText={setFirstName}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>


            <View style={{
                marginTop: config.getHeight(2),
                width: config.isWeb ? getWidth(60) : config.getWidth(90),
                zIndex: -1

            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.getHeight(1)
                }}>
                    Last name <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.getHeight(1)
                    }}>*</Text>
                </Text>

                <TextInput
                    style={{
                        height: config.isWeb ? getHeight(5) : config.getHeight(7),
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        paddingHorizontal: 10,
                        backgroundColor: '#fff',
                    }}
                    maxLength={100}
                    value={lastname}
                    onChangeText={setLastName}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>



            <View style={{
                marginTop: config.getHeight(2),
                width: config.isWeb ? getWidth(60) : config.getWidth(90),
            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.getHeight(1)
                }}>
                    Affiliation(s)
                    <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.getHeight(1)
                    }}>*</Text>
                </Text>

                <TouchableOpacity onPress={() => setAffiliationVisible(!affiliationVisible)} style={{
                    height: config.isWeb ? getHeight(5) : config.getHeight(7),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    borderColor: borderColors.textInputBorder,
                    borderWidth: config.isWeb ? 0.1 : 1,
                    borderTopLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderTopRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomLeftRadius: affiliationVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomRightRadius: affiliationVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Text style={{ color: commonColors.black }}>
                        {affiliation}
                    </Text>
                    <Image
                        style={{
                            height: config.isWeb ? getHeight(0.7) : config.getHeight(2),
                            width: config.isWeb ? getWidth(0.5) : config.getWidth(3),
                            marginRight: config.isWeb ? getWidth(0.6) : config.getWidth(1.2),
                            marginTop: config.isWeb ? 1 : 3
                        }}
                        source={require('../assets/icons/DropDown.png')}
                        resizeMode='contain'

                    />

                </TouchableOpacity>
                {affiliationVisible ?
                    <View style={{
                        marginTop: config.getHeight(0.2),
                        position: 'absolute',
                        bottom: config.isWeb ? -config.getHeight(9.5) : -config.getHeight(10.5),
                        zIndex: 1,
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        // borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                        borderTopLeftRadius: affiliationVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderTopRightRadius: affiliationVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        overflow: 'hidden',
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        // height: config.getHeight(20),
                        padding: 5,
                        backgroundColor: commonColors.white,
                    }}>
                        <FlatList
                            data={AffiliationsData}
                            renderItem={({ item }) => <Item title={item.name} id={item.id} type='Affiliation' />}
                            keyExtractor={item => item.id}
                            style={{ height: config.isWeb ? getHeight(8.5) : config.getHeight(10) }}
                            onTouchStart={() => {
                                onEnableScroll(false);
                            }}
                            nestedScrollEnabled
                            onMomentumScrollEnd={() => {
                                onEnableScroll(true);
                            }}
                        // contentContainerStyle={{
                        //     flex: 1,
                        // }}
                        />

                    </View>
                    : null}
            </View>


            {
                affiliation === "Others" &&


                <View style={{
                    marginTop: config.getHeight(2),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    zIndex: -1

                }}>
                    <Text style={{
                        color: commonColors.black,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        alignSelf: 'flex-start',
                        marginBottom: config.getHeight(1)
                    }}>
                        Current Affiliation <Text style={{
                            color: commonColors.red,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                            marginBottom: config.getHeight(1)
                        }}>*</Text>
                    </Text>

                    <TextInput
                        allowFontScaling={false}
                        style={{
                            height: config.isWeb ? getHeight(5) : config.getHeight(7),
                            width: config.isWeb ? getWidth(60) : config.getWidth(90),
                            borderColor: borderColors.textInputBorder,
                            borderWidth: config.isWeb ? 0.1 : 1,
                            borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                            paddingHorizontal: 10,
                            backgroundColor: '#fff',
                        }}
                        maxLength={100}
                        value={customAffiliation}
                        onChangeText={setCustomAffiliation}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            }

            <View style={{
                width: config.isWeb ? getWidth(60) : config.getWidth(90), marginTop: config.getHeight(2), zIndex: -1
            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.getHeight(1)
                }}>
                    Speciality
                    <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.getHeight(1)
                    }}>*</Text>
                </Text>
                <TouchableOpacity onPress={() => setSpecialityVisible(!specialityVisible)} style={{
                    height: config.isWeb ? getHeight(5) : config.getHeight(7),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    borderColor: borderColors.textInputBorder,
                    borderWidth: config.isWeb ? 0.1 : 1,
                    borderTopLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderTopRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomLeftRadius: specialityVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    borderBottomRightRadius: specialityVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Text style={{ color: commonColors.black }}>
                        {speciality}
                    </Text>
                    <Image
                        style={{
                            height: config.isWeb ? getHeight(0.7) : config.getHeight(2),
                            width: config.isWeb ? getWidth(0.5) : config.getWidth(3),
                            marginRight: config.isWeb ? getWidth(0.6) : config.getWidth(1.2),
                            marginTop: config.isWeb ? 1 : 3
                        }}
                        source={require('../assets/icons/DropDown.png')}
                        resizeMode='contain'

                    />

                </TouchableOpacity>
                {specialityVisible ?
                    <View style={{
                        marginTop: config.getHeight(0.2),
                        position: 'absolute',
                        bottom: config.isWeb ? -config.getHeight(9.5) : -config.getHeight(10.5),
                        zIndex: 1,
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        // borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                        borderTopLeftRadius: specialityVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderTopRightRadius: specialityVisible ? 0 : config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomLeftRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        borderBottomRightRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        overflow: 'hidden',
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        padding: 5,
                        backgroundColor: commonColors.white
                    }}>

                        <FlatList
                            data={SpecialityData}
                            renderItem={({ item }) => <Item title={item.name} id={item.id} type='Speciality' />}
                            keyExtractor={item => item.id}
                            //scrollEnabled={false}
                            style={{ height: config.isWeb ? getHeight(8.5) : config.getHeight(10) }}
                            onTouchStart={() => {
                                onEnableScroll(false);
                            }}
                            nestedScrollEnabled
                            onMomentumScrollEnd={() => {
                                onEnableScroll(true);
                            }}
                        />

                    </View>
                    : null}


            </View>

            {
                speciality === "Others" &&


                <View style={{
                    marginTop: config.getHeight(2),
                    width: config.isWeb ? getWidth(60) : config.getWidth(90),
                    zIndex: -2

                }}>
                    <Text style={{
                        color: commonColors.black,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        alignSelf: 'flex-start',
                        marginBottom: config.getHeight(1)
                    }}>
                        Current Speciality <Text style={{
                            color: commonColors.red,
                            fontFamily: 'regular',
                            fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                            marginBottom: config.getHeight(1)
                        }}>*</Text>
                    </Text>

                    <TextInput
                        allowFontScaling={false}
                        style={{
                            height: config.isWeb ? getHeight(5) : config.getHeight(7),
                            width: config.isWeb ? getWidth(60) : config.getWidth(90),
                            borderColor: borderColors.textInputBorder,
                            borderWidth: config.isWeb ? 0.1 : 1,
                            borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                            paddingHorizontal: 10,
                            backgroundColor: '#fff',
                        }}
                        maxLength={100}
                        value={customSpeciality}
                        onChangeText={setCustomSpeciality}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            }

            <View style={{
                marginTop: config.getHeight(2),
                width: config.isWeb ? getWidth(60) : config.getWidth(90),
                zIndex: -2

            }}>
                <Text style={{
                    color: commonColors.black,
                    fontFamily: 'regular',
                    fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                    alignSelf: 'flex-start',
                    marginBottom: config.getHeight(1)
                }}>
                    Years of practice <Text style={{
                        color: commonColors.red,
                        fontFamily: 'regular',
                        fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14),
                        marginBottom: config.getHeight(1)
                    }}>*</Text>
                </Text>

                <TextInput
                    allowFontScaling={false}
                    style={{
                        height: config.isWeb ? getHeight(5) : config.getHeight(7),
                        width: config.isWeb ? getWidth(60) : config.getWidth(90),
                        borderColor: borderColors.textInputBorder,
                        borderWidth: config.isWeb ? 0.1 : 1,
                        borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                        paddingHorizontal: 10,
                        backgroundColor: '#fff',
                    }}
                    maxLength={4}
                    value={yearsOfPractice}
                    onChangeText={setYearsOfPractice}
                    keyboardType='numeric'
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>




            {
                message &&
                <Text style={[styles.messageText, { color: commonColors.darKGreen, fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14), }]}>{message}</Text>
            }

            {
                errorMessage &&
                <Text style={[styles.messageText, { color: commonColors.red, fontSize: config.isWeb ? getFontSize(3.2) : config.generateFontSizeNew(14), }]}>{errorMessage}</Text>
            }

            <TouchableOpacity disabled={isLoading} onPress={() => {
                if (affiliationId !== 0 && titleId !== 0 && specialityId !== 0 && firstname !== "" && lastname !== "" && yearsOfPractice !== -1) {
                    handleProfileUpdateAPI()
                }
                else {
                    setErrorMessage("Please enter all the fields")
                    setTimeout(() => {
                        setErrorMessage("")
                    }, 4000)
                }


            }} style={[message || errorMessage ? {
                borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: -2,

                width: config.isWeb ? getWidth(8) : config.getWidth(40),
                height: config.isWeb ? getHeight(5) : config.getHeight(7),
                backgroundColor: backgroundColors.signInButton,
                // marginTop: config.getHeight(4),
                marginBottom: config.getHeight(4)



            } :
                {
                    borderRadius: config.isWeb ? getWidth(0.7) : config.getWidth(4),
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: -2,
                    width: config.isWeb ? getWidth(8) : config.getWidth(40),
                    height: config.isWeb ? getHeight(5) : config.getHeight(7),
                    backgroundColor: backgroundColors.signInButton,
                    marginTop: config.getHeight(4),
                    marginBottom: config.getHeight(4)



                }
            ]}>

                {
                    isLoading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator />
                        </View>
                        :


                        <Text style={{
                            color: commonColors.white,
                            fontSize: config.isWeb ? getFontSize(3.5) : config.generateFontSizeNew(18),
                            fontFamily: 'regular',
                            zIndex: -1,
                        }}>
                            Save
                        </Text>
                }
            </TouchableOpacity>



        </View >

    )

}

const styles = StyleSheet.create({
    messageText: {
        fontFamily: 'regular',

        // position: 'absolute',
        // bottom: config.getHeight(20),
        marginTop: config.getHeight(4),
        marginBottom: config.getHeight(2)
    }
})


export default SignupForm