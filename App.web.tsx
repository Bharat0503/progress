
import React, { useEffect } from 'react';
// import { Provider as PaperProvider } from 'react-native-paper'
import NavigationWeb from './src/navigation/navigationWeb'
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { persistor } from './src/redux/store';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { ApolloProvider } from '@apollo/client';
import client from './src/services/ApolloClient';
import Navigation from './src/navigation/navigation';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import config from './src/utils/config';


// LogBox.ignoreAllLogs(true);  // Hides all logs


const App: React.FC = () => {

    useEffect(() => {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
       

    }, []);
    const [fontsLoaded] = useFonts({
        'regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'bold': require('./assets/fonts/Poppins-Bold.ttf'),
    });

    // useEffect(() => {

    // }, [dispatch]);
    return (


        <Provider store={store}>

            <ApolloProvider client={client}>


                <NavigationWeb />

            </ApolloProvider>





        </Provider>



    );
}

export default App
// import React from 'react';
// import { View, Text, TextInput } from 'react-native';



// const App = () => {
//     return (
//         <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>


//             <TextInput
//                 style={{ borderColor: '#000', borderWidth: 1, width: '100%' }}
//             />
//             <TextInput
//                 style={{ borderColor: '#000', borderWidth: 1, width: '100%' }}
//             />
//         </View>
//     );
// }

// export default App