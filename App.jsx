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

// --- Notification Provider Import ---
import { NotificationProvider } from "./src/redux/contextapi";

const AppContent = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          dispatch(setUserFromStorage(JSON.parse(savedUser)));
        }
      } catch (e) {
        console.log("Error loading user:", e);
      } finally {
        setIsReady(true);
      }
    };
    loadUser();
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#F54D27" />
      </View>
    );
  }

  return (
    // NotificationProvider ko yahan wrap kiya hai
    <NotificationProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </NotificationProvider>
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