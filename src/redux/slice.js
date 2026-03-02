import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {

            console.log('caling sliceing')
            state.user = action.payload;
            state.isLoggedIn = true;

            // Persist user to AsyncStorage
            console.log('aciton ', action.payload)

            try {
                AsyncStorage.setItem("user", JSON.stringify(action.payload));
            } catch (error) {
                console.log('error', error)
            }


            console.log("Login data saved ✅");
        },

        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;

            AsyncStorage.removeItem("user").catch((err) =>
                console.log("Error removing user:", err)
            );

            console.log("Logout done ✅");
        },

        setUserFromStorage: (state, action) => {

            console.log('userdtasace stuser se ')
            state.user = action.payload;
            state.isLoggedIn = !!action.payload;
            console.log("User loaded from storage ✅", action.payload);
        },

        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            AsyncStorage.setItem("user", JSON.stringify(state.user)).catch((err) =>
                console.log("Error updating user:", err)
            );
            console.log("User updated ✅", state.user);
        },
    },
});

export const { login, logout, setUserFromStorage, updateUser } = authSlice.actions;
export default authSlice.reducer;
