import { View, Text, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableWithoutFeedback, Modal, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { backgroundColors, borderColors, commonColors } from '@/src/utils/colors'
import config from '@/src/utils/config'
import Header from '@/src/components/header'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client'
import { GET_CONFIG, REQUEST_NEW_SPACE } from '@/src/services/MutationMethod'
import { configAPIDataHandling } from '@/src/api/commonDataHandling'
import { setAffiliations, setSocieties, setSpecialities } from '@/src/redux/action'
import navigationService from '@/src/navigation/navigationService'
import RouteNames from '@/src/navigation/routes'
import DropDown from '@/src/components/dropDown'

const SpaceCreation: React.FC = () => {

    const [speciality, setSpeciality] = useState("")
    const [specialityId, setSpecialityId] = useState(0)

    const [affiliation, setAffiliation] = useState("")
    const [affiliationId, setAffiliationId] = useState(0)

    const [society, setSociety] = useState("")
    const [societyId, SetSocietyId] = useState(0)

    // Single dropdown visibility state
    const [activeDropdown, setActiveDropdown] = useState("none")

    const [enableScroll, onEnableScroll] = useState(false)
    const isLoading = useSelector((state: any) => state.reducer.loading)
    const dispatch = useDispatch()
    const [comment, setComment] = useState("")
    const [socientyData, setSocientyData] = useState("")

    type ItemProps = { title: string, id: number, type: string };
    const { loading, error, data } = useQuery(GET_CONFIG);
    const AffiliationsData = useSelector((state: any) => state.reducer.affiliation)
    const SpecialityData = useSelector((state: any) => state.reducer.specialities)
    const SocietyData = useSelector((state: any) => state.reducer.societies)
    const [requestNewSpace] = useMutation(REQUEST_NEW_SPACE)
    const [showDialog, setShowDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        if (!loading) {
            const { affiliation, specialities, societies } = configAPIDataHandling(data)
            console.log("CONFIG DATA", specialities)
            dispatch(setAffiliations(affiliation))
            dispatch(setSpecialities(specialities))
            dispatch(setSocieties(societies))
        }
    }, [loading])

    // Function to toggle dropdown visibility
    const toggleDropdown = (dropdownName) => {
        // If the dropdown is already active, close it
        if (activeDropdown === dropdownName) {
            setActiveDropdown("none")
        } else {
            // Otherwise, open the selected dropdown and close any others
            setActiveDropdown(dropdownName)
        }
    }

    const requestSpace = async () => {
        if (affiliationId === 0 || specialityId === 0 || socientyData === "") {
            alert("Please fill all required fields.");
            return;
        }
        const responseRequestSpace = await requestNewSpace({
            variables: {
                "input": {
                    "affiliation_id": affiliationId,
                    "speciality_id": specialityId,
                    "society": socientyData,
                    "request_comments": comment
                }
            }
        })
        if (responseRequestSpace?.data?.requestSpaceCreation?.success) {
            setShowDialog(true);
            setErrorMessage('');
            setTimeout(() => {
                setShowDialog(false);
                setTimeout(() => {
                    navigationService.navigate(RouteNames.Home);
                }, 500);
            }, 2000);
        } else {
            setErrorMessage('Failed to send the request. Please try again.');
        }
        console.log("responseRequestSpace", responseRequestSpace)
    }



    const Item = ({ title, id, type }: ItemProps) => (
        <TouchableOpacity onPress={() => {
            if (type === 'Speciality') {
                setSpeciality(title)
                setSpecialityId(id)
                setActiveDropdown("none")
            }
            else if (type === 'Society') {
                setSociety(title)
                SetSocietyId(id)
                setActiveDropdown("none")
            }
            else if (type === 'Affiliation') {
                setAffiliation(title)
                setAffiliationId(id)
                setActiveDropdown("none")
            }
        }} style={{
            backgroundColor: commonColors.white, marginHorizontal: config.getWidth(0.1),
        }}>
            <Text style={{
                color: commonColors.black,
                fontFamily: 'regular',
                padding: config.getHeight(0.5),
                fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(10),
                marginHorizontal: config.isWeb ? config.getWidth(0.3) : config.getWidth(1.5),
            }}>{title}</Text>
        </TouchableOpacity>
    );


    const showDialogSpace = () => {
        return (
            <Modal
                visible={showDialog}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDialog(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowDialog(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertTitle}>
                                Your request has been sent to Admin for Approval.
                            </Text>
                            <Text style={styles.alertMessage}>
                                Staycurrent Team will get back to you soon!!
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    const handleAffiliation = (value: string, valueId: number) => {
        setAffiliation(value)
        setAffiliationId(valueId)
    }

    const handleSpeciality = (value: string, valueId: number) => {
        setSpeciality(value);
        setSpecialityId(valueId);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: backgroundColors.offWhite }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: backgroundColors.offWhite }}></ScrollView>
            <View style={{ position: 'relative', backgroundColor: backgroundColors.offWhite, marginBottom: config.getHeight(14) }}>
                <Header back={true} profile={true} />
                <TouchableWithoutFeedback disabled={!showDialog}>
                    <ScrollView scrollEnabled={!showDialog}>
                        <Text style={styles.headingText}>
                            To help us customize your app experience, please complete the following profile information
                        </Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: config.getHeight(5) }}>
                            <View style={{
                                marginTop: config.getHeight(0),
                                width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                            }}>
                                <DropDown title={"Affiliation"} initialData={affiliation} data={AffiliationsData} setDropdown={handleAffiliation} />
                            </View>
                            <View style={{
                                marginTop: config.getHeight(2),
                                width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                            }}>
                                <DropDown title={"Speciality"} initialData={speciality} data={SpecialityData} setDropdown={handleSpeciality} />
                            </View>


                            <View style={{
                                marginTop: config.getHeight(4),
                                width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                            }}>
                                <Text style={{
                                    color: commonColors.black,
                                    fontFamily: 'regular',
                                    fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
                                    alignSelf: 'flex-start',
                                    marginBottom: config.getHeight(1)
                                }}>
                                    Society
                                    <Text style={{
                                        color: commonColors.red,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
                                        marginBottom: config.getHeight(1)
                                    }}>*</Text>
                                </Text>

                                {/* <TouchableOpacity onPress={() => toggleDropdown('society')} style={{
                                    height: config.isWeb ? config.getHeight(5) : config.getHeight(7),
                                    width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                                    borderColor: borderColors.textInputBorder,
                                    borderWidth: config.isWeb ? 0.1 : 1,
                                    borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                                    paddingHorizontal: 10,
                                    backgroundColor: '#fff',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between', alignItems: 'center'
                                }}> */}
                                    {/* <Text style={{ color: commonColors.black }}>
                                        {society}
                                    </Text> */}
                                    {/* <Image
                                        style={{
                                            height: config.isWeb ? config.getHeight(0.7) : config.getHeight(2),
                                            width: config.isWeb ? config.getWidth(0.5) : config.getWidth(3),
                                            marginRight: config.isWeb ? config.getWidth(0.6) : config.getWidth(1.2),
                                            marginTop: config.isWeb ? 1 : 3
                                        }}
                                        source={require('../../assets/icons/DropDown.png')}
                                        resizeMode='contain'
                                    /> */}
                                {/* </TouchableOpacity> */}
                                <TouchableOpacity
                                    onPress={() => Keyboard.dismiss()} // Dismiss the keyboard
                                />
                                <TextInput
                                    allowFontScaling={false}
                                    onChangeText={(text) => setSocientyData(text)}
                                    placeholder="Society name"
                                    placeholderTextColor="#A1A6B3"
                                    multiline
                                    numberOfLines={0}
                                    returnKeyType="default"
                                    keyboardType="default"
                                    onFocus={() => setActiveDropdown("none")}
                                    style={{
                                        height: config.isWeb ? config.getHeight(5) : config.getHeight(10),
                                        width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                                        borderColor: borderColors.textInputBorder,
                                        borderWidth: config.isWeb ? 0.1 : 1,
                                        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                                        paddingHorizontal: 10,
                                        paddingVertical: 12,
                                        backgroundColor: '#fff',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                </TextInput>
                                {/* {activeDropdown === 'society' ? (
                                    <View style={{
                                        position: 'absolute',
                                        marginTop: config.getHeight(10),
                                        zIndex: 999,
                                        elevation: 5,
                                        borderColor: borderColors.profileImage,
                                        borderWidth: config.isWeb ? 0.1 : 1,
                                        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                                        overflow: 'hidden',
                                        width: config.isWeb ? config.getWidth(20) : config.getWidth(80),
                                        padding: 5,
                                        backgroundColor: commonColors.white,
                                        alignSelf: 'center',
                                    }}>
                                        <FlatList
                                            nestedScrollEnabled
                                            data={SocietyData}
                                            keyboardShouldPersistTaps="handled"
                                            renderItem={({ item }) => <Item title={item.name} id={item.id} type='Society' />}
                                            style={{
                                                height: Math.min(SocietyData?.length * 40, config.isWeb ? config.getHeight(8.5) : config.getHeight(20))
                                            }}
                                            onTouchStart={() => {
                                                onEnableScroll(false);
                                            }}
                                            onMomentumScrollEnd={() => {
                                                onEnableScroll(true);
                                            }}
                                        />
                                    </View>
                                ) : null} */}
                            </View>
                            <View style={{
                                marginTop: config.getHeight(4),
                                width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                            }}>
                                <Text style={{
                                    color: commonColors.black,
                                    fontFamily: 'regular',
                                    fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
                                    alignSelf: 'flex-start',
                                    marginBottom: config.getHeight(1)
                                }}>
                                    Additional Comment
                                    {/* <Text style={{
                                        color: commonColors.red,
                                        fontFamily: 'regular',
                                        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
                                        marginBottom: config.getHeight(1)
                                    }}>*</Text> */}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => Keyboard.dismiss()} // Dismiss the keyboard
                                />
                                <TextInput
                                    allowFontScaling={false}
                                    onChangeText={(text) => setComment(text)}
                                    placeholder="Enter comment"
                                    placeholderTextColor="#A1A6B3"
                                    multiline
                                    numberOfLines={0}
                                    returnKeyType="default"
                                    keyboardType="default"
                                    onFocus={() => setActiveDropdown("none")}
                                    style={{
                                        height: config.isWeb ? config.getHeight(5) : config.getHeight(10),
                                        width: config.isWeb ? config.getWidth(20) : config.getWidth(90),
                                        borderColor: borderColors.textInputBorder,
                                        borderWidth: config.isWeb ? 0.1 : 1,
                                        borderRadius: config.isWeb ? config.getWidth(0.7) : config.getWidth(4),
                                        paddingHorizontal: 10,
                                        paddingVertical: 12,
                                        backgroundColor: '#fff',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                </TextInput>
                            </View>

                            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                            {showDialog === false ? <TouchableOpacity onPress={() => { requestSpace() }}>
                                <View style={styles.buttonStyle}>
                                    <Text style={styles.buttonText}>Request Space</Text>
                                </View>
                            </TouchableOpacity> : null}
                            {showDialog && (
                                <View>
                                    {showDialogSpace()}
                                </View>
                            )}
                        </View >
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    messageText: {
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(14),
        marginTop: config.getHeight(4),
        marginBottom: config.getHeight(2)
    },
    errorMessage: { color: 'red', marginBottom: 10 },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top: config.getHeight(40),
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: config.getHeight(3),
        marginTop: config.getHeight(4),
    },
    headingText: {
        color: commonColors.black,
        fontFamily: 'regular',
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(12),
        marginBottom: config.getHeight(2),
        marginTop: config.getHeight(4),
        marginLeft: config.isWeb ? config.getWidth(4) : config.getWidth(5),
        marginRight: config.isWeb ? config.getWidth(4) : config.getWidth(5),

    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: config.getHeight(13),
        height: config.getHeight(4),
        width: config.getWidth(35),
        marginTop: config.getHeight(5),
    },
    buttonText: {
        fontSize: config.isWeb ? config.generateFontSizeNew(3.2) : config.generateFontSizeNew(10),
        fontFamily: 'bold',
    },
    alertTitle: {
        fontSize: config.generateFontSizeNew(14),
        fontWeight: 'bold',
        color: 'black',
        marginBottom: config.getHeight(7),
        textAlign: 'center',
        marginTop: config.getHeight(3),
    },
    alertMessage: {
        fontSize: config.generateFontSizeNew(12),
        fontFamily: 'regular',
        color: 'black',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertView: {
        width: '80%',
        height: '35%',
        backgroundColor: 'white',
        padding: config.getWidth(10),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: commonColors.black,
        borderRadius: config.getWidth(4),
    },
})

export default SpaceCreation
