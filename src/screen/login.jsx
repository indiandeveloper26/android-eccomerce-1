import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Image, Dimensions, ScrollView, ActivityIndicator, Alert
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice"; // Apna path check karein
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../componet/axios";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            // NOTE: Replace with your actual IP Address (e.g., http://192.168.1.5:5000)
            const res = await api.post("/api/auth/login", form);

            console.log('userres', res)

            if (res.data.login === "true") {
                const userdata = res.data.user;
                // Storage mein save karo taaki refresh pe udde nahi
                await AsyncStorage.setItem("id", userdata._id);
                await AsyncStorage.setItem("user", JSON.stringify(userdata));

                dispatch(login(userdata));
                // navigation.replace("MainTabs");
            } else {
                Alert.alert("Login Failed", res.data.error || "Invalid credentials");
            }
        } catch (err) {
            Alert.alert("Error", "Server se connection nahi ho paya. IP check karo!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            {/* Upper Section: Brand Color & Image */}
            <View style={styles.headerCard}>
                <Text style={styles.logoText}>CORE<Text style={{ color: '#ffd0c7' }}>CART</Text></Text>

                <View style={styles.imageWrapper}>
                    <Image
                        source={require('../assets/login.jpg')}

                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.title}>New Season, New Rewards.</Text>
                    <Text style={styles.subtitle}>Log in to claim your member-only discounts.</Text>
                </View>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSub}>Please enter your credentials to proceed.</Text>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <TextInput
                        placeholder="your@email.com"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        value={form.email}
                        onChangeText={(val) => setForm({ ...form, email: val })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TouchableOpacity><Text style={styles.forgotText}>Forgot?</Text></TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        value={form.password}
                        onChangeText={(val) => setForm({ ...form, password: val })}
                        secureTextEntry
                    />
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginBtn, loading && { opacity: 0.8 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginBtnText}>ENTER STORE  →</Text>
                    )}
                </TouchableOpacity>

                {/* Footer Link */}
                <TouchableOpacity onPress={() => navigation.navigate("singup")} style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>

                {/* Trust Badge using pure CSS */}
                <View style={styles.badgeContainer}>
                    <View style={styles.secureDot} />
                    <Text style={styles.badgeText}>256-BIT SSL SECURED</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#fff" },

    // Header Style (Orange Section)
    headerCard: {
        backgroundColor: "#F54D27",
        paddingHorizontal: 25,
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    logoText: { color: "#fff", fontSize: 22, fontWeight: "900", fontStyle: "italic", marginBottom: 20 },
    imageWrapper: {
        width: '100%',
        height: 180,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#eee',
        transform: [{ rotate: '2deg' }],
        // Android Shadow
        elevation: 10,
        // iOS Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    heroImage: { width: '100%', height: '100%' },
    headerInfo: { marginTop: 25 },
    title: { color: "#fff", fontSize: 20, fontWeight: "800" },
    subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },

    // Form Section Style
    formContainer: { padding: 25, marginTop: 10 },
    welcomeTitle: { fontSize: 28, fontWeight: "900", color: "#111827" },
    welcomeSub: { color: "#6b7280", fontSize: 14, marginBottom: 25 },

    inputGroup: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: 10, fontWeight: "800", color: "#9ca3af", letterSpacing: 1, marginBottom: 8 },
    input: {
        backgroundColor: "#f9fafb",
        height: 55,
        borderRadius: 15,
        paddingHorizontal: 15,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        borderWidth: 1,
        borderColor: "#f3f4f6"
    },
    forgotText: { fontSize: 10, fontWeight: "800", color: "#F54D27" },

    loginBtn: {
        backgroundColor: "#F54D27",
        height: 60,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        elevation: 5,
        shadowColor: "#F54D27",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    loginBtnText: { color: "#fff", fontWeight: "900", fontSize: 14, letterSpacing: 1 },

    footer: { marginTop: 25, alignSelf: 'center' },
    footerText: { color: "#6b7280", fontSize: 14, fontWeight: "700" },
    signUpLink: { color: "#F54D27" },

    badgeContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, opacity: 0.4 },
    secureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e', marginRight: 6 },
    badgeText: { fontSize: 9, fontWeight: "900", color: "#374151" }
});