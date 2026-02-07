import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Toast({ message = "now", type = "error", duration = 1500, onHide }) {
    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-100)).current; // top ke bahar se start

    useEffect(() => {
        if (message) {
            setVisible(true);

            Animated.timing(slideAnim, {
                toValue: height * 0.2, // screen ka 30% from top
                duration: 300,
                useNativeDriver: false,
            }).start();

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const hideToast = () => {
        Animated.timing(slideAnim, {
            toValue: -100, // top ke bahar wapas
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setVisible(false);
            if (onHide) onHide();
        });
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.toast,
                { top: slideAnim, backgroundColor: type === "error" ? "#F54D27" : "#4BB543" },
            ]}
        >
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        alignSelf: "center",
        width: width - 40,
        padding: 15,
        borderRadius: 8,
        zIndex: 9999,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
});
