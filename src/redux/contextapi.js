import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [msg, setMsg] = useState("");
    const [type, setType] = useState("success");
    const anim = useRef(new Animated.Value(-100)).current; // Upar chupa hua

    const showNotify = useCallback((text, status = "success") => {
        setMsg(text);
        setType(status);

        // Animation Sequence
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 20, // Niche slide hoga
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.delay(2000), // 2 second rukega
            Animated.timing(anim, {
                toValue: -120, // Wapas upar
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [anim]);

    return (
        <NotificationContext.Provider value={{ showNotify }}>
            {children}
            <Animated.View style={[
                styles.toast,
                {
                    backgroundColor: type === "error" ? "#E74C3C" : type === "info" ? "#3498DB" : "#ED5609",
                    transform: [{ translateY: anim }]
                }
            ]}>
                <SafeAreaView style={styles.content}>
                    <Icon name={type === "success" ? "checkmark-circle" : "alert-circle"} size={22} color="#FFF" />
                    <Text style={styles.text}>{msg}</Text>
                </SafeAreaView>
            </Animated.View>
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 40, left: 20, right: 20,
        borderRadius: 15,
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    content: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    text: { color: '#fff', fontWeight: '700', marginLeft: 10, fontSize: 14 }
});