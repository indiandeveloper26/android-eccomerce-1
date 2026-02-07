import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../redux/contextapi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice"; // Apna logout action import karein
import Icon from 'react-native-vector-icons/Ionicons';

export default function TestScreen() {
    const { user, isLoggedIn } = useSelector(state => state.auth);
    const { showToast, theme } = useTheme();
    const dispatch = useDispatch();
    const isDark = theme === "dark";

    const userData = user?.userdata;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0f1115" : "#F9FAFB" }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* 👤 Header Section */}
                <View style={styles.header}>
                    <Text style={[styles.greeting, { color: isDark ? "#fff" : "#111" }]}>
                        My Profile<Text style={{ color: "#F54D27" }}>.</Text>
                    </Text>
                    <TouchableOpacity onPress={() => showToast("Settings coming soon! ⚙️", "info")}>
                        <Icon name="settings-outline" size={24} color={isDark ? "#fff" : "#111"} />
                    </TouchableOpacity>
                </View>

                {isLoggedIn ? (
                    <>
                        {/* 💳 User Info Card */}
                        <View style={[styles.profileCard, { backgroundColor: isDark ? "#1f2937" : "#fff" }]}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: userData?.avatar || "https://ui-avatars.com/api/?name=" + userData?.name + "&background=F54D27&color=fff" }}
                                    style={styles.avatar}
                                />
                                <View style={styles.activeBadge} />
                            </View>

                            <Text style={[styles.userName, { color: isDark ? "#fff" : "#111" }]}>{userData?.name || "Premium User"}</Text>
                            <Text style={styles.userEmail}>{userData?.email}</Text>

                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={[styles.statNum, { color: isDark ? "#fff" : "#111" }]}>12</Text>
                                    <Text style={styles.statLabel}>Orders</Text>
                                </View>
                                <View style={[styles.divider, { backgroundColor: isDark ? "#374151" : "#E5E7EB" }]} />
                                <View style={styles.statBox}>
                                    <Text style={[styles.statNum, { color: isDark ? "#fff" : "#111" }]}>Gold</Text>
                                    <Text style={styles.statLabel}>Member</Text>
                                </View>
                            </View>
                        </View>

                        {/* 🛠 Menu Options */}
                        <View style={styles.menuContainer}>
                            <MenuButton icon="person-outline" title="Account Details" isDark={isDark} />
                            <MenuButton icon="card-outline" title="Payment Methods" isDark={isDark} />
                            <MenuButton
                                icon="bug-outline"
                                title="Test Toast Error"
                                isDark={isDark}
                                onPress={() => showToast("Something went wrong! ❌", "error")}
                                color="#F54D27"
                            />

                            <TouchableOpacity
                                style={[styles.logoutBtn, { borderTopColor: isDark ? "#374151" : "#E5E7EB" }]}
                                onPress={() => {
                                    dispatch(logout());
                                    showToast("Logged out successfully! 👋", "success");
                                }}
                            >
                                <Icon name="log-out-outline" size={22} color="#F54D27" />
                                <Text style={styles.logoutText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.guestContainer}>
                        <Icon name="lock-closed-outline" size={80} color="#9CA3AF" />
                        <Text style={styles.guestTitle}>Join the Club</Text>
                        <Text style={styles.guestSub}>Login to track orders and manage your profile.</Text>
                        <TouchableOpacity style={styles.loginBtn}>
                            <Text style={styles.loginBtnText}>Login Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// Reusable Menu Component
const MenuButton = ({ icon, title, isDark, onPress, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.iconWrap, { backgroundColor: isDark ? "#374151" : "#F3F4F6" }]}>
            <Icon name={icon} size={20} color={color || (isDark ? "#fff" : "#111")} />
        </View>
        <Text style={[styles.menuTitle, { color: isDark ? "#fff" : "#111" }]}>{title}</Text>
        <Icon name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    greeting: { fontSize: 32, fontWeight: "900", fontStyle: 'italic' },

    profileCard: {
        borderRadius: 30,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#F54D27' },
    activeBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4ADE80', position: 'absolute', bottom: 5, right: 5, borderWidth: 3, borderColor: '#fff' },
    userName: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
    userEmail: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginBottom: 20 },

    statsRow: { flexDirection: 'row', alignItems: 'center', width: '100%', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 20 },
    statBox: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 18, fontWeight: '900' },
    statLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },
    divider: { width: 1, height: 30 },

    menuContainer: { marginTop: 30 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuTitle: { flex: 1, fontSize: 16, fontWeight: '700' },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1 },
    logoutText: { marginLeft: 10, color: '#F54D27', fontWeight: '900', fontSize: 16 },

    guestContainer: { alignItems: 'center', marginTop: 100 },
    guestTitle: { fontSize: 24, fontWeight: '900', marginTop: 20 },
    guestSub: { color: '#9CA3AF', textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
    loginBtn: { backgroundColor: '#F54D27', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 20, marginTop: 30 },
    loginBtnText: { color: '#fff', fontWeight: '900' }
});