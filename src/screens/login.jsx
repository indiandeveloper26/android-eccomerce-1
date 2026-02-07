import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice";

export default function LoginScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://eccomerce-wine.vercel.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            console.log(data)

            if (data.login === "true") {
                dispatch(login({ userdata: data.user }));
                navigation.navigate("Home");
            } else {
                Alert.alert("Error", data.error || "Invalid credentials");
            }
        } catch (err) {
            Alert.alert("Error", "Server not responding. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#fff" }}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* Top Image Section */}
                <View style={styles.headerSection}>
                    <Image
                        source={require("../assets/login.jpg")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Form Section */}
                <View style={styles.formCard}>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.subText}>Sign in to continue your shopping</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            placeholder="example@mail.com"
                            placeholderTextColor="#999"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                value={form.password}
                                onChangeText={(text) => setForm({ ...form, password: text })}
                                secureTextEntry={!showPassword}
                                style={[styles.input, { borderWeight: 0, flex: 1, marginBottom: 0 }]}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Text style={{ fontSize: 12, color: "#F54D27", fontWeight: 'bold' }}>
                                    {showPassword ? "HIDE" : "SHOW"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPass}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        style={[styles.loginButton, loading && { backgroundColor: "#ff8a70" }]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.noAccount}>New member? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text style={styles.signupLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: "#fff" },
    headerSection: {
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    image: { width: "75%", height: "100%" },
    formCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 30,
        paddingTop: 20,
        // Shadow for premium look
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    welcomeText: { fontSize: 30, fontWeight: "900", color: "#1A1A1A", letterSpacing: -0.5 },
    subText: { fontSize: 14, color: "#777", marginBottom: 30, marginTop: 5 },

    inputWrapper: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8, marginLeft: 5 },
    input: {
        width: "100%",
        height: 55,
        backgroundColor: "#F3F4F6", // Light grey background
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#000",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    eyeIcon: { paddingHorizontal: 15 },

    forgotPass: { alignSelf: "flex-end", marginBottom: 25 },
    forgotText: { color: "#F54D27", fontSize: 13, fontWeight: "600" },

    loginButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#F54D27",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#F54D27",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        paddingBottom: 20
    },
    noAccount: { fontSize: 15, color: "#666" },
    signupLink: { fontSize: 15, color: "#F54D27", fontWeight: "bold" },
});