import { gql } from '@apollo/client';

// Define the GraphQL mutation

export const REQUEST_OTP = gql`
mutation RequestOtp($input: RequestOtpInput!) {
  requestOtp(input: $input) {
    success
    message
  }
}`;

export const REQUEST_LOGIN_OTP = gql`
mutation RequestLoginOtp($input: RequestOtpInput!) {
  requestLoginOtp(input: $input) {
    message
    success
  }
}
`;

export const REQUEST_SIGNUP_OTP = gql`
mutation RequestSignupOtp($input: RequestOtpInput!) {
  requestSignupOtp(input: $input) {
    message
    success
  }
}
`;

export const VALIDATE_OTP = gql`
mutation VerifyOtp($input: VerifyOtpInput!) {
  verifyOtp(input: $input) {
    isUserRegistered
    message
    success
    token
    userId
  }
}
`;

export const CREATE_PROFILE = gql`
mutation CreateProfile($input: CreateProfileInput!) {
  createProfile(input: $input) {
    message
    success
  }
}
`

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    message
    success
  }
}`
  ;

export const GET_CONFIG = gql`
query GetAppConfig {
  getAppConfig {
    config {
      countries {
        id
        name
        country_code
        country_calling_code
        currency_code
        currency_name
        language_code
        language_name
        language_name_local
        region
        flag
      }
      affiliations {
        id
        name
      }
      space_images
      specialities {
        id
        name
        description
        record_status
      }
      societies {
        name
        id
      } 
      titles {
        id
        name
      }
      traineeLevels {
        id
        name
        name_key
      }
    }
    message
    success
  }
}
`;

export const DELETE_ACCOUNT = gql`
mutation Mutation {
  deactivateAccount {
    success
    message
  }
}
`;

export const UPLOAD_PROFILE_IMAGE = gql`
mutation UpdateProfileImage($profileImage: Upload) {
  updateProfileImage(profile_image: $profileImage) {
    message
    success
  }
}
`

export const REQUEST_SPACE_ACCESS = gql`
mutation Mutation($input: SubscribeSpaceInput!) {
  subscribeSpace(input: $input) {
    message
    success
  }
}
`

export const TOGGLE_CONTENT_LIKE = gql`
mutation ToggleContentLike($input: LikeDislikeContentInput!) {
  toggleContentLike(input: $input) {
    message
    success
  }
}
`

export const TOGGLE_COMMENT_LIKE = gql`
mutation ToggleCommentLike($input: LikeDislikeCommentInput!) {
  toggleCommentLike(input: $input) {
    success
    message
  }
}
`

export const POST_COMMENT = gql`
mutation CommentContent($input: CommentContentInput!) {
  commentContent(input: $input) {
    message
    success
  }
}
`

export const REQUEST_FOLLOW_ACTIONS = gql`
mutation HandleFollowActions($input: FollowRequestInput!) {
  handleFollowActions(input: $input) {
    success
    message
  }
}
`
export const TOGGLE_CONTENT_FAV = gql`
mutation ToggleContentFav($input: ContentIdInput!) {
  toggleContentFav(input: $input) {
    message
    success
  }
}
`

export const CREATE_DIRECTORY_GROUP =gql`
mutation Mutation($input: CreateDirectoryGroupInput!) {
  createDirectoryGroup(input: $input) {
    success
    message
  }
}
`

export const DELETE_DIRECTORY_GROUP =gql`
mutation DeleteDirectoryGroup($input: DeleteDirectoryGroupInput!) {
  deleteDirectoryGroup(input: $input) {
    success
    message
  }
}
`
export const REQUEST_NEW_SPACE = gql`
mutation RequestSpaceCreation($input: RequestSpaceCreationInput!) {
  requestSpaceCreation(input: $input) {
    message
    success
  }
}
`
