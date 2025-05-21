// NEWENDPOINT: https://analytics.globalcastmd.com/api/streams/app_activity/entries
// ### Content Viewed Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "view",---done
//     "user": <user_id>,
//     "subject_type": <content_type_string>,
//     "subject_id": <content_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Content Downloaded Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "download",---done
//     "user": <user_id>,
//     "subject_type": <content_type_string>,
//     "subject_id": <content_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Space Opened Directly Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_direct",---ask matt
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Space Opened Via Deep Link Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_branch",----code done testing reaminng
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Space Opened Via Portal Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_portal",---done
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Space Opened Via Enterprise Hub Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_enterprise", ----500 error,ask matt
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }
// ```

// ### Space Menu Button Tapped Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_menu_button",---ask matt
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         },
//         "button_label": <button_label>,
//         "button_path": <button_path>
//     }
// }
// ```

// ### Space Carousel Group Tapped Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "space_carousel_group",---ask matt
//     "user": <user_id>,
//     "subject_type": "space",
//     "subject_id": <space_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         },
//         "carousel_ids": <carousel_ids>,--drop
//         "group_name": <group_name> collection name
//     }
// }
// ```

// ### Search Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "search",---500 error ask matt
//     "user": <user_id>,
//     "subject_type": "search",
//     "subject_id": "null",
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         },
//         "term": <search_term>,
//         "filters": <search_filters_list>,
//         "sort": <sort_method>,
//         "sort_direction": <sort_direction>,
//         "channel_id": <channel_id searched in>
//     }
// }
// ```

// ### Media Segments Played Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "play", ask matt about segments
//     "user": <user_id>,
//     "subject_type": <content_type>,
//     "subject_id": <content_id>,
//     "event_data": {
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         },
//         "event_details": {
//             "media_length": <length of video/podcast in seconds>,
//             "duration": <total sum of segment lengths in seconds>,
//             "completion": <percentage of video/podcast watched; `(min(duration/media_length, 1) * 100).floor()`>,
//             "segments": [
//                 {
//                     "start": <segment start in seconds>,
//                     "end": <segment end in seconds>,
//                     "datetime": <datetime for start of media viewing session>
//                 }
//             ]
//         }
//     }
// }
// ```


// ### Load Feed Event
// * endpoint: https://analytics.globalcastmd.com/api/streams/app_activity/entries
// * query params: `token=<api-token>`
// * body:
// ```
// {
//     "source": "app",
//     "event_type": "load_feed",
//     "user": <user_id>,
//     "subject_type": "feed",
//     "subject_id": 0,
//     "event_data": {
//         "event_details": {
//             "feed_name": <feed_name; search feeds = "Search: <query>"; otherwise unnamed feeds = "Feed">,
//             "page": <page>
//         },
//         "device_info": {
//             "name": <device_name; ios-only>,
//             "model": <device_model>,
//             "systemName": <system_name; ios-only>,
//             "systemVersion": <system_version; ios-only>,
//             "sdkInt": <android_sdk_int; android-only>,
//             "release": <android_release; android-only>,
//             "isPhysicalDevice": <is_physical_device>
//         },
//         "app_info": {
//             "version": <app_version_string>,
//             "buildNumber": <app_build_number>
//         }
//     }
// }