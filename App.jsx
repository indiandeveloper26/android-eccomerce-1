
// import { NavigationContainer } from "@react-navigation/native";
// import MainTabNavigator from "./src/navigation/TabNavigator";
// import ErrorBoundary from "./src/components/ErrorBoundary";
// import { Provider, useDispatch } from "react-redux";
// import Storee from "./src/redux/store"
// import { ThemeProvider, ThemeProviderr } from "./src/redux/contextapi"
// import { useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setUserFromStorage } from "./src/redux/slice";




// const AppStartup = ({ children }) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser) {
//           console.log('firest laod ok now')
//           dispatch(setUserFromStorage(JSON.parse(storedUser)));
//         }
//         else {
//           console.log('not axit user')
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
//     <Provider store={Storee}>

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









import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/TabNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { Provider, useDispatch } from "react-redux";
import Storee from "./src/redux/store";
import { ThemeProvider, useTheme } from "./src/redux/contextapi"; // ThemeProvider + useTheme
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserFromStorage } from "./src/redux/slice";
import Toast from "./src/components/toast";

// 🔹 AppStartup logic (load user from AsyncStorage)
const AppStartup = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          console.log('First load ok', storedUser);
          dispatch(setUserFromStorage(JSON.parse(storedUser)));
        } else {
          console.log('No existing user');
        }
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };
    loadUser();
  }, [dispatch]);

  return children;
};

// 🔹 AppWrapper – Toast yahan render hoga
function AppWrapper() {
  const { toastMessage, toastType, hideToast } = useTheme();

  return (
    <>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>

      {/* 🔥 Top-level Toast */}
      <Toast
        message={toastMessage}
        type={toastType} // "error" or "success"
        onHide={hideToast} // auto reset
      />
    </>
  );
}

// 🔹 Main App
export default function App() {
  return (
    <Provider store={Storee}>
      <ThemeProvider>
        <AppStartup>
          <ErrorBoundary>
            <AppWrapper />
          </ErrorBoundary>
        </AppStartup>
      </ThemeProvider>
    </Provider>
  );
}
