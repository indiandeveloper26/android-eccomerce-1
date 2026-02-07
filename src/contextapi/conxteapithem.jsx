import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light"); // default theme

    // Load theme from AsyncStorage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme");
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.log("Error loading theme:", error);
            }
        };
        loadTheme();
    }, []);

    // Toggle theme and save to AsyncStorage
    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem("theme", newTheme);
        } catch (error) {
            console.log("Error saving theme:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);
