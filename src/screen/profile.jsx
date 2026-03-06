import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, SafeAreaView, Dimensions, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../redux/slice';
import Feather from 'react-native-vector-icons/Feather';
import api from '../componet/axios';

// LayoutAnimation enable karne ke liye Android pe
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("overview");
    const [fullUser, setFullUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const userid = user?.userdata?._id || user?.data?.userId || user?._id;

    useEffect(() => {
        const fetchData = async () => {
            if (!userid) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/profile/${userid}`);
                if (res.data.success) {
                    setFullUser(res.data.user);
                    dispatch(updateUser(res.data.user));
                }
            } catch (err) {
                console.error("Profile Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (isLoggedIn) fetchData();
    }, [userid, isLoggedIn]);

    const displayUser = fullUser || user?.userdata || user;
    const cartCount = displayUser?.cart?.length || 0;
    const orderCount = displayUser?.orders?.length || 0;
    const memberSince = displayUser?.createdAt
        ? new Date(displayUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
        : "N/A";

    const changeTab = (tab) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tab);
    };

    if (!isLoggedIn) {
        return (
            <View style={styles.deniedContainer}>
                <Feather name="alert-circle" size={50} color="#F54D27" />
                <Text style={styles.deniedTitle}>Access Denied</Text>
                <Text style={styles.deniedSub}>Please login to view your profile.</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('login')}>
                    <Text style={styles.loginBtnText}>GO TO LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>

                {/* TOP HERO SECTION */}
                <View style={styles.heroCard}>
                    <View style={styles.heroRow}>
                        <View style={styles.avatarBox}>
                            <Text style={styles.avatarText}>
                                {displayUser?.name ? displayUser.name[0].toUpperCase() : "U"}
                            </Text>
                        </View>
                        <View style={styles.heroInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.userName} numberOfLines={1}>{displayUser?.name || "Guest"}</Text>
                                <Feather name="shield" size={14} color="#10b981" />
                            </View>
                            <Text style={styles.userEmail}><Feather name="mail" size={12} /> {displayUser?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.badgeRow}>
                        <View style={styles.miniBadge}>
                            <Text style={styles.badgeLabel}>SINCE</Text>
                            <Text style={styles.badgeVal}>{memberSince}</Text>
                        </View>
                        <View style={styles.miniBadge}>
                            <Text style={styles.badgeLabel}>STATUS</Text>
                            <Text style={[styles.badgeVal, { color: '#10b981' }]}>Verified</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.signOutBtn} onPress={() => dispatch(logout())}>
                        <Feather name="log-out" size={16} color="#ef4444" />
                        <Text style={styles.signOutText}>SIGN OUT</Text>
                    </TouchableOpacity>
                </View>

                {/* STATS ROW */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
                    <StatWidget icon="shopping-cart" label="CART" value={cartCount} color="#f97316" />
                    <StatWidget icon="package" label="ORDERS" value={orderCount} color="#3b82f6" />
                    <StatWidget icon="star" label="POINTS" value={orderCount * 10} color="#10b981" />
                </ScrollView>

                {/* DASHBOARD TABS */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabHeader}>
                        <TabButton active={activeTab === 'overview'} label="Overview" onPress={() => changeTab('overview')} />
                        <TabButton active={activeTab === 'orders'} label={`Orders (${orderCount})`} onPress={() => changeTab('orders')} />
                        <TabButton active={activeTab === 'cart'} label={`Cart (${cartCount})`} onPress={() => changeTab('cart')} />
                    </View>

                    <View style={styles.tabContent}>
                        {loading ? (
                            <ActivityIndicator color="#F54D27" style={{ margin: 40 }} />
                        ) : (
                            <>
                                {activeTab === 'overview' && (
                                    <View style={styles.infoGrid}>
                                        <InfoBox icon="credit-card" label="PAYMENT" value="Not Linked" />
                                        <InfoBox icon="clock" label="UPDATED" value={new Date(displayUser?.updatedAt).toLocaleTimeString()} />
                                        <InfoBox icon="lock" label="SECURITY" value="High" />
                                        <InfoBox icon="hash" label="UID" value={displayUser?._id?.slice(-8)} />
                                    </View>
                                )}
                                {activeTab === 'orders' && (
                                    <View style={styles.listContainer}>
                                        {displayUser?.orders?.length > 0 ? displayUser.orders.map((o, i) => (
                                            <ListItem key={i} title={`Order #${o._id?.slice(-6).toUpperCase()}`} sub="Standard Delivery" icon="package" />
                                        )) : <Text style={styles.emptyText}>No orders yet</Text>}
                                    </View>
                                )}
                                {activeTab === 'cart' && (
                                    <View style={styles.listContainer}>
                                        {displayUser?.cart?.length > 0 ? displayUser.cart.map((c, i) => (
                                            <ListItem key={i} title="Bag Item" sub={`Qty: ${c.quantity}`} icon="shopping-cart" />
                                        )) : <Text style={styles.emptyText}>Cart is empty</Text>}
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// Sub-components
const StatWidget = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
        <Feather name={icon} size={20} color={color} style={styles.statIcon} />
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const TabButton = ({ active, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
        <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
);

const InfoBox = ({ icon, label, value }) => (
    <View style={styles.infoBox}>
        <Feather name={icon} size={16} color="#F54D27" style={{ opacity: 0.6 }} />
        <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const ListItem = ({ title, sub, icon }) => (
    <View style={styles.listItem}>
        <View style={styles.listIconContainer}>
            <Feather name={icon} size={18} color="#111827" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.listTitle}>{title}</Text>
            <Text style={styles.listSub}>{sub}</Text>
        </View>
        <Feather name="chevron-right" size={16} color="#9ca3af" />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollPadding: { padding: 20 },
    heroCard: { backgroundColor: '#fff', borderRadius: 40, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, marginBottom: 20 },
    heroRow: { flexDirection: 'row', alignItems: 'center' },
    avatarBox: { width: 80, height: 80, borderRadius: 25, backgroundColor: '#F54D27', justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '5deg' }] },
    avatarText: { fontSize: 32, fontWeight: '900', color: '#fff' },
    heroInfo: { marginLeft: 20, flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    userName: { fontSize: 24, fontWeight: '900', color: '#111827', textTransform: 'uppercase' },
    userEmail: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginTop: 4 },
    badgeRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
    miniBadge: { backgroundColor: '#f9fafb', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 15, borderWeight: 1, borderColor: '#f3f4f6' },
    badgeLabel: { fontSize: 8, fontWeight: '900', color: '#9ca3af' },
    badgeVal: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
    signOutBtn: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', padding: 10 },
    signOutText: { fontSize: 12, fontWeight: '900', color: '#ef4444', letterSpacing: 1 },
    statsScroll: { marginBottom: 20 },
    statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 30, width: 130, marginRight: 15, elevation: 3 },
    statIcon: { marginBottom: 10, opacity: 0.8 },
    statLabel: { fontSize: 9, fontWeight: '900', color: '#9ca3af' },
    statValue: { fontSize: 26, fontWeight: '900', color: '#111827' },
    tabContainer: { backgroundColor: '#fff', borderRadius: 40, overflow: 'hidden', minHeight: 400, marginBottom: 40 },
    tabHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', margin: 15, borderRadius: 20, padding: 5 },
    tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15 },
    tabBtnActive: { backgroundColor: '#F54D27' },
    tabBtnText: { fontSize: 10, fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase' },
    tabBtnTextActive: { color: '#fff' },
    tabContent: { padding: 20 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    infoBox: { width: '48%', backgroundColor: '#f9fafb', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    infoLabel: { fontSize: 8, fontWeight: '900', color: '#9ca3af' },
    infoValue: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f3f4f6' },
    listIconContainer: { padding: 10, backgroundColor: '#f3f4f6', borderRadius: 15 },
    listTitle: { fontSize: 13, fontWeight: '900', color: '#111827' },
    listSub: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', marginTop: 2 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#d1d5db', fontStyle: 'italic', fontWeight: 'bold' },
    deniedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#f8f9fa' },
    deniedTitle: { fontSize: 24, fontWeight: '900', marginTop: 20, color: '#111827' },
    deniedSub: { color: '#9ca3af', textAlign: 'center', marginTop: 10 },
    loginBtn: { marginTop: 30, backgroundColor: '#F54D27', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 20 },
    loginBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 2 }
});