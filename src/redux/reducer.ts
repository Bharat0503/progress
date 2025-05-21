import { Dimensions } from "react-native";
import { CommonActionTypes } from "./types";
import { getAsyncData, setAsyncData } from "../utils/storage";
import { keys } from "../utils/keys";


const CommonState = {
    affiliation:  [],
    specialities: [],
    subSpecialities: [],
    societies: [],
    titles: [],
    country: [],
    trainee: [],
    loading: false,
    splashSpaceImage: [],
    errorMessage: '',
    email: '',
    token: null,
    userId: null,
    tempToken: null,
    tempUserId: null,
    userDetails: {},
    currentTab: "Home",
    hub: {},
    space: {},
    content: null,
    collection: null,
    contentId: null,
    contentIdList:  [],
    collectionList: [],
    infographicImageLink: "",
    guidelinePdfLink: "",
    videoTime: 0,
    imageLoading: [],
    refresh: null,
    spaceDashboard: null,
    startFromSpaceDashboard: null,
    homeDashboardSpace: null,
    dimentions: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    setDeepLinkHandledRef: null,
    videoSegments:[]

}

const reducer = (state = { ...CommonState }, action: { type: string, payload: any }) => {
    switch (action.type) {
        case CommonActionTypes.AFFILIATION_DATA: {
                 setAsyncData(keys.affiliation, action.payload)
            return {
                ...state,
                affiliation: action.payload,

            }

        }
        case CommonActionTypes.SPECIALITIES_DATA: {
 setAsyncData(keys.specialities, action.payload)
            return {
                ...state,
                specialities: action.payload
            }
        }
        case CommonActionTypes.SUB_SPECIALITIES_DATA: {
             setAsyncData(keys.subSpecialities, action.payload)
            return {
                ...state,
                subSpecialities: action.payload
            }
        }
        case CommonActionTypes.SOCIETIES_DATA: {
             setAsyncData(keys.societies, action.payload)
            return {
                ...state,
                societies: action.payload
            }
        }
        case CommonActionTypes.TITLES_DATA: {
              setAsyncData(keys.titles, action.payload)
            return {
                ...state,
                titles: action.payload
            }
        }
        case CommonActionTypes.COUNTRY_DATA: {
                setAsyncData(keys.country, action.payload)
            return {
                ...state,
                country: action.payload
            }
        }
        case CommonActionTypes.TRAINEE_DATA: {
                  setAsyncData(keys.trainee, action.payload)
            return {
                ...state,
                trainee: action.payload
            }
        }
        case CommonActionTypes.LOADING: {

            return {
                ...state,
                loading: action.payload
            }
        }
        case CommonActionTypes.ERROR_MESSAGE: {
             setAsyncData(keys.errorMessage, action.payload)
            return {
                ...state,
                errorMessage: action.payload
            }
        }
        case CommonActionTypes.EMAIL: {
               setAsyncData(keys.email, action.payload)
            return {
                ...state,
                email: action.payload
            }
        }
        case CommonActionTypes.TOKEN: {
            return {
                ...state,
                token: action.payload
            }
        }
        case CommonActionTypes.USER_ID: {
            return {
                ...state,
                userId: action.payload
            }
        }
        case CommonActionTypes.TEMP_TOKEN: {
            return {
                ...state,
                tempToken: action.payload
            }
        }
        case CommonActionTypes.TEMP_USER_ID: {
            return {
                ...state,
                tempUserId: action.payload
            }
        }
        case CommonActionTypes.USER_DETAILS: {
               setAsyncData(keys.userDetails, action.payload)
            return {
                ...state,
                userDetails: action.payload
            }
        }
        case CommonActionTypes.DIMENTIONS: {
            return {
                ...state,
                dimentions: action.payload
            }
        }
        case CommonActionTypes.CURRENT_TAB: {
               setAsyncData(keys.currentTab, action.payload)
            return {
                ...state,
                currentTab: action.payload
            }
        }
        case CommonActionTypes.SPLASH_SPACE_IMAGE: {
              setAsyncData(keys.splashSpaceImage, action.payload)
            return {
                ...state,
                splashSpaceImage: action.payload
            }
        }
        case CommonActionTypes.SELECT_HUB: {
              setAsyncData(keys.hub, action.payload)
            return {
                ...state,
                hub: action.payload
            }
        }
        case CommonActionTypes.SELECT_SPACE: {
             setAsyncData(keys.space, action.payload)
            return {
                ...state,
                space: action.payload
            }
        }
        case CommonActionTypes.SET_CONTENT: {
              setAsyncData(keys.content, action.payload)
            return {
                ...state,
                content: action.payload
            }
        }
        case CommonActionTypes.SET_COLLECTION: {
              setAsyncData(keys.collection, action.payload)
            return {
                ...state,
                collection: action.payload
            }
        }
        case CommonActionTypes.SET_CONTENT_ID: {
            setAsyncData(keys.contentId, action.payload)
            return {
                ...state,
                contentId: action.payload
            }
        }
        case CommonActionTypes.SET_CONTENT_ID_LIST: {
                setAsyncData(keys.contentIdList, action.payload)
            return {
                ...state,
                contentIdList: action.payload
            }
        }
        case CommonActionTypes.SET_COLLECTION_LIST: {
             setAsyncData(keys.collectionList, action.payload)
            return {
                ...state,
                collectionList: action.payload
            }
        }

        case CommonActionTypes.INFOGRAPHIC_IMAGE_LINK: {
             setAsyncData(keys.infographicImageLink, action.payload)
            return {
                ...state,
                infographicImageLink: action.payload
            }
        }
        case CommonActionTypes.GUIDELINE_PDF_LINK: {
             setAsyncData(keys.guidelinePdfLink, action.payload)
            return {
                ...state,
                guidelinePdfLink: action.payload
            }
        }
        case CommonActionTypes.SET_VIDEO_TIME: {
             setAsyncData(keys.videoTime, action.payload)
            return {
                ...state,
                videoTime: action.payload
            }
        }
        case CommonActionTypes.SET_IMAGE_LOADING: {

            return {
                ...state,
                imageLoading: action.payload
            }
        }
        case CommonActionTypes.REFRESH: {
             setAsyncData(keys.refresh, action.payload)
            return {
                ...state,
                refresh: action.payload
            }
        }
        case CommonActionTypes.SPACEDASHBOARD: {
             setAsyncData(keys.spaceDashboard, action.payload)
            return {
                ...state,
                spaceDashboard: action.payload
            }
        }
        case CommonActionTypes.STARTFROMDASHBOARD: {
             setAsyncData(keys.startFromSpaceDashboard, action.payload)
            return {
                ...state,
                startFromSpaceDashboard: action.payload
            }
        }
        case CommonActionTypes.SELECTED_SPACE_HOME_DASHBOARD: {
             setAsyncData(keys.homeDashboardSpace, action.payload)
            return {
                ...state,
                homeDashboardSpace: action.payload
            }
        }
        case CommonActionTypes.SET_SPECIALITY: {
              setAsyncData(keys.speciality, action.payload)
            return {
                ...state,
                speciality: action.payload
            }
        }
        case CommonActionTypes.setDeepLinkHandledRef: {
             setAsyncData(keys.startFromSpaceDashboard, action.payload)
            return {
                ...state,
                setDeepLinkHandledRef: action.payload
            }
        }
        case CommonActionTypes.SET_VIDEO_SEGMENT: {

            return {
                ...state,
                videoSegments: action.payload
            }
        }

        default:
            return {
                ...state
            };
    }
}

export default reducer