import { gql, useQuery } from '@apollo/client';

export const GET_USER_DETAILS = gql`
query GetUserDetails {
  getUserDetails {
    message
    success
    userInfo {
      affiliation_id
      affiliation_info {
        name
        id
      }
      country_code
      country_info {
        id
        flag
        currency_name
        currency_code
        country_code
        country_calling_code
        language_code
        language_name
        language_name_local
        name
        region
      }
      custom_info {
        id
        custom_title
        custom_speciality
        custom_affiliation
      }
      display_name
      email
      first_name
      id
      is_private_messaging_allowed
      is_profile_complete
      last_name
      phone
      profile_image_path
      record_status
      role
      speciality_id
      speciality_info {
        name
        id
        description
      }
      sub_speciality_id
      sub_speciality_info {
        name
        id
      }
      title_id
      title_info {
        name
        id
      }
      total_followers
      total_following
      total_posts
      trainee_level_id
      trainee_level_info {
        name_key
        name
        id
      }
      username
      years_of_practice
    }
  }
}
`

export const GET_SUB_SPECIALITY = gql`
query GetSubSpecialitiesBySpeciality($input: SubSpecialityBySpecialityInput!) {
  getSubSpecialitiesBySpeciality(input: $input) {
    message
    subSpecialities {
      record_status
      name
      id
      description
    }
    success
  }
}
`

export const GET_HUBS_MOBILE = gql`
query Hubs {
  getHubs {
    message
    hubs {
      id
      name
      description
      logo_path
      is_draft
      record_status
    }
    success
  }
}
`

export const GET_HUBS_WEB = gql`
query GetHubs {
  getHubs {
    hubs {
      id
      name
      spaces {
        id
        name
        logo_path
        space_type_id
        subscribed_users {
          subscription_status {
            request_status
          }
        }
      }
      record_status
      description
      is_draft
    }
  }
}
`

export const GET_HUBS_FILTER_SEARCH_MOBILE = gql`
query GetHubs($input: GetHubsInput) {
  getHubs(input: $input) {
    message
    success
    hubs {
      id
      name
      description
      logo_path
      is_draft
      record_status
    }
  }
}
`
export const GET_SEARCH_CONTENT_MOBILE = gql`
query Query($input: GetContentInput!) {
  getContent(input: $input) {
  pagination {
          total_records
          page
          page_size
        }
    content {
      id
      is_commenting_allowed
      is_liked
      is_marked_favourite
      content_title
      content_type_info {
        id
        name
        content_icon
      }
      description
      associated_content_files {
        id
        thumbnail
      }
      space_info {
        id
        logo_path
        minified_logo_path
        name
      }
    }
  }
}
  `

export const GET_BROWSE_CONTENT_MOBILE = gql`
query GetBrowseData($input: GetBrowseDataInput) {
  getBrowseData(input: $input) {
   pagination {
          total_records
          page
          page_size
        }
    browseData {
      id
      is_commenting_allowed
      is_liked
      is_marked_favourite
      content_title
      content_type_info {
        id
        name
        content_icon
      }
      description
      associated_content_files {
        id
        thumbnail
      }
      space_info {
        id
        logo_path
        name
        minified_logo_path
      }
    }
  }
}
`

export const GET_SPACES_MOBILE = gql`
query GetSpaces($input: GetSpacesInput) {
  getSpaces(input: $input) {
    success
    message
    spaces {
      id
      logo_path
      name
      space_type_id
      subscribed_users {
        subscription_status {
          request_status
        }
      }
    }
       pagination {
      page
      page_size
      total_records
    }
  }
}
`



export const GET_SPACES_WEB = gql`
query GetSpaces {
  getSpaces {
    message
    success
    spaces {
      id
      name
      space_type_id
      subscribed_users {
        subscription_status {
          request_status
        }
      }
      space_cards {
        id
        name
        description
        associated_content_types {
          content_icon
          id
          description
          name
        }
      }
    }
  }
}
`

export const GET_SPACES_FILTER_SEARCH_MOBILE = gql`
query GetSpaces($input: GetSpacesInput) {
  getSpaces(input: $input) {
    message
    success
     spaces {
      id
      logo_path
      name
      space_type_id
      subscribed_users {
        subscription_status {
          request_status
        }
      }
    }
       pagination {
      page
      page_size
      total_records
    }
  }
}
`

export const GET_MOST_SEARCHED_TERMS_MOBILE = gql`
query GetSpaces {
  getDashboardData {
    message
    success
    dashboardData {
      most_searched_items
      featured_spaces {
        id
        name
        logo_path
      }
    }
  }
}
`
export const GET_SUBSCRIBED_SPACES_HUB_MOBILE = gql`
query GetSpaces($input: GetDashboardDataInput) {
  getDashboardData(input: $input) {
    dashboardData {
      subscribed_hubs_spaces {
        hubs {
          id
          logo_path
          name
        }
        spaces {
          id
          logo_path
          name
          is_featured
          color
        }
           pagination {
          total_records
          page_size
          page
        }
      }
      most_searched_items
      featured_spaces {
        id
        name
        logo_path
        color
      }
    }
    message
    success
  }
}
`

export const GET_SUBSCRIBED_SPACES_HUB_HOME =gql`
query GetSpaces($input: GetDashboardDataInput) {
  getDashboardData(input: $input) {
    dashboardData {
      subscribed_hubs_spaces {
        spaces {
          id
          name
          is_featured
          color
          logo_path
        }
           pagination {
          total_records
          page_size
          page
        }
      }
    }
    message
    success
  }
}
`

export const GET_SUBSCRIBED_SPACES_HUB_WEB = gql`
query GetDashboardData {
  getDashboardData {
    message
    success
    dashboardData {
      subscribed_hubs_spaces {
        hubs {
          id
          name
          record_status
          is_draft
          spaces {
            id
            logo_path
            name
            space_type_id
            subscribed_users {
              subscription_status {
                request_status
              }
            }
          }
          logo_path
          description
        }
        spaces {
          id
          name
          space_type_id
          subscribed_users {
            subscription_status {
              request_status
            }
          }
          space_cards {
            id
            name
            description
            associated_content_types {
              content_icon
              id
              name
              description
            }
          }
        }
      }
    }
  }
}
`

export const GET_SUBSCRIBED_SPACES_HUB_FILTER_SEARCH_MOBILE = gql`
query GetDashboardData($input: GetDashboardDataInput) {
  getDashboardData(input: $input) {
    message
    success
    dashboardData {
      subscribed_hubs_spaces {
        hubs {
          id
          logo_path
          name
        }
        spaces {
          id
          logo_path
          name
          is_featured
          color
        }
        pagination {
          total_records
          page_size
          page
        }
      }
    }
  }
}
`

export const GET_HUB_DETAILS_BY_ID_MOBILE = gql`
query GetHubInfoById($input: GetHubInfoByIdInput!) {
  getHubInfoById(input: $input) {
    hubInfo {
      id
      name
      logo_path
      spaces {
        id
        logo_path
        name
        space_type_id
        subscribed_users {
          subscription_status {
            request_status
          }
        }
      }
    }
  }
}
`
export const GET_SPACE_INFO_BY_ID = gql`
query Query($input: SpaceInfoByIdInput!) {
  getSpaceInfoById(input: $input) {
    message
    spaceInfo {
      id
      logo_path
      name
      is_staff_directory_visible
      space_cards {
        id
        name
        associated_content_types {
          id
          name
          content_icon
        }
      }
      color
       portals {
        id
        logo_path
        name
      }
      space_collections {
        id
        collection_name
      }
    }
    success
  }
}
`

export const GET_CHANNEL_LIST = gql`
query GetDashboardData {
  getDashboardData {
    message
    success
    dashboardData {
      subscribed_hubs_spaces {
        spaces {
          id
          logo_path
          name
          is_featured
          color
          space_cards {
            associated_content_types {
              id
              content_icon
              name
            }
            id
            name
          }
        }
      }
    }
  }
}
`



// export const GET_COMMENTS = gql`
// query GET_COMMENTS($input: ContentIdInput!) {
//  getContentInfoById(input: $input) {
//     success
//     message
//     contentInfo {
//       id
//       content_comments {
//         id
//         content_id
//         total_comment_likes
//         comment
//         commentor_info {
//           first_name
//           last_name
//           id
//           username
//           display_name
//         }
//         createdAt
//       }

//     }
//   }
// }
// `

export const GET_CONTENT_DETAILS_BY_ID_MOBILE = gql`
query GetContentInfoById($input: GetContentInfoByIdInput!) {
  getContentInfoById(input: $input) {
    contentInfo {
      event_url
      id
      content_type_id
      content_title
      event_url
      associated_content_files {
        id
        file
        thumbnail
        hls_url
      }
      description
      total_comments
      total_likes
      associated_content_sections {
        id
        order
        section_title
        start_time
      }
      is_commenting_allowed
      content_type_info {
        id
        name
        content_icon
      }
      is_liked
      is_marked_favourite
      space_info {
        minified_logo_path
      }
    }
    message
    success
  }
}
`

export const GET_RELATED_CONTENT_DETAILS_BY_ID_MOBILE = gql`
query GetContentInfoById($input: GetContentInfoByIdInput!) {
  getContentInfoById(input: $input) {
    contentInfo {
      related_content {
        pagination {
          total_records
          page_size
          page
        }
        data {
            id
        is_liked
        content_title
        is_commenting_allowed
         description
        associated_content_files {
          id
          thumbnail
        }
        content_type_info {
          id
          name
          content_icon
        }
        }
      }
    }
    message
    success
  }
}
`

export const GET_SPACE_CONTENT_ID = gql`
query GetContentBySpaceAndCard($input: GetContentBySpaceAndCardInput!) {
  getContentBySpaceAndCard(input: $input) {
     content {
      id
      content_title
      description
      is_liked
      content_type_info {
        id
        name
        content_icon
      }
      associated_content_files {
        thumbnail
        id
      }
}
  }
}
`

export const GET_SPACE_CONTENT_DETAILS = gql`
query GetContentBySpaceAndCard($input: GetContentBySpaceAndCardInput!) {
  getContentBySpaceAndCard(input: $input) {
    content {
      id
      is_liked
      content_title
      is_commenting_allowed
      is_marked_favourite
      content_type_info {
         id
        name
        content_icon
      }
      description
      associated_content_files {
        id
        thumbnail
      }
      space_info {
        id
        logo_path
        name
        minified_logo_path
      }
    }
    pagination {
      page
      page_size
      total_records
    }
  }
}
`

export const GET_COMMENT_DETAILS_BY_CONTENT_ID_MOBILE = gql`
query GetContentInfoById($input: GetContentInfoByIdInput!) {
  getContentInfoById(input: $input) {
    contentInfo {
     total_comments
      content_comments {
        content_id
        id
        comment_replies {
          id
          content_id
          comment
        }
        comment
        createdAt
        total_comment_likes
        commentor_info {
         id
          display_name
          first_name
          last_name

        }
        is_liked
      }
    }
    message
    success
  }
}
`

export const GET_SEARCHED_USERS = gql`
query GetSearchedUsers($input: GetAllUsersInput) {
  getAllUsers(input: $input) {
    success
    message
    users {
      id
      first_name
      last_name
      follow_status
      follow_back_status
      display_name
      profile_image_path
    }
    pagination {
      total_records
      page
      page_size
    }
  }
}
`


export const POST_COMMENTS = gql`
mutation CommentContent($input: CommentContentInput!) {
  commentContent(input: $input) {
    success
    message
    }
}
`
export const GET_USER_INFO_BY_ID = gql`
query GetUserDetailsById($userId: ID!) {
  getUserDetailsById(userId: $userId) {
    success
    message
    userInfo {
      id
      first_name
      last_name
      display_name
      profile_image_path
      follow_status
      follow_back_status
      role
      total_posts
      total_followers
      total_following
      affiliation_info {
        id
        name
      }
      title_info {
        id
        name
      }
      speciality_info {
        id
        name
        description
      }
      trainee_level_info {
        id
        name
        name_key
      }
      country_info {
        id
        name
        country_code
      }
      custom_info {
        id
        custom_affiliation
        custom_title
        custom_speciality
      }
    }
  }
}
`


export const GET_FOLLOWERS_FOLLOWING_LIST = gql`
query GetFollowerAndFollowingLists($input: GetFollowerAndFollowingListsInput!) {
  getFollowerAndFollowingLists(input: $input) {
    success
    message
    users {
      id
      first_name
      last_name
      display_name
      profile_image_path
      follow_status
      follow_back_status
    }
  }
}
`

export const GET_STAFF_DIRECTORY = gql`
query GetStaffDirectories($input: GetAllStaffDirectoryInput) {
  getStaffDirectories(input: $input) {
    success
    message
    staff_directories {
      staff_speciality_info {
        name
        id
      }
      profile_image_path
      phone
      pager
      other_phone
      office_phone
      home_phone
      display_name
      cell_phone
      id
      email
      first_name
      last_name
      preferred_contact_method
    }
       pagination {
      page
      page_size
      total_records
    }
  }
}
`

export const GET_SPACE_COLLECTION_CONTENT_ID = gql`
query GetSpaceCollectionContentsById($input: GetSpaceCollectionContentsByIdInput!) {
  getSpaceCollectionContentsById(input: $input) {
    success
    message
    spaceCollectionContentData {
      id
      name
      color
      space_collection_category_contents {
        id
        is_liked
        content_type_id
        content_type_info {
          id
          name
          description
          content_icon
        }
        associated_content_files {
          id
          thumbnail
        }
        content_title
        description
        space_info {
          id
          name
          logo_path
          minified_logo_path
        }
      }
    }
    sub_space_collections {
      id
      collection_name
    }
  pagination {
      total_records
      page_size
      page
    }

  }
}
`

export const GET_MY_LIBRARY_DATA = gql`
query GetMyLibraryData($input: GetLibraryDataInput) {
  getMyLibraryData(input: $input) {
    success
    message
    libraryData {
      directories {
        data {
          id
          first_name
          last_name
          display_name
          email
          phone
          profile_image_path
          follow_status
          follow_back_status
          speciality_info {
            id
            name
          }
          role
          title_info {
            id
            name
          }
          sub_speciality_info {
            id
            name
          }
          country_info {
            id
            name
            country_code
          }
          subscribed_spaces {
            id
            name
          }
          trainee_level_info {
            id
            name
          }
          custom_info {
            id
            custom_affiliation
            custom_title
            custom_speciality
          }
        }
        pagination {
          total_records
          page
          page_size
        }
      }
    }

  }
}
`

export const GET_GROUP_DIRECTORY_DATA = gql`
query GetGroupDirectories($input: GetGroupDirectoriesInput) {
  getGroupDirectories(input: $input) {
    success
    message
    directoryGroups {
      id
      group_name
      user_id
      group_directories {
        id
        first_name
        last_name
        display_name
        profile_image_path
        role
        speciality_info {
          id
          name
        }
      }
    }
  }
}
`


export const GET_LIBRARY_FAVORITES_DATA = gql`
query GetMyLibraryData($input: GetLibraryDataInput) {
  getMyLibraryData(input: $input) {
    success
    message
    libraryData {
      favourites {
        data {
          id
          content_title
          description
          content_type_info {
            id
            name
            description
            content_icon
          }
          is_liked
          is_marked_favourite
          favourite_info {
            id
            content_id
            user_id
            is_marked_favourite
          }
          associated_content_files {
            id
            thumbnail
          }
          total_likes
          space_card_info {
            id
            name
          }
          space_info {
            id
            name
          }
        }
        pagination {
          total_records
          page
          page_size
        }
      }
    }
  }
}
`




// export const GET_FEATURED_SPACES = gql`
// query GetFeaturedSpaces {
//   getDashboardData {
//     dashboardData {
//       featured_spaces {
//         id
//         name
//         logo_path
//       }
//     }
//     message
//     success
//   }
// }
// `
