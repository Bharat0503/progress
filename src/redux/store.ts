
import { thunk } from 'redux-thunk';
import { legacy_createStore as createStore, applyMiddleware,combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducer from './reducer';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
    reducer
});
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk))

export const persistor = persistStore(store)

export default store;