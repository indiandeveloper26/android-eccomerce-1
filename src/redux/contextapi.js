import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("error");// sirf state ke liye

    // 🔒 FIXED COLORS (light/dark se independent)
    const colors = {
        background: "#ffffff",
        text: "#000000",
        primary: "#F54D27",
    };


    const showToast = (message, type = "error") => {
        setToastMessage(message);
        setToastType(type);
    };

    const hideToast = () => {
        setToastMessage("");
    };

    // Load saved theme (optional – logic ke liye)
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme");
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (err) {
                console.log("Error loading theme:", err);
            }
        };
        loadTheme();
    }, []);

    // Toggle theme (UI pe effect nahi karega)
    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem("theme", newTheme);
        } catch (err) {
            console.log("Error saving theme:", err);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,        // current theme (logic ke liye)
                toggleTheme,  // function
                colors,
                toastMessage, toastType, showToast, hideToast    // 🔥 FIXED COLORS
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// ✅ Custom hook
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return context;
};
