
// src/utils/analytics.ts

import axios, { AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { getAsyncData } from '../utils/storage';
import { keys } from '../utils/keys';
import config from '../utils/config';

interface DeviceInfoType {
  name: any; // Only for iOS
  model: any;
  systemName?: any; // Only for iOS
  systemVersion?: any; // Only for iOS
  sdkInt?: any; // Only for Android
  release?: any; // Only for Android
  isPhysicalDevice: boolean;
}

interface AppInfoType {
  version: string;
  buildNumber: string;
}

interface FeedEventType {
  feed_name: string;
  page: number;
}

interface EventPayload {
  source: string;
  event_type: string;
  user: string;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
  token: string;
  timestamp: string;
}

const API_URL = 'https://analytics.globalcastmd.com/api/streams/app_activity/entries';
const TOKEN = 'd52cf8cf-2014-4dee-9a83-edb1f333c777'; // Your token

// const getDeviceInfo = async (): Promise<DeviceInfoType> => {
//   const isPhysicalDevice = await DeviceInfo?.isPhysicalDevice();

//   const deviceInfo: DeviceInfoType = {
//     name: Platform.OS === 'ios' ? await DeviceInfo?.getDeviceName() : undefined,
//     model: await DeviceInfo.getModel(),
//     systemName: Platform.OS === 'ios' ? await DeviceInfo?.getSystemName() : undefined,
//     systemVersion: Platform.OS === 'ios' ? await DeviceInfo?.getSystemVersion() : undefined,
//     sdkInt: Platform.OS === 'android' ? await DeviceInfo?.getSystemVersion() : undefined, // Android SDK version
//     release: Platform.OS === 'android' ? await DeviceInfo?.getSystemVersion() : undefined, // Android version
//     isPhysicalDevice,
//   };

//   return deviceInfo;
// };

const getDeviceInfo = async (): Promise<DeviceInfoType> => {
  const isPhysicalDevice = Device.isDevice;

  const deviceInfo: DeviceInfoType = {
    name: Platform.OS === 'ios' ? await Device.deviceName : undefined,
    model: Device.modelName,
    systemName: Platform.OS === 'ios' ? await Device.osName : undefined,
    systemVersion: Platform.OS === 'ios' ? await Device.osVersion : undefined,
    sdkInt: Platform.OS === 'android' ? await Device.osVersion : undefined, // Android SDK version
    release: Platform.OS === 'android' ? await Device.osVersion : undefined, // Android version
    isPhysicalDevice,
  };

  return deviceInfo;
};

const getUserId = async () => {
  const userId = await getAsyncData(keys.userId)
  // alert(userId)
  return userId
}

const getAppInfo = async (): Promise<AppInfoType> => {
  const appInfo: AppInfoType = {
    version: '1.0.0', // Example static version; for real app, fetch from `expo-constants`
    buildNumber: '100', // Example static build number; for real app, fetch from `expo-constants`
  };

  return appInfo;
};

interface SearchEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
    term: string;
    // filters: string[];
    // sort: string;
    // sort_direction: string;
    // channel_id: string;
  };
  // token: string;
  // timestamp: string;
}

interface FeedEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
    event_details: FeedEventType

  };

}

interface PortalEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
  //   token: string;
  //   timestamp: string;
}

interface ViewContentEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
}

interface DownloadEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
}

interface SpaceEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
}

interface SpaceBranchEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
  };
}

interface HubEnterpriseEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  // event_data: {
  //   device_info: DeviceInfoType;
  //   app_info: AppInfoType;
  // };
}

interface SpaceMenuButtonEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
    // button_label: string | null;
    // button_path: string | null;
  };
  // token: string;
  // timestamp: string;
}


interface SpaceCarouselGroupEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
    // carousel_ids: string[];
    // group_name: string;
  };
  // token: string;
  // timestamp: string;
}

interface PlayEventPayload {
  source: string;
  event_type: string;
  user: string | null;
  subject_type: string;
  subject_id: string;
  event_data: {
    device_info: DeviceInfoType;
    app_info: AppInfoType;
    event_details: {
      media_length: number;
      duration: number;
      completion: number;
      segments: {
        start: number;
        end: number;
        datetime: string;
      }[];
    };
  };
  // token: string;
  // timestamp: string;
}

const logSearchEvent = async (
  searchTerm: string,
  // filters: string[],
  // sort: string,
  // sortDirection: string,
  // channelId: string
): Promise<void> => {
  try {
    // Get device and app info
    const userId = await getUserId()
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();

    // Build the payload
    const payload: SearchEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'search',
      user: userId,
      subject_type: 'search',
      subject_id: 'null', // Set to 'null' as per your requirements
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
        term: searchTerm,
        // filters: [],
        // sort: 'null',
        // sort_direction: 'null',
        // channel_id: 'null',
        // filters: filters,
        // sort: sort,
        // sort_direction: sortDirection,
        // channel_id: channelId,
      },
      // timestamp: new Date().toISOString(),
    };

    // Make the API request
    const response: AxiosResponse = await axios.post(API_URL, payload, {
      params: {
        token: TOKEN,  // Adding token in query params
      },
    });

    console.log(`Logged search event for user ${userId}`, response.data);
  } catch (error) {
    console.error('Failed to log search event:', error);
  }
};

const logPortalEvent = async (
  spaceId: string,
): Promise<void> => {
  try {
    // Get device and app info
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId()

    // Build the payload
    const payload: PortalEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: "space_portal",
      user: userId,
      subject_type: 'space',
      subject_id: spaceId, // Set to 'null' as per your requirements
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
      },
      //   token: TOKEN, // Token passed as a query parameter
      //   timestamp: new Date().toISOString(),
    };

    // Make the API request
    const response: AxiosResponse = await axios.post(API_URL, payload, {
      params: {
        token: TOKEN,  // Adding token in query params
      },
    });

    console.log(`PortalEvent ${userId}`, response.data);
  } catch (error) {
    console.error('FailedPortalEvent:', error);
  }
};

const logViewContentEvent = async (
  contentId: string,
  contentType: string,
): Promise<void> => {
  try {
    console.log("logged content id and contenttype", contentId, contentType)
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId()
    const payload: ViewContentEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'view',
      user: userId,
      subject_type: contentType,
      subject_id: contentId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
      },
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged view content event for content ${contentId}`, response.data);
  } catch (error) {
    console.error('Failed to log view content event:', error);
  }
};

const logDownloadEvent = async (
  contentId: string,
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId()
    const payload: DownloadEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'download',
      user: userId,
      subject_type: 'file',
      subject_id: contentId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
      },
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged download event for file ${contentId}`, response.data);
  } catch (error) {
    console.error('Failed to log download event:', error);
  }
};

const logSpaceEvent = async (
  spaceId: string,
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId()

    const payload: SpaceEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: "space_direct",
      user: userId,
      subject_type: 'space',
      subject_id: spaceId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
      },
    };
    const response: AxiosResponse = await axios.post(API_URL, payload, {
      params: {
        token: TOKEN,
      },
    });

    console.log(`Subscribed space event ${userId}`, response.data);
  } catch (error) {
    console.error('FailedSpaceEvent:', error);
  }
};

const logSpaceBranchEvent = async (
  spaceId: string,
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId();


    const payload: SpaceBranchEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'space_branch',
      user: userId,
      subject_type: 'space',
      subject_id: spaceId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
      },
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged space event  ${spaceId}`, response.data);
  } catch (error) {
    console.error('Failed to log space event:', error);
  }
};

const logHubEnterPriseEvent = async (
  spaceId: string,
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId()

    const payload: HubEnterpriseEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: "space_hub",
      user: userId,
      subject_type: 'space',
      subject_id: spaceId.toString(),
      // event_data: {
      //   device_info: deviceInfo,
      //   app_info: appInfo,
      // },
    };
    console.log(" Sending Payload:", JSON.stringify(payload, null, 2));
    const response: AxiosResponse = await axios.post(API_URL, payload, {
      params: {
        token: TOKEN,
      },
    }
    );
    console.log(`Logged Space enterprise ${userId}`, response.data);
  } catch (error) {
    console.error('FailedSpaceEvent:', error);
  }
};

const logSpaceMenuButtonEvent = async (
  spaceId: string,
  // buttonLabel: string,
  // buttonPath: string
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId();
    const payload: SpaceMenuButtonEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'space_menu_button',
      user: userId,
      subject_type: 'space',
      subject_id: spaceId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
        // button_label: '',
        // button_path: '',
      },
      // timestamp: new Date().toISOString(),
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged space menu button event for user ${userId}`, response.data);
  } catch (error) {
    console.error('Failed to log space menu button event:', error);
  }
};


const logSpaceCarouselGroupEvent = async (
  spaceId: string,
  // carouselIds: string[],
  // groupName: string
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId();
    const payload: SpaceCarouselGroupEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'space_collection',
      user: userId,
      subject_type: 'space',
      subject_id: spaceId.toString(),
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
        // carousel_ids: carouselIds,
        // group_name: groupName,
      },
      // timestamp: new Date().toISOString(),
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged space carousel group event for user ${userId}`, response.data);
  } catch (error:any) {
    console.error('Failed to log space carousel group event:', error?.response?.data|| error.message);
  }
};


const logPlayEvent = async (
  contentType: string,
  contentId: any,
  mediaLength: number,
  duration: number,
  segments: { start: number; end: number; datetime: string }[]
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId();
    const completion = Math.floor((Math.min(duration / mediaLength, 1)) * 100);

    const payload: PlayEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'play',
      user: userId,
      subject_type: contentType,
      subject_id: contentId,
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
        event_details: {
          media_length: mediaLength,
          duration,
          completion,
          segments,
        },
      },
      // timestamp: new Date().toISOString(),
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged play event for user ${userId}`, response.data);
  } catch (error) {
    console.error('Failed to log play event:', error);
  }
};


const loadFeedEvent = async (
  feed_name:string,
  page:number
): Promise<void> => {
  try {
    const deviceInfo = await getDeviceInfo();
    const appInfo = await getAppInfo();
    const userId = await getUserId();


    const payload: FeedEventPayload = {
      source: config.isWeb ? 'web' : 'app',
      event_type: 'load_feed',
      user: userId,
      subject_type: "feed",
      subject_id: "0",
      event_data: {
        device_info: deviceInfo,
        app_info: appInfo,
        event_details: {
          feed_name,
          page
        },
      },
    };

    const response: AxiosResponse = await axios.post(API_URL, payload, { params: { token: TOKEN } });
    console.log(`Logged feed event for user ${userId}`, response.data);
  } catch (error) {
    console.error('Failed to log feed event:', error);
  }
};







export default {
  logSearchEvent,
  logPortalEvent,
  logViewContentEvent,
  logDownloadEvent,
  logSpaceEvent,
  logSpaceBranchEvent,
  logHubEnterPriseEvent,
  logSpaceMenuButtonEvent,
  logSpaceCarouselGroupEvent,
  logPlayEvent,
  loadFeedEvent
};
