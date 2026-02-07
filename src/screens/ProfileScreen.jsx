import { View, Text } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
    return (
        <View>
            <Text>ProfileScreen</Text>
        </View>
    )
}

export default ProfileScreen




























// import React, { useEffect } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import MainTabNavigator from "./src/navigation/TabNavigator";
// import ErrorBoundary from "./src/components/ErrorBoundary";
// import { Provider, useDispatch } from "react-redux";
// import { store } from "./src/redux/store"; // use named import if you exported as 'store'
// import { ThemeProvider } from "./src/contextapi/conxteapithem";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setUserFromStorage } from "./src/redux/authSlice";

// // Optional startup component to load user from AsyncStorage
// const AppStartup = ({ children }) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser) {
//           dispatch(setUserFromStorage(JSON.parse(storedUser)));
//         }
//       } catch (err) {
//         console.log("Error loading user:", err);
//       }
//     };
//     loadUser();
//   }, [dispatch]);

//   return children;
// };

// export default function App() {
//   return (
//     <Provider store={store}>
//       <ThemeProvider>
//         <AppStartup>
//           <ErrorBoundary>
//             <NavigationContainer>
//               <MainTabNavigator />
//             </NavigationContainer>
//           </ErrorBoundary>
//         </AppStartup>
//       </ThemeProvider>
//     </Provider>
//   );
// }
