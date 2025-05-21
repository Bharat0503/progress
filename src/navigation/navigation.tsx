import React, { useEffect } from 'react'
import { Easing, Animated, BackHandler, ToastAndroid, StatusBar } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationService';
import RouteNames from './routes/index';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './tabBar';
import { createDrawerNavigator } from "@react-navigation/drawer";

//SCREENS
import Splash from '../screens/mobile/splash/splash'
import Otp from '../screens/mobile/otp/otp';
import SignUp from '../screens/mobile/signUp/signUp';
import SignUpForm from '../screens/mobile/signUpForm/signUpForm';
import DashBoard from '../screens/mobile/home/home';
import Browse from '../screens/mobile/browse/browse';
import Home from '../screens/mobile/home/home';
import Spaces from '../screens/mobile/spaces/spaces';
import UpgradeToSc from '../screens/mobile/upgradeToSc/upgradeToSc';
import { getAsyncData } from '../utils/storage';
import { keys } from '../utils/keys';
import { RootTabStackParamList } from './routes/route-tab-stack-params';
import { RootStackParamList } from './routes/route-stack-params';
import Icons from '../assets/icons';
import CustomDrawerContent from './drawer';
import config from '../utils/config';
import Profile from '../screens/mobile/profile/profile';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setUserId } from '../redux/action';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { handleGetUserDetailsAPI } from '../api/commonApiMethod';
import EditProfile from '../screens/mobile/editProfile/editProfile';
import Login from '../screens/mobile/login/login';
import Hubs from '../screens/mobile/hubs/hubs';
import SpaceDashBoard from '../screens/mobile/spaceDashBoard/spaceDashBoard';
import FollowersFollowing from '../screens/mobile/followersfollowing/followersfollowing';
import UserSearch from '../screens/mobile/userSearch/userSearch';
import UserProfile from '../screens/mobile/userProfile/userProfile';
import SearchResult from '../screens/mobile/searchResult/searchResult';
import Content from '../screens/mobile/content/content';
import ContentInfographicImage from '../screens/mobile/content/contentInfographicImage';
import CommentsScreen from '../screens/mobile/commentsHandling/commentsScreen';
import History from '../screens/mobile/history/history';
import Downloads from '../screens/mobile/downloads/downloads';
import MyDirectory from '../screens/mobile/myDirectory/myDirectory.native';
import Groups from '../screens/mobile/groups/groups.native';
import GroupName from '../screens/mobile/groupName/groupName.native';
import NewGroup from '../screens/mobile/newGroup/newGroup.native';
import Favorites from '../screens/mobile/favorites/favorites.native';
import Collections from '../screens/mobile/collections/collections';
import ContentGuidelinePdf from '../screens/mobile/content/contentGuidellinePdf';
import SpaceCreation from '../screens/mobile/spaceCreation';
import FeaturedContentListing from '../screens/mobile/featuredContentListing/featuredContentListing';
import DownloadedContent from '../screens/mobile/downloadedContent/downloadedContent';
import PrivacyScreen from '../screens/mobile/leftmenu/privacyScreen';
import TermsConditionsScreen from '../screens/mobile/leftmenu/termsConditions';

const Stack = createNativeStackNavigator<RootStackParamList>()

const HomeStack = createNativeStackNavigator<RootStackParamList>()
const SpaceStack = createNativeStackNavigator<RootStackParamList>()
const BrowseStack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabStackParamList>();
const Drawer = createDrawerNavigator();

function BrowseNavigator() {
    return (
        <BrowseStack.Navigator initialRouteName={RouteNames.Browse} >
            <BrowseStack.Screen
                name={RouteNames.Home}
                component={Home}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />
            <BrowseStack.Screen
                name={RouteNames.Browse}
                component={Browse}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <BrowseStack.Screen
                name={RouteNames.Content}
                component={Content}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <BrowseStack.Screen
                name={RouteNames.CommentsScreen}
                component={CommentsScreen}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <BrowseStack.Screen
                name={RouteNames.Profile}
                component={Profile}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />
            <BrowseStack.Screen
                name={RouteNames.EditProfile}
                component={EditProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <BrowseStack.Screen
                name={RouteNames.FollowersFollowing}
                component={FollowersFollowing}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <BrowseStack.Screen
                name={RouteNames.UserSearch}
                component={UserSearch}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <BrowseStack.Screen
                name={RouteNames.UserProfile}
                component={UserProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <BrowseStack.Screen
                name={RouteNames.SpaceCreation}
                component={SpaceCreation}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
        </BrowseStack.Navigator>
    )

}



function HomeNavigator() {
    return (
        <HomeStack.Navigator initialRouteName={RouteNames.Home} >
            <HomeStack.Screen
                name={RouteNames.Home}
                component={Home}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />
            <HomeStack.Screen
                name={RouteNames.Profile}
                component={Profile}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />
            <HomeStack.Screen
                name={RouteNames.EditProfile}
                component={EditProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.SearchResult}
                component={SearchResult}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.FollowersFollowing}
                component={FollowersFollowing}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.UserSearch}
                component={UserSearch}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.UserProfile}
                component={UserProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.History}
                component={History}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.Downloads}
                component={Downloads}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.CommentsScreen}
                component={CommentsScreen}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.Content}
                component={Content}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.ContentInfographicImage}
                component={ContentInfographicImage}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.MyDirectory}
                component={MyDirectory}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.Groups}
                component={Groups}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.GroupName}
                component={GroupName}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.NewGroup}
                component={NewGroup}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.Favorites}
                component={Favorites}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.SpaceCreation}
                component={SpaceCreation}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />

            <HomeStack.Screen
                name={RouteNames.ContentGuidelinePdf}
                component={ContentGuidelinePdf}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,

                }} />
            <HomeStack.Screen
                name={RouteNames.FeaturedContentListing}
                component={FeaturedContentListing}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <HomeStack.Screen
                name={RouteNames.DownloadedContent}
                component={DownloadedContent}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    )
}

function SpaceNavigator() {
    return (
        <SpaceStack.Navigator initialRouteName={RouteNames.Spaces} >
            <SpaceStack.Screen
                name={RouteNames.Home}
                component={Home}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />
            <SpaceStack.Screen
                name={RouteNames.Spaces}
                component={Spaces}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.Hubs}
                component={Hubs}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.SpaceDashBoard}
                component={SpaceDashBoard}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.Collections}
                component={Collections}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />

            <SpaceStack.Screen
                name={RouteNames.Content}
                component={Content}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.CommentsScreen}
                component={CommentsScreen}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.ContentInfographicImage}
                component={ContentInfographicImage}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.ContentGuidelinePdf}
                component={ContentGuidelinePdf}
                initialParams={{ animation: true }}
                options={{

                    headerShown: false,

                }} />

            <SpaceStack.Screen
                name={RouteNames.Profile}
                component={Profile}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.EditProfile}
                component={EditProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.FollowersFollowing}
                component={FollowersFollowing}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.UserSearch}
                component={UserSearch}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.UserProfile}
                component={UserProfile}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.History}
                component={History}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.Downloads}
                component={Downloads}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <SpaceStack.Screen
                name={RouteNames.MyDirectory}
                component={MyDirectory}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.Groups}
                component={Groups}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.GroupName}
                component={GroupName}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.NewGroup}
                component={NewGroup}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.Favorites}
                component={Favorites}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.FeaturedContentListing}
                component={FeaturedContentListing}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} />
            <SpaceStack.Screen
                name={RouteNames.DownloadedContent}
                component={DownloadedContent}
                initialParams={{ animation: true }}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
           
            <HomeStack.Screen
                name={RouteNames.SpaceCreation}
                component={SpaceCreation}
                  options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />

        </SpaceStack.Navigator>
    )
}

function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={RouteNames.HomeNavigator}
            screenOptions={{ popToTopOnBlur: true }}
            tabBar={(props) => <TabBar  {...props} />}

        >
        
            <Tab.Screen
                name={RouteNames.BrowseNavigator}
                component={BrowseNavigator}
                initialParams={{ displayName: 'Browse', icon: Icons.browse }}
                options={{
                    headerShown: false,
                    // popToTopOnBlur: true
                }}
            />
            <Tab.Screen
                name={RouteNames.HomeNavigator}
                component={HomeNavigator}
                initialParams={{ displayName: 'Home', icon: Icons.home }}
                options={{
                    headerShown: false,
                    // popToTopOnBlur: true
                }}
            />
            <Tab.Screen
                name={RouteNames.SpaceNavigator}
                component={SpaceNavigator}
                initialParams={{ displayName: 'Spaces', icon: Icons.spaces }}
                options={{
                    headerShown: false,
                    // popToTopOnBlur: true
                }} />
            {/* <Tab.Screen
                name={RouteNames.UpgradeToSC}
                component={UpgradeToSc}
                initialParams={{ displayName: "Upgarde To SC\nPremium", icon: Icons.upgradeToSc }}
                  options={{
                    gestureEnabled: false,
                    headerShown: false,
                }} /> */}
        </Tab.Navigator>
    );
}

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: { width: config.getWidth(55) }
            }}
        >
            <Drawer.Screen name="BottomTab" component={TabNavigator} options={{ swipeEnabled: false }} />

            {/* <Drawer.Screen name={RouteNames.Home} component={Home} />
            <Drawer.Screen name={RouteNames.SignUp} component={SignUp} /> */}
            <Drawer.Screen
                name={RouteNames.SpaceCreation}
                component={TabNavigator}
                options={{ swipeEnabled: false }}
            />
            <HomeStack.Screen
                name={RouteNames.Downloads}
                component={Downloads}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.Favorites}
                component={Favorites}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.PrivacyScreen}
                component={PrivacyScreen}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name={RouteNames.TermsConditionsScreen}
                component={TermsConditionsScreen}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />

        </Drawer.Navigator>
    )
}










const Navigation = () => {

    const token = useSelector((state: any) => state.reducer.token)
    const userId = useSelector((state: any) => state.reducer.userId)
    const dispatch = useDispatch()

    useEffect(() => {
     
    }, [])
    // console.log("TOKEN", token, userId)
    return (


        <NavigationContainer ref={navigationRef}>
            {
                token !== null
                    ? <DrawerNavigator />
                    :


                    <Stack.Navigator initialRouteName={RouteNames.Splash}>
                        <Stack.Screen
                            name={RouteNames.Splash}
                            component={Splash}
                            initialParams={{ animation: true }}
                            options={{

                                headerShown: false,

                            }} />
                        <Stack.Screen
                            name={RouteNames.Login}
                            component={Login}
                            initialParams={{ animation: true }}
                            options={{
                                gestureEnabled: false,
                                headerShown: false,

                            }} />
                        <Stack.Screen
                            name={RouteNames.Otp}
                            component={Otp}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={RouteNames.SignUp}
                            component={SignUp}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={RouteNames.SignUpForm}
                            component={SignUpForm}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={RouteNames.Main}
                            component={DrawerNavigator}
                            options={{
                                headerShown: false,
                            }}
                        />

                    </Stack.Navigator>
            }
        </NavigationContainer>


    )

}

export default Navigation
