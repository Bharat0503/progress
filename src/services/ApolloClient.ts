import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';
import { getAsyncData } from '../utils/storage';
import { keys } from '../utils/keys';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
const { ENV } = Constants.expoConfig.extra;
// let apiUrl = "https://api-uat.staycurrent.globalcastmd.com/graphql"
let apiUrl="https://api.staycurrentmd.com/graphql"

// switch (ENV) {
//   case 'PRODUCTION':
//     apiUrl = process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT
//     break;
//   case 'QA':
//     apiUrl = process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT
//     break;
//   case 'DEVELOPMENT':
//     apiUrl = process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT
//     break;
//   default:
//     apiUrl = process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT
//     break;
// }

const getAccessToken = async () => {
  let token = await getAsyncData(keys.userToken)
  if (token == null) {
    token = await getAsyncData(keys.tempUserToken)
  }
  // console.log("TOKENSTART", token)

  // console.log("TOKENSTART", token)
  return token
};

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) console.log(`[Network error]: ${networkError}`);
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
    console.log(`[GraphQL error]: ${graphQLErrors}`);
  }

});

// const httpLink = new HttpLink({
//   uri: apiUrl, // Replace with your GraphQL endpoint
// });

const uploadLink = createUploadLink({
  uri: apiUrl, // Replace with your GraphQL endpoint
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken();
  // console.log("TOKENSTART111", headers)
  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': false,
      Authorization: token ? `Bearer ${token}` : '',

    },
  };
});

const client = new ApolloClient({
  // uri: apiUrl,
  link: authLink.concat(errorLink).concat(uploadLink),
  cache: new InMemoryCache(),
});

export default client;