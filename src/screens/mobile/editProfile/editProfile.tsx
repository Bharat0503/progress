import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import config from '../../../utils/config'
import { commonColors, backgroundColors, borderColors, textColors } from '@/src/utils/colors'
import navigationService from '@/src/navigation/navigationService';
import RouteNames from '@/src/navigation/routes';
import { keys } from '@/src/utils/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/src/components/header';
import Icons from '@/src/assets/icons';
import { GET_SUB_SPECIALITY, GET_USER_DETAILS } from '@/src/services/QueryMethod';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_ACCOUNT, GET_CONFIG, UPDATE_PROFILE, UPLOAD_PROFILE_IMAGE } from '@/src/services/MutationMethod';
import { setAffiliations, setCountries, setSpecialities, setSubSpecialities, setTempToken, setTempUserId, setTitles, setToken, setTrainees, setUserId } from '@/src/redux/action';
import { useDispatch } from 'react-redux';
import TitleInput from '@/src/components/titleInput';
import DropDown from '@/src/components/dropDown';
import { useSelector } from 'react-redux';
import { configAPIDataHandling } from '@/src/api/commonDataHandling';
import * as ImagePicker from 'expo-image-picker';
import formDataAppendFile from 'apollo-upload-client/formDataAppendFile.mjs';
import { useIsFocused } from '@react-navigation/native';
import { getAsyncData } from '@/src/utils/storage';
import { BASE_API_URL_PROD } from '@/src/components/GlobalConstant';



const EditProfile: React.FC = (props) => {
    const userDetail = useSelector((state: any) => state.reducer.userDetails)
    const [firstName, setFirstName] = useState<string>(userDetail?.first_name)
    const [lastName, setLastName] = useState<string>(userDetail?.last_name)
    const [displayName, setDisplayName] = useState<string>(userDetail?.display_name)
    const [email, setEmail] = useState<string>(userDetail?.email)
    const [profileImage, setProfileImage] = useState<any>(userDetail?.profile_image_path)
    console.log("userDetail", userDetail)
    const [phoneNumber, setPhoneNumber] = useState<string>(userDetail?.phone)

    const dispatch = useDispatch()
    const [uploadImage] = useMutation(UPLOAD_PROFILE_IMAGE);
    const [updateProfile] = useMutation(UPDATE_PROFILE)








    const SpecialityData = useSelector((state: any) => state.reducer.specialities)
    const SubSpecialityData = useSelector((state: any) => state.reducer.subSpecialities)
    const TitlesData = useSelector((state: any) => state.reducer.titles)
    const AffiliationsData = useSelector((state: any) => state.reducer.affiliation)
    const CountryData = useSelector((state: any) => state.reducer.country)
    const TraineeData = useSelector((state: any) => state.reducer.trainee)

    const [subSpeciality, setSubSpeciality] = useState<string>(userDetail?.sub_speciality_info?.name)
    const [subSpecialityId, setSubSpecialityId] = useState<number>(userDetail?.sub_speciality_info?.id)
    const [country, setCountry] = useState<string>(userDetail?.country_info?.name)
    const [country_code, setCountryCode] = useState<string>(userDetail?.country_code)
    const [calling_code, setCallingCode] = useState<string>(userDetail?.country_info?.country_calling_code)
    const [countryId, setCountryId] = useState(0)
    const [trainee, setTrainee] = useState<string>(userDetail?.trainee_level_info?.name)
    const [traineeId, setTraineeId] = useState<number>(userDetail?.trainee_level_info?.id)
    const [yearsOfPractice, setYearsOfPractive] = useState(userDetail?.years_of_practice?.toString())

    const [title, setTitle] = useState<string>(userDetail?.title_info?.name)
    const [titleId, setTitleId] = useState<number>(userDetail?.title_info?.id)
    const [speciality, setSpeciality] = useState<string>(userDetail?.speciality_info?.name)
    const [specialityId, setSpecialityId] = useState<number>(userDetail?.speciality_info?.id)
    const [affiliation, setAffiliation] = useState<string>(userDetail?.affiliation_info?.name)
    const [affiliationId, setAffiliationId] = useState<number>(userDetail?.affiliation_info?.id)
    const [getSubSpeciality, {
        data: subSpecialityData,
        loading: subSpecialityLoading,
        error: subSpecialityError,
    }] = useLazyQuery(GET_SUB_SPECIALITY,
        {
            variables: {
                input: {
                    speciality: specialityId
                }
            }
        }
    )

    console.log("SubSpecialityData111", subSpecialityData?.getSubSpecialitiesBySpeciality?.subSpecialities)
    //console.log("TYPEOF", typeof userDetail?.affiliation_info?.id)

    const [firstNameError, setFirstNameError] = useState<string>("")
    const [lastNameError, setLastNameError] = useState<string>("")
    const [displayNameError, setDisplayNameError] = useState<string>("")
    const [emailError, setEmailError] = useState<string>("")
    const [titleError, setTitleError] = useState<string>("")
    const [specialityError, setSpecialityError] = useState<string>("")
    const [affiliationError, setAffiliationError] = useState<string>("")
    const [customTitleError, setCustomTitleError] = useState<string>("")
    const [customSpecialityError, setCustomSpecialityError] = useState<string>("")
    const [customAffiliationError, setCustomAffiliationError] = useState<string>("")
    const [yearsOfPracticeError, setYearsOfPractiveError] = useState<string>("")
    const [token, setToken] = useState<string>("")

    const [imageLoading, setLoading] = useState(true);

    const [customTitle, setCustomTitle] = useState<string>(userDetail?.custom_info?.custom_title);
    const [customAffiliation, setCustomAffiliation] = useState<string>(userDetail?.custom_info?.custom_affiliation);
    const [customSpeciality, setCustomSpeciality] = useState<string>(userDetail?.custom_info?.custom_speciality);

    const { loading, error, data } = useQuery(GET_CONFIG);
    const [dataLoader, setDataLoader] = useState(false)
    const isFocused = useIsFocused();

    const handleDisplayName = (firstname: string, lastname: string) => {
        setDisplayName(firstname + " " + lastname)
    }
    const handleFirstName = (value: string) => {
        setFirstName(value)
        setFirstNameError("")
        handleDisplayName(value, lastName)
    }
    const handleLastName = (value: string) => {
        setLastName(value)
        setLastNameError("")
        handleDisplayName(firstName, value)
    }

    const handleEmail = (value: string) => {
        setEmail(value)
    }
    const handlePhone = (value: string) => {
        setPhoneNumber(value)
    }
    const handleTitle = (value: string, valueId: number) => {
        setTitle(value)
        setTitleId(valueId)
        setTitleError("")
    }
    const handleAffiliation = (value: string, valueId: number) => {
        setAffiliation(value)
        setAffiliationId(valueId)
        setAffiliationError("")
    }
    const handleSpeciality = async (value: string, valueId: number) => {
        setSpeciality(value)
        setSpecialityId(valueId)
        setSpecialityError("")
        setSubSpeciality("")
        setSubSpecialityId(0)

        // console.log("speciality", typeof valueId)
        // await refetch()
        // console.log("getSubSpeciality2222", response?.data?.getSubSpecialitiesBySpeciality?.subSpecialities)
        // if (response?.data) {

        //     let subSpeciality = response?.data?.getSubSpecialitiesBySpeciality?.subSpecialities
        //     if (subSpeciality.length !== 0) {
        //         let modifiedSubSpeciality = []
        //         for (let value in subSpeciality) {
        //             console.log("getSubSpeciality3333", value)
        //             let subSpeciality_value = {
        //                 id: subSpeciality[value]?.id,
        //                 name: subSpeciality[value]?.name
        //             }
        //             modifiedSubSpeciality.push(subSpeciality_value)
        //         }
        //         dispatch(setSubSpecialities(modifiedSubSpeciality))


        //     }
        //     else {
        //         dispatch(setSubSpecialities([]))

        //     }

        // }
    }
    const handleCustomTitle = (value: string) => {
        setCustomTitle(value)
        setCustomTitleError("")
    }
    const handleCustomAffiliation = (value: string) => {
        setCustomAffiliation(value)
        setCustomAffiliationError("")
    }
    const handleCustomSpeciality = (value: string) => {
        setCustomSpeciality(value)
        setCustomSpecialityError("")
    }
    const handleSubSpeciality = (value: string, valueId: number) => {
        setSubSpeciality(value)
        setSubSpecialityId(valueId)
    }


    const handleCountry = (value: string, valueId: number) => {
        setCountry(value)
        setCountryId(valueId)
        CountryData.find((element: any) => {
            if (element.name === value) {
                setCallingCode(element?.calling_code)
                setCountryCode(element?.country_code)
            }
            // console.log("ELEMENT", element.name)
        })
    }

    const handleTrainee = (value: string, valueId: number) => {
        setTrainee(value)
        setTraineeId(valueId)
    }

    const handleYearsOfPractice = (value: number) => {
        setYearsOfPractive(value)
        setYearsOfPractiveError("")
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            const formData = new FormData();
            formData.append('profile_image', {
                uri: result.assets[0].uri, // File URI
                type: result.assets[0].mimeType,
                name: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`
            } as any);
            try {
                const response = await fetch(
                    `${BASE_API_URL_PROD}/uploadProfileImage`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`, // Add the token here
                        },
                        body: formData
                    }
                );
                console.log("uploadProfileImage", response)
            }
            catch (error) {
                console.log("uploadProfileImageError", error)
            }
        }


    };

    const uploadProfileImage = async () => {


    }

    const updateProfileAPI = async () => {
        console.log("TYPEOF", subSpecialityId)
        setDataLoader(true)
        const input = {
            "affiliation": affiliationId,
            "speciality": specialityId,
            "title": titleId,
            "custom_title": customTitle ? customTitle : "",
            "custom_affiliation": customAffiliation ? customAffiliation : "",
            "custom_speciality": customSpeciality ? customSpeciality : "",
            "country": country_code ? country_code : "",
            "country_code": calling_code ? calling_code : "",
            "first_name": firstName ? firstName : "",
            "last_name": lastName ? lastName : "",
            "trainee_level": traineeId,
            "years_of_practice": parseInt(yearsOfPractice, 10),

            // "custom_sub_speciality": null,
            // "custom_trainee_level": null,
            // "email": null,

            // "is_private_messaging_allowed": null,

            // "phone": null,
            // "record_status": null,
            "sub_speciality": subSpeciality ? subSpecialityId : null,

            // "username": null,

        }
        // if (subSpecialityId) {
        //     input["sub_speciality"] = subSpecialityId;
        // }
        console.log("INPUT", input)
        const response = await updateProfile({
            variables: { input: input }
        })
        console.log("uploadProfileImage", response)
        if (response?.data?.updateProfile?.success) {
            setDataLoader(false)
            Alert.alert(response?.data?.updateProfile?.message)
            setTimeout(() => {
                navigationService.goBack()
            }, 1000)


        }
        else {
            setDataLoader(false)
            // Alert.alert(response?.data?.updateProfile?.message)
        }
    }

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    useEffect(() => {
        // if (isFocused) {


        const fetchSubSpecialityData = async () => {
            // alert(subSpeciality)
            let getSubSpecialityData = await getSubSpeciality(
                {
                    variables: {
                        input: {
                            speciality: specialityId
                        }
                    }
                }
            )
            console.log("fetchSubSpecialityData", getSubSpecialityData?.data?.getSubSpecialitiesBySpeciality?.subSpecialities)
            let subSpecialityList = getSubSpecialityData?.data?.getSubSpecialitiesBySpeciality?.subSpecialities
            if (subSpecialityList.length !== 0) {
                let modifiedSubSpeciality = []
                for (let value in subSpecialityList) {
                    console.log("getSubSpeciality3333", value)
                    let subSpeciality_value = {
                        id: subSpecialityList[value]?.id,
                        name: subSpecialityList[value]?.name
                    }
                    modifiedSubSpeciality.push(subSpeciality_value)
                }
                dispatch(setSubSpecialities(modifiedSubSpeciality))


            }
            else {
                dispatch(setSubSpecialities([]))

            }
        }


        fetchSubSpecialityData()



    }, [specialityId])


    useEffect(() => {
        if (!loading) {
            // console.log("CONFIG DATA", data, loading)

            const { affiliation, specialities, titles, country, traineeLevels } = configAPIDataHandling(data)
            // console.log("CONFIGDATA", country)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setTitles(titles))
            dispatch(setCountries(country))
            dispatch(setTrainees(traineeLevels))

        }
    }, [loading])

    useEffect(() => {
        const init = async () => {
            const token = await getAsyncData(keys.userToken)
            console.log('tokentokentokentokentoken' + token);
            if (token) {
                setToken(token)
            }
        }

        init()
    }, [])

    // useEffect(() => {
    //     if (!subSpecialityLoading) {
    //         console.log("USEEFFECTSUBSPECEALITY", subSpecialityData)
    //         if (subSpecialityData) {

    //             let subSpeciality = subSpecialityData?.getSubSpecialitiesBySpeciality?.subSpecialities
    //             if (subSpeciality.length !== 0) {
    //                 let modifiedSubSpeciality = []
    //                 for (let value in subSpeciality) {
    //                     console.log("getSubSpeciality3333", value)
    //                     let subSpeciality_value = {
    //                         id: subSpeciality[value]?.id,
    //                         name: subSpeciality[value]?.name
    //                     }
    //                     modifiedSubSpeciality.push(subSpeciality_value)
    //                 }
    //                 dispatch(setSubSpecialities(modifiedSubSpeciality))


    //             }
    //             else {
    //                 dispatch(setSubSpecialities([]))

    //             }
    //         }


    //     }
    // }, [subSpecialityLoading])

    console.log("YEARSOFPRACTICE", typeof userDetail?.years_of_practice)

    return (
         <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: backgroundColors.offWhite }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                >
        <View style={styles.container}>
            {/* <Header editProfile={true} /> */}
            <View style={{ height: config.getHeight(12), width: config.getWidth(100), justifyContent: 'flex-end' , marginLeft:config.getWidth(2)}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        navigationService.goBack()
                    }} style={{}}>
                        <Image
                            style={{ width: config.getWidth(5), height: config.getHeight(2), marginLeft: config.getWidth(2) }}
                            source={Icons.backIcon}
                            resizeMode='contain'

                        />
                    </TouchableOpacity>


                    <Text style={{ fontFamily: 'regular', color: commonColors.black, fontSize: config.generateFontSizeNew(24), marginLeft: config.getWidth(5) }}>
                        My Profile
                    </Text>
                </View>


            </View>
            {
                dataLoader &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: config.getHeight(50), zIndex: 1 }}>
                    < ActivityIndicator />
                </View>
            }
            <ScrollView
                style={{ width: config.getWidth(100), }}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: config.getHeight(5) }}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity onPress={() => {
                    pickImage()
                }} style={{ width: config.getWidth(20),marginTop:config.getHeight(2) }}>

                    {
                        profileImage
                            ?
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {imageLoading && (
                                    <ActivityIndicator
                                        size='small'
                                        style={{
                                            position: 'absolute',
                                        }}
                                    />
                                )}
                                <Image
                                    style={{ width: config.getWidth(20), height: config.getWidth(20), borderRadius: config.getWidth(10), borderWidth: 1, borderColor: borderColors.profileImage, marginTop: config.getHeight(2) }}
                                    source={{ uri: profileImage }}
                                    resizeMode='stretch'
                                    onLoadStart={handleLoadStart}
                                    onLoadEnd={handleLoadEnd}

                                />
                            </View>
                            :
                            <Image
                                style={{ width: config.getWidth(20), height: config.getWidth(20), borderRadius: config.getWidth(10), borderWidth: 1, borderColor: borderColors.profileImage, marginTop: config.getHeight(2) }}
                                source={Icons.userProfile}
                                resizeMode='contain'

                            />

                    }
                </TouchableOpacity>

                <TitleInput title={"First Name"} initialData={firstName} editable={true} setInput={handleFirstName} maxLength={50} />
                {firstNameError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{firstNameError}</Text>
                }
                <TitleInput title={"Last Name"} initialData={lastName} editable={true} setInput={handleLastName} maxLength={50} />
                {lastNameError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{lastNameError}</Text>
                }
                <TitleInput title={"Display Name"} notImp initialData={displayName} editable={false} setInput={handleDisplayName} />

                {
                    email != null ?
                        <TitleInput title={"Email"} notImp initialData={email} editable={false} setInput={handleEmail} />
                        : null
                }
                {
                    phoneNumber ?
                        <TitleInput title={"Phone Number"} notImp initialData={phoneNumber} editable={false} setInput={handlePhone} maxLength={4} />
                        : null
                }

                <TitleInput title={"Years of practice"} initialData={yearsOfPractice} editable={true} setInput={handleYearsOfPractice} maxLength={4} />
                {yearsOfPracticeError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{yearsOfPracticeError}</Text>
                }
                        <View style={{
                                marginTop: config.getHeight(0.5),
                                width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                            }}>
                    <DropDown title={"Title"} initialData={title} data={TitlesData} setDropdown={handleTitle} />
                        </View>


                
                {titleError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{titleError}</Text>
                }
                {
                    title === "Others" ?
                        <TitleInput title={"Current Title"} initialData={customTitle} editable={true} setInput={handleCustomTitle} maxLength={100} />
                        : null
                }
                {customTitleError && title === "Others" &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{customTitleError}</Text>
                }
                <View style={{
                    marginTop: config.getHeight(0.5),
                    width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                }}>
                <DropDown title={"Affiliation(s)"} initialData={affiliation} data={AffiliationsData} setDropdown={handleAffiliation} />
                </View>

                {affiliationError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{affiliationError}</Text>
                }
                {
                    affiliation === "Others" &&
                    <TitleInput title={"Current Affiliation"} initialData={customAffiliation} editable={true} setInput={handleCustomAffiliation} maxLength={100} />
                }
                {customAffiliationError && affiliation === "Others" &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{customAffiliationError}</Text>
                }
                <View style={{
                    marginTop: config.getHeight(0.5),
                    width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                }}>
                <DropDown title={"Speciality"} initialData={speciality} data={SpecialityData} setDropdown={handleSpeciality} />
                </View>

                {specialityError &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{specialityError}</Text>
                }
                {
                    speciality === "Others" &&
                    <TitleInput title={"Current Speciality"} initialData={customSpeciality} editable={true} setInput={handleCustomSpeciality} maxLength={100} />

                }
                {customSpecialityError && speciality === "Others" &&
                    <Text
                        style={{
                            color: commonColors.red,
                            fontFamily: 'bold',
                            fontSize: config.generateFontSizeNew(16),
                            alignSelf: 'flex-start', marginLeft: config.getWidth(7),
                            marginTop: config.getHeight(1)
                        }}
                    >{customSpecialityError}</Text>
                }
                {(SubSpecialityData.length !== 0 && subSpeciality !== null && subSpeciality !== undefined) &&
                    <View style={{
                        marginTop: config.getHeight(0.5),
                        width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                    }}>
                        <DropDown title={"Subspeciality"} initialData={subSpeciality} data={SubSpecialityData} setDropdown={handleSubSpeciality} />
                    </View>
                }

                <View style={{
                    marginTop: config.getHeight(0.5),
                    width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                }}>
                <DropDown title={"Country"} notImp initialData={country} data={CountryData} setDropdown={handleCountry} />
                </View>

                <View style={{
                    marginTop: config.getHeight(0.5),
                    width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                }}>
                <DropDown title={"Trainee Level"} notImp initialData={trainee} data={TraineeData} setDropdown={handleTrainee} />
                </View>
                <View style={{ width: config.getWidth(90), marginTop: config.getHeight(3), alignItems: 'flex-end', justifyContent: 'center', }}>
                    <TouchableOpacity disabled={dataLoader} onPress={() => {
                        let flag = true
                        if (!firstName) {
                            setFirstNameError("Please provide the first name")
                            flag = false
                        }
                        if (!lastName) {
                            setLastNameError("Please provide the last name")
                            flag = false
                        }
                        if (!titleId) {
                            setTitleError("Please provide the title")
                            flag = false
                        }
                        if (!affiliationId) {
                            setAffiliationError("Please provide the affiliation")
                            flag = false
                        }
                        if (!specialityId) {
                            setSpecialityError("Please provide the speciality")
                            flag = false
                        }
                        if (title === "Others" && !customTitle) {
                            setCustomTitleError("Please provide the current title")
                            flag = false
                        }
                        if (affiliation === "Others" && !customAffiliation) {
                            setCustomAffiliationError("Please provide the current affiliation")
                            flag = false
                        }
                        if (speciality === "Others" && !customSpeciality) {
                            setCustomSpecialityError("Please provide the current speciality")
                            flag = false
                        }
                        if (!yearsOfPractice) {
                            setYearsOfPractiveError("Please provide the years of practice")
                            flag = false
                        }

                        if (flag) {
                            updateProfileAPI()
                            // if (profileImage.includes("https")) {
                            //     alert(true)
                            // }
                            // else {
                            //     uploadProfileImage()
                            // }
                        }

                    }} style={{ backgroundColor: backgroundColors.saveButton, width: config.getWidth(30), height: config.getHeight(5), borderRadius: config.getWidth(4.5), borderWidth: 1, borderColor: borderColors.profileImage, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontFamily: 'regular',
                            fontSize: config.generateFontSizeNew(16)
                        }}>
                            Save
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>

            {/* } */}





        </View>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'flex-start', alignItems: 'center'
    }
})

export default EditProfile



// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
// import Header from './components/Header';
// import ProfileInfo from './components/ProfileInfo';
// import Stats from './components/Stats';
// import AdditionalDetails from './components/AdditionalDetails';
// import ActionButtons from './components/ActionButtons';
// import axios from 'axios';
// import Header from '../../../components/header';

// interface UserProfile {
//     name: string;
//     email: string;
//     title: string;
//     specialty: string;
//     affiliation: string;
//     practice: string;
//     subspecialty: string;
//     country: string;
//     traineeLevel: string;
//     posts: number;
//     following: number;
//     followers: number;
//     profileImage: string;
// }

// const ProfileScreen: React.FC = () => {
//     const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         // const fetchProfileData = async () => {
//         //     try {
//         //         // Replace with your API endpoint
//         //         const response = await axios.get('https://api.example.com/user/profile');
//         //         setUserInfo(response.data);
//         //     } catch (error) {
//         //         console.error('Error fetching profile data:', error);
//         //     } finally {
//         //         setLoading(false);
//         //     }
//         // };

//         // fetchProfileData();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.loader}>
//                 <ActivityIndicator size="large" color="#000" />
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     if (!userInfo) {
//         return (
//             <View style={styles.loader}>
//                 <Text>Error loading profile data.</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView style={styles.container}>
//             <Header />
//             <ProfileInfo
//                 profileImage={userInfo.profileImage}
//                 name={userInfo.name}
//                 email={userInfo.email}
//                 title={userInfo.title}
//                 specialty={userInfo.specialty}
//                 affiliation={userInfo.affiliation}
//             />
//             <Stats posts={userInfo.posts} following={userInfo.following} followers={userInfo.followers} />
//             <AdditionalDetails
//                 practice={userInfo.practice}
//                 subspecialty={userInfo.subspecialty}
//                 country={userInfo.country}
//                 traineeLevel={userInfo.traineeLevel}
//             />
//             <ActionButtons />
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default ProfileScreen;
