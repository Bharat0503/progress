import { CommonActionTypes } from './types'

export const setAffiliations = (data: any) => {
    return {
        type: CommonActionTypes.AFFILIATION_DATA,
        payload: data
    };
}
export const setSpecialities = (data: any) => {
    return {
        type: CommonActionTypes.SPECIALITIES_DATA,
        payload: data
    };
}
export const setSubSpecialities = (data: any) => {
    return {
        type: CommonActionTypes.SUB_SPECIALITIES_DATA,
        payload: data
    };
}
export const setTitles = (data: any) => {
    return {
        type: CommonActionTypes.TITLES_DATA,
        payload: data
    };
}
export const setCountries = (data: any) => {
    return {
        type: CommonActionTypes.COUNTRY_DATA,
        payload: data
    };
}
export const setTrainees = (data: any) => {
    return {
        type: CommonActionTypes.TRAINEE_DATA,
        payload: data
    };
}
export const setLoading = (data: boolean) => {
    return {
        type: CommonActionTypes.LOADING,
        payload: data
    };
}
export const setErrorMessage = (data: string) => {
    return {
        type: CommonActionTypes.ERROR_MESSAGE,
        payload: data
    };
}

export const setEmail = (data: string) => {
    return {
        type: CommonActionTypes.EMAIL,
        payload: data
    };
}
export const setToken = (data: string) => {
    return {
        type: CommonActionTypes.TOKEN,
        payload: data
    };
}
export const setUserId = (data: string) => {
    return {
        type: CommonActionTypes.USER_ID,
        payload: data
    };
}

export const setTempToken = (data: string) => {
    return {
        type: CommonActionTypes.TEMP_TOKEN,
        payload: data
    };
}
export const setTempUserId = (data: string) => {
    return {
        type: CommonActionTypes.TEMP_USER_ID,
        payload: data
    };
}
export const setUserDetails = (data: any) => {
    return {
        type: CommonActionTypes.USER_DETAILS,
        payload: data
    };
}
export const setDimentions = (data: any) => {
    return {
        type: CommonActionTypes.DIMENTIONS,
        payload: data
    };
}
export const setCurrentTab = (data: any) => {
    return {
        type: CommonActionTypes.CURRENT_TAB,
        payload: data
    };
}
export const setSplashSpaceImage = (data: any) => {
    return {
        type: CommonActionTypes.SPLASH_SPACE_IMAGE,
        payload: data
    };
}
export const setHub = (data: any) => {
    return {
        type: CommonActionTypes.SELECT_HUB,
        payload: data
    };
}
export const setSpace = (data: any) => {
    return {
        type: CommonActionTypes.SELECT_SPACE,
        payload: data
    };
}
export const setContent = (data: any) => {
    return {
        type: CommonActionTypes.SET_CONTENT,
        payload: data
    };
}
export const setCollection = (data: any) => {
    return {
        type: CommonActionTypes.SET_COLLECTION,
        payload: data
    };
}
export const setContentId = (data: any) => {
    return {
        type: CommonActionTypes.SET_CONTENT_ID,
        payload: data
    };
}
export const setInfographicImageLink = (data: string) => {
    return {
        type: CommonActionTypes.INFOGRAPHIC_IMAGE_LINK,
        payload: data
    };
}
export const setGuidelinePdfLink = (data: string) => {
    return {
        type: CommonActionTypes.GUIDELINE_PDF_LINK,
        payload: data
    };
}
export const setVideoTime = (data: number) => {
    return {
        type: CommonActionTypes.SET_VIDEO_TIME,
        payload: data
    };
}
export const setSocieties = (data: any) => {
    return {
        type: CommonActionTypes.SOCIETIES_DATA,
    }
}
export const setImageLoading = (data: any) => {
    console.log("imageLoading",data)
    return {
        type: CommonActionTypes.SET_IMAGE_LOADING,
        payload: data
    };
}
export const setContentIdList = (data: any) => {
    return {
        type: CommonActionTypes.SET_CONTENT_ID_LIST,
        payload: data
    };
}
export const setCollectionList = (data: any) => {
    return {
        type: CommonActionTypes.SET_COLLECTION_LIST,
        payload: data
    };
}
export const setRefresh = (data: boolean) => {
    return {
        type: CommonActionTypes.REFRESH,
        payload: data
    };
}
export const setSpaceDashBoard = (data: boolean) => {
    return {
        type: CommonActionTypes.SPACEDASHBOARD,
        payload: data
    };
}
export const setStartfromSpaceDashBoard = (data: boolean) => {
    return {
        type: CommonActionTypes.STARTFROMDASHBOARD,
        payload: data
    };
}
export const setSelectedSpaceHomeDashboard = (data: any) => {
    return {
        type: CommonActionTypes.SELECTED_SPACE_HOME_DASHBOARD,
        payload: data
    };
}

export const setSpeciality = (data: any) => {
    return {
        type: CommonActionTypes.SET_SPECIALITY,
        payload: data
    };
}

export const setDeepLinkHandledRef = (data: boolean) => {
    return {
        type: CommonActionTypes.setDeepLinkHandledRef,
        payload: data
    };
}

export const setVideoSegments = (data: any) => {
    return {
        type: CommonActionTypes.SET_VIDEO_SEGMENT,
        payload: data
    };
}
