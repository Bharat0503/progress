import React, { useEffect } from 'react';
import { View, Text, TextInput, LogBox, Linking } from 'react-native';
// import { Provider as PaperProvider } from 'react-native-paper'
import Navigation from './src/navigation/navigation'
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { persistor } from './src/redux/store';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import client from './src/services/ApolloClient';
LogBox.ignoreAllLogs(true);  // Hides all logs
import { setContentId, setSpaceDashBoard, setStartfromSpaceDashBoard, setToken } from './src/redux/action';
import { getAsyncData } from './src/utils/storage';
import { keys } from './src/utils/keys';
import navigationService from './src/navigation/navigationService';
import RouteNames from './src/navigation/routes';
import CustomStatusBar from './src/components/custom-statusbar';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}

const App: React.FC = () => {
    useEffect(() => {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
    }, []);

    // useEffect(() => {
    
    //     const handleDeepLink = async () => {
    //         // console.log('Deep Link URL:');
    //         // Extract the contentId from the URL
    //         const url = new URL('https://api-dev.staycurrent.globalcastmd.com/staycurrent?id=1608');
    //         const contentId = Number(url.searchParams.get('id'));

    //         // Check if contentId is a valid number
    //         if (!isNaN(contentId)) {
    //             // console.log('Deep Link URL:contentId' + contentId);
    //             const token = await getAsyncData(keys.userToken)
    //             const spaceId = contentId?.toString();
    //             Analytics.logSpaceBranchEvent(spaceId);

    //             if (token) {
    //                 console.log('Deep Link URL:token' + contentId);
    //                 dispatch(setContentId(contentId));
    //                 dispatch(setSpaceDashBoard(false))
    //                 dispatch(setStartfromSpaceDashBoard(false))
    //                 navigationService.navigate(RouteNames.Content, {
    //                     spaceDashboard: false
    //                 })
    //             }
    //         } else {
    //             console.error('Invalid contentId in deep link');
    //         }
    //     };
    //     handleDeepLink()
    //     // // Add the listener
    //     // const unsubscribe = Linking.addEventListener('url', handleDeepLink);

    //     // // Cleanup on unmount
    //     // return () => {
    //     //     unsubscribe.remove();
    //     // };
    // }, []);


    const [fontsLoaded] = useFonts({
        'regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'bold': require('./assets/fonts/Poppins-Bold.ttf'),
    });



    useEffect(() => {
        console.log("fontsLoaded", fontsLoaded)

    }, [])

    return (

        //
        <Provider store={store}>
            <ApolloProvider client={client}>
                {/* <PersistGate loading={null} persistor={persistor}> */}
                <SafeAreaProvider>
                    <CustomStatusBar />
                    <Navigation />
                </SafeAreaProvider>
            </ApolloProvider>



            {/* </PersistGate> */}


        </Provider>

        // <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        //     <Text>
        //         Bharat
        //     </Text>
        //     <TextInput
        //         style={{ borderColor: '#000', borderWidth: 1, width: '100%' }}
        //     />
        // </View>
    );
}

export default App
