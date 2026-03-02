import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ErrorBoundary from 'react-native-error-boundary';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Storee from "./src/redux/store";
import StackNavigator from './src/navigaton/StackNavigator';
import ErrorScreen from './src/componet/errorboundary';
import { setUserFromStorage } from './src/redux/slice';
// Sahi path check kar lena

const AppContent = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1. Phone se data uthao
        const savedUser = await AsyncStorage.getItem("user");

        console.log('userdata', savedUser)
        if (savedUser) {
          console.log('userdata')
          // 2. Redux mein daal do
          dispatch(setUserFromStorage(JSON.parse(savedUser)));
        }
      } catch (e) {
        console.log("Error loading user:", e);
      } finally {
        // 3. App ready kar do
        setIsReady(true);
      }
    };
    loadUser();
  }, [dispatch]);

  // Jab tak check ho raha hai, tab tak loader dikhao
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#F54D27" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={Storee}>
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;