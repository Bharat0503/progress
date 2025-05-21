import React, { useEffect, useState } from 'react'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import navigationService, { navigationRef } from './navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './routes/route-stack-params';

import RouteNames from './routes/index';

//SCREENS
import Splash from '../screens/web/splash/splash.web'
import Otp from '../screens/web/otp/otp.web';
import SignUp from '../screens/web/signUp/signUp.web';
import SignUpForm from '../screens/web/signUpForm/signUpForm.web';
import DashBoard from '../screens/web/dashboard/dashBoard.web';
import { getAsyncData } from '../utils/storage';
import { keys } from '../utils/keys';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserId } from '../redux/action';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/web/home/home.web';
import config from '../utils/config';
import CustomDrawerContent from './drawer';
import TabBar from './tabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabStackParamList } from './routes/route-tab-stack-params';
import Browse from '../screens/web/browse/browse.web';
import Icons from '../assets/icons';
import Spaces from '../screens/web/spaces/spaces.web';
import UpgradeToSc from '../screens/web/upgradeToSc/upgradeToSc.web';
import TabBarWeb from './tabBarWeb';
import Profile from '../screens/web/profile/profile.web';
import EditProfile from '../screens/web/editProfile/editProfile.web';
import Login from '../screens/web/login/login.web';
import SearchResultWeb from '../screens/web/searchResult/searchResult.web';
import CommentsScreenWeb from '../screens/web/commentsScreen/commentsScreen.web';
import SpaceDashBoardWeb from '../screens/web/spaceDashBoard/spaceDashBoard.web';
import HubsWeb from '../screens/web/hubs/hubs.web';

import Content from '../screens/web/content/content';
import Collections from '../screens/web/collections/collections';
import MyDirectoryWeb from '../screens/web/myDirectory/myDirectory.web';
import GroupsWeb from '../screens/web/groups/groups.web';
import GroupNameWeb from '../screens/web/groupName/groupName.web';
import NewGroupWeb from '../screens/web/newGroup/newGroup.web';
import LibraryDashboard from '../screens/web/libraryDashboard/libraryDashboard.web';
import History from '../screens/mobile/history/history';
import Downloads from '../screens/mobile/downloads/downloads';
import HistoryWeb from '../screens/web/history/history.web';
import DownloadsWeb from '../screens/web/downloads/downloads.web';
import FollowersFollowingWeb from '../screens/web/followersfollowing/followersfollowing.web';
import UserProfileWeb from '../screens/web/userProfile/userProfile.web';
import UserSearchWeb from '../screens/web/userSearch/userSearch.web';
import FavoritesWeb from '../screens/web/favorites/favorites.web';
import FeaturedContentListingWeb from '../screens/web/featuredContentListing/featuredContentListing.web';
import BrowseWeb from '../screens/web/browse/browse.web';
import DownloadedContentWeb from '../screens/web/downloadedContent/downloadedContent.web';
import SpaceCreationWeb from '../screens/web/spaceCreation/spaceCreation.web';








const Stack = createStackNavigator<RootStackParamList>()
const MainStack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<RootStackParamList>()

const BrowseStack = createStackNavigator<RootStackParamList>()

const SpacesStack = createStackNavigator<RootStackParamList>()

const LibraryStack = createStackNavigator<RootStackParamList>()


const linking = {
  prefixes: ['http://localhost:8081/'], // or your app's URL
  config: {
    screens: {
      Splash: RouteNames.Splash,
      Otp: RouteNames.Otp,
      SignUp: RouteNames.SignUp,
      SignUpForm: RouteNames.SignUpForm,
      DashBoard: RouteNames.DashBoard,
      Main: RouteNames.Main,
      Home: RouteNames.Home,
      Spaces: RouteNames.Spaces,
      UpgradeToSC: RouteNames.UpgradeToSC,
      Profile: RouteNames.Profile,
      Login: "Login",
      HomeTabs: "HomeTabs",
      Browse: "Browse",
      HomeNavigator: "HomeNavigator",
      BrowseNavigator: "BrowseNavigator",
      SpaceNavigator: "SpaceNavigator",
      LibraryNavigator: "LibraryNavigator",
      EditProfile: "EditProfile",
      Hubs: "Hubs",
      SpaceDashBoard: "SpaceDashBoard",
      Content: "Content",
      ContentInfographicImage: "ContentInfographicImage",
      ContentGuidelinePdf: "ContentGuidelinePdf",
      SearchResult: "SearchResult",
      FollowersFollowing: "FollowersFollowing",
      UserSearch: "UserSearch",
      UserProfile: "UserProfile",
      History: "History",
      Downloads: "Downloads",
      CommentsScreen: "CommentsScreen",
      MyDirectory: "MyDirectory",
      Groups: "Groups",
      GroupName: "GroupName",
      NewGroup: "NewGroup",
      Favorites: "Favorites",
      SpaceCreation: "SpaceCreation",
      Collections: "Collections",
      LibraryDashboard: "LibraryDashboard",
      FeaturedContentListing: "FeaturedContentListing",
      DownloadedContent: "DownloadedContent",
      PrivacyScreen: 'PrivacyScreen',
      TermsConditionsScreen: 'TermsConditionsScreen'
    },

  },
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator initialRouteName={RouteNames.Home} >
      <HomeStack.Screen
        name={RouteNames.Home}
        component={Home}
        // initialParams={{ animation: true }}
        options={{
          title: 'Home',
          headerShown: false,
          // unmountOnBlur: true

        }} />
      <HomeStack.Screen
        name={RouteNames.Profile}
        component={Profile}
        // initialParams={{ animation: true }}
        options={{
          title: 'Profile',
          headerShown: false,

        }} />
      <HomeStack.Screen
        name={RouteNames.EditProfile}
        component={EditProfile}
        // initialParams={{ animation: true }}
        options={{
          title: 'Edit Profile',
          headerShown: false,

        }} />
      <HomeStack.Screen
        name={RouteNames.SearchResult}
        component={SearchResultWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Search',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.CommentsScreen}
        component={CommentsScreenWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Comments',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.MyDirectory}
        component={MyDirectoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'My Directory',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.Groups}
        component={GroupsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Groups',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.GroupName}
        component={GroupNameWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Group Name',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.NewGroup}
        component={NewGroupWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Create Group',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.History}
        component={HistoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'History',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.Downloads}
        component={DownloadsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Downloads',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.FollowersFollowing}
        component={FollowersFollowingWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Followers Following',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.UserSearch}
        component={UserSearchWeb}
        options={{
          title: 'Search User',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.UserProfile}
        component={UserProfileWeb}
        options={{
          title: 'User Profile',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.Favorites}
        component={FavoritesWeb}
        options={{
          title: 'Favorites',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.FeaturedContentListing}
        component={FeaturedContentListingWeb}
        options={{
          title: 'Contents',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.Content}
        component={Content }
        
        // initialParams={{ animation: true }}
        options={{
          
          title: 'Content Details',
          headerShown: false,
          
        }} />
      <HomeStack.Screen
        name={RouteNames.DownloadedContent}
        component={DownloadedContentWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Downloaded Content',
          headerShown: false,
        }} />

    </HomeStack.Navigator>
  )
}

function BrowseNavigator() {
  return (
    <BrowseStack.Navigator initialRouteName={RouteNames.Browse} >
      <BrowseStack.Screen
        name={RouteNames.Browse}
        component={BrowseWeb}
        // initialParams={{ animation: true }}

        options={{
          title: 'Browse',
          headerShown: false,
          // unmountOnBlur: true


        }} />
      <BrowseStack.Screen
        name={RouteNames.Profile}
        component={Profile}
        // initialParams={{ animation: true }}
        options={{
          title: 'Profile',
          headerShown: false,

        }} />
      <BrowseStack.Screen
        name={RouteNames.EditProfile}
        component={EditProfile}
        initialParams={{ animation: true }}
        options={{
          title: 'Edit Profile',
          headerShown: false,

        }} />
      <BrowseStack.Screen
        name={RouteNames.FeaturedContentListing}
        component={FeaturedContentListingWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Contents',
          headerShown: false,

        }} />
      <BrowseStack.Screen
        name={RouteNames.Content}
        component={Content}
        // initialParams={{ animation: true }}
        options={{
          title: 'Content Details',
          headerShown: false,
        }} />

      <BrowseStack.Screen
        name={RouteNames.FollowersFollowing}
        component={FollowersFollowingWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Followers Following',
          headerShown: false,
        }}
      />
      <BrowseStack.Screen
        name={RouteNames.UserSearch}
        component={UserSearchWeb}
        options={{
          title: 'Search Users',
          headerShown: false,
        }}
      />
      <BrowseStack.Screen
        name={RouteNames.UserProfile}
        component={UserProfileWeb}
        options={{
          title: 'User Profile',
          headerShown: false,
        }}
      />
      <BrowseStack.Screen
        name={RouteNames.CommentsScreen}
        component={CommentsScreenWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Comments',
          headerShown: false,
        }}
      />

    </BrowseStack.Navigator>
  )
}

function SpaceNavigator() {
  return (
    <SpacesStack.Navigator initialRouteName={RouteNames.Spaces} >
      <SpacesStack.Screen
        name={RouteNames.Spaces}
        component={Spaces}
        //initialParams={{ animation: true }}
        options={{
          title: 'Spaces',
          headerShown: false,
          // unmountOnBlur: true
        }} />
      <SpacesStack.Screen
        name={RouteNames.SpaceDashBoard}
        component={SpaceDashBoardWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Space Dashboard',
          headerShown: false,
        }} />
      <SpacesStack.Screen
        name={RouteNames.Hubs}
        component={HubsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Hubs',
          headerShown: false,
        }} />
      <SpacesStack.Screen
        name={RouteNames.Content}
        component={Content}
        // initialParams={{ animation: true }}
        options={{
          title: 'Content Details',
          headerShown: false,
        }} />
      <SpacesStack.Screen
        name={RouteNames.Collections}
        component={Collections}
        // initialParams={{ animation: true }}
        options={{
          title: 'Collections',
          headerShown: false,
        }} />
      <SpacesStack.Screen
        name={RouteNames.FeaturedContentListing}
        component={FeaturedContentListingWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Contents',
          headerShown: false,
        }} />
      <SpacesStack.Screen
        name={RouteNames.Profile}
        component={Profile}
        // initialParams={{ animation: true }}
        options={{
          title: 'Profile',
          headerShown: false,

        }} />
      <SpacesStack.Screen
        name={RouteNames.EditProfile}
        component={EditProfile}
        // initialParams={{ animation: true }}
        options={{
          title: 'Edit Profile',
          headerShown: false,

        }} />
      <SpacesStack.Screen
        name={RouteNames.FollowersFollowing}
        component={FollowersFollowingWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Followers Following',
          headerShown: false,
        }}
      />
      <SpacesStack.Screen
        name={RouteNames.UserSearch}
        component={UserSearchWeb}
        options={{
          title: 'Search Users',
          headerShown: false,
        }}
      />
      <SpacesStack.Screen
        name={RouteNames.UserProfile}
        component={UserProfileWeb}
        options={{
          title: 'User Profile',
          headerShown: false,
        }}
      />

      <SpacesStack.Screen
        name={RouteNames.CommentsScreen}
        component={CommentsScreenWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Comments',
          headerShown: false,
        }}
      />

      <SpacesStack.Screen
        name={RouteNames.SpaceCreation}
        component={SpaceCreationWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Space Creation',
          headerShown: false,
        }}
      />

    </SpacesStack.Navigator>
  )
}

function LibraryNavigator() {
  return (
    <LibraryStack.Navigator initialRouteName={RouteNames.LibraryDashboard} >
      <LibraryStack.Screen
        name={RouteNames.LibraryDashboard}
        component={LibraryDashboard}
        // initialParams={{ animation: true }}
        options={{
          title: 'My Library',
          headerShown: false,
          // unmountOnBlur: true
        }} />
      <LibraryStack.Screen
        name={RouteNames.MyDirectory}
        component={MyDirectoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'My Directory',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.Groups}
        component={GroupsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Groups',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.GroupName}
        component={GroupNameWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Group Name',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.NewGroup}
        component={NewGroupWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Create Group',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.History}
        component={HistoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'History',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.Downloads}
        component={DownloadsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Downloads',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.Favorites}
        component={FavoritesWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Favorites',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.FeaturedContentListing}
        component={FeaturedContentListingWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Contents',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.Content}
        component={Content}
        // initialParams={{ animation: true }}
        options={{
          title: 'Content Details',
          headerShown: false,
        }} />
      <LibraryStack.Screen
        name={RouteNames.Profile}
        component={Profile}
        //initialParams={{ animation: true }}
        options={{
          title: 'Profile',
          headerShown: false,

        }} />
      <LibraryStack.Screen
        name={RouteNames.EditProfile}
        component={EditProfile}
        //initialParams={{ animation: true }}
        options={{
          title: 'Edit Profile',
          headerShown: false,

        }} />
      <LibraryStack.Screen
        name={RouteNames.FollowersFollowing}
        component={FollowersFollowingWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Followers Following',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.UserSearch}
        component={UserSearchWeb}
        options={{
          title: 'Search Users',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.UserProfile}
        component={UserProfileWeb}
        options={{
          title: 'User Profile',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.CommentsScreen}
        component={CommentsScreenWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Comments',
          headerShown: false,
        }}
      />
      <LibraryStack.Screen
        name={RouteNames.DownloadedContent}
        component={DownloadedContentWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Downloaded Content',
          headerShown: false,
        }} />

    </LibraryStack.Navigator>
  )
}


// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName={RouteNames.HomeNavigator}
//       screenOptions={{ popToTopOnBlur: true }}
//     // tabBar={(props) => <TabBar  {...props} />
//     // }

//     >

//       {/* <Tab.Screen
//         name={RouteNames.BrowseNavigator}
//         component={BrowseNavigator}
//         initialParams={{ displayName: 'Browse', icon: Icons.browse }}
//         options={{
//           headerShown: false,
//           // popToTopOnBlur: true
//         }}
//       /> */}



//       <Tab.Screen
//         name={RouteNames.HomeNavigator}
//         component={HomeNavigator}
//         options={{

//           headerShown: false,

//         }}
//       />
//       <Tab.Screen
//         name={RouteNames.BrowseNavigator}
//         component={BrowseNavigator}
//         options={{
//           headerShown: false,

//         }}
//       />
//       <Tab.Screen
//         name={RouteNames.SpaceNavigator}
//         component={SpaceNavigator}
//         options={{
//           headerShown: false,

//         }}
//       />
//       <Tab.Screen
//         name={RouteNames.LibraryNavigator}
//         component={LibraryNavigator}
//         options={{
//           headerShown: false,

//         }}
//       />

//     </Tab.Navigator>
//   );
// }



function Main() {
  return (
    <MainStack.Navigator
      screenOptions={{
        detachPreviousScreen: true,
        cardStyle: {
          flex: 1
        }
      }}

      initialRouteName={RouteNames.Home}>
      {/* <MainStack.Screen
        name={RouteNames.HomeNavigator}
        component={HomeNavigator}
        options={{

          headerShown: false,

        }}
      /> */}
      {/* <MainStack.Screen
        name={RouteNames.BrowseNavigator}
        component={BrowseNavigator}
        options={{
          headerShown: false,

        }}
      /> */}
      {/* <MainStack.Screen
        name={RouteNames.SpaceNavigator}
        component={SpaceNavigator}
        options={{
          headerShown: false,

        }}
      /> */}
      {/* <MainStack.Screen
        name={RouteNames.LibraryNavigator}
        component={LibraryNavigator}
        options={{
          headerShown: false,

        }}
      /> */}

      <MainStack.Screen
        name={RouteNames.Home}
        component={Home}
        // initialParams={{ animation: true }}
        options={{
          title: 'Home',
          headerShown: false,
          // unmountOnBlur: true

        }} />


      <MainStack.Screen
        name={RouteNames.LibraryDashboard}
        component={LibraryDashboard}
        // initialParams={{ animation: true }}
        options={{
          title: 'My Library',
          headerShown: false,
          // unmountOnBlur: true
        }} />

      <MainStack.Screen
        name={RouteNames.Groups}
        component={GroupsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Groups',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.GroupName}
        component={GroupNameWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Group Name',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.NewGroup}
        component={NewGroupWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Create Group',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.History}
        component={HistoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'History',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.Downloads}
        component={DownloadsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Downloads',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.Favorites}
        component={FavoritesWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Favorites',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.FeaturedContentListing}
        component={FeaturedContentListingWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Contents',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.Content}
        component={Content}
        // initialParams={{ animation: true }}
        options={{
          title: 'Content Details',
          headerShown: false,
        }} />
      <MainStack.Screen
        name={RouteNames.Profile}
        component={Profile}
        //initialParams={{ animation: true }}
        options={{
          title: 'Profile',
          headerShown: false,

        }} />
      <MainStack.Screen
        name={RouteNames.EditProfile}
        component={EditProfile}
        //initialParams={{ animation: true }}
        options={{
          title: 'Edit Profile',
          headerShown: false,

        }} />
      <MainStack.Screen
        name={RouteNames.FollowersFollowing}
        component={FollowersFollowingWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Followers Following',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.UserSearch}
        component={UserSearchWeb}
        options={{
          title: 'Search Users',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.UserProfile}
        component={UserProfileWeb}
        options={{
          title: 'User Profile',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.CommentsScreen}
        component={CommentsScreenWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Comments',
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={RouteNames.DownloadedContent}
        component={DownloadedContentWeb}
        //initialParams={{ animation: true }}
        options={{
          title: 'Downloaded Content',
          headerShown: false,
        }} />


      <MainStack.Screen
        name={RouteNames.Spaces}
        component={Spaces}
        //initialParams={{ animation: true }}
        options={{
          title: 'Spaces',
          headerShown: false,
          // unmountOnBlur: true
        }} />
      <MainStack.Screen
        name={RouteNames.SpaceDashBoard}
        component={SpaceDashBoardWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Space Dashboard',
          headerShown: false,
        }} />
      <MainStack.Screen
        name={RouteNames.Hubs}
        component={HubsWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Hubs',
          headerShown: false,
        }} />

      <MainStack.Screen
        name={RouteNames.Collections}
        component={Collections}
        // initialParams={{ animation: true }}
        options={{
          title: 'Collections',
          headerShown: false,
        }} />








      <MainStack.Screen
        name={RouteNames.SpaceCreation}
        component={SpaceCreationWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Space Creation',
          headerShown: false,
        }}
      />





      <MainStack.Screen
        name={RouteNames.Browse}
        component={BrowseWeb}
        // initialParams={{ animation: true }}

        options={{
          title: 'Browse',
          headerShown: false,
          // unmountOnBlur: true


        }} />











      <MainStack.Screen
        name={RouteNames.SearchResult}
        component={SearchResultWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'Search',
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={RouteNames.MyDirectory}
        component={MyDirectoryWeb}
        // initialParams={{ animation: true }}
        options={{
          title: 'My Directory',
          headerShown: false,
        }}
      />














    </MainStack.Navigator>
  )
}






const NavigationWeb = () => {
  const [navigationState, setNavigationState] = useState(null);
  const token = useSelector((state: any) => state.reducer.token)
  const userId = useSelector((state: any) => state.reducer.userId)
  const dispatch = useDispatch()







  return (

    <NavigationContainer

      linking={linking}
      ref={navigationRef}

    >
      {
        token !== null
          ?
          <Main />
          // <TabNavigator />
          :
          <Stack.Navigator
            screenOptions={{
              detachPreviousScreen: true,
              cardStyle: {
                flex: 1
              }
            }}
            initialRouteName={RouteNames.Splash}>
            <Stack.Screen
              name={RouteNames.Splash}
              component={Splash}
              options={{
                title: 'Splash',
                headerShown: false,

              }}
            // initialParams={{ animation: true }}
            />
            <Stack.Screen
              name={RouteNames.Login}
              component={Login}
              options={{
                title: 'Login',
                headerShown: false,

              }}
              initialParams={{ animation: true }}
            />
            <Stack.Screen
              name={RouteNames.Otp}
              component={Otp}
              options={{
                title: 'Otp',
                detachPreviousScreen: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={RouteNames.SignUp}
              component={SignUp}
              options={{
                title: 'SignUp',
                detachPreviousScreen: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={RouteNames.SignUpForm}
              component={SignUpForm}
              options={{
                title: 'SignUp Form',
                detachPreviousScreen: true,
                headerShown: false,
              }}
            />


          </Stack.Navigator>
      }

    </NavigationContainer>
  )

}

export default NavigationWeb
