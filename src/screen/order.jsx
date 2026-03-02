import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import api from '../componet/axios'; // Apka axios instance
import url from '../componet/url';

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem("id");
            if (!userId) {
                setError("Please login to see orders");
                return;
            }

            const res = await api.get(`/api/order/orderdata/${userId}`);
            console.log('orersdata', res)
            if (res.data.success) {
                setOrders(res.data.data.orders || []);
            }
        } catch (err) {
            setError("Could not load history");
        } finally {
            setLoading(false);
        }
    };

    const renderOrderItem = ({ item, index }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <View style={styles.orderInfo}>
                    <View style={styles.packageBox}>
                        <Feather name="package" size={18} color="#F54D27" />
                    </View>
                    <View>
                        <Text style={styles.label}>ORDER ID</Text>
                        <Text style={styles.orderIdText}>#{item._id.slice(-8).toUpperCase()}</Text>
                    </View>
                </View>

                <View style={[styles.statusBadge,
                { backgroundColor: item.status === "Paid" ? "#ecfdf5" : "#fffbeb" }]}>
                    <Text style={[styles.statusText,
                    { color: item.status === "Paid" ? "#10b981" : "#f59e0b" }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.productsList}>
                {item.products.map((prod, idx) => (
                    <View key={idx} style={styles.productRow}>
                        <Image
                            source={{ uri: `${url}/${prod.product?.images?.[0]}` || 'https://via.placeholder.com/150' }}
                            style={styles.productImg}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={1}>
                                {prod.product?.name || "Premium Item"}
                            </Text>
                            <Text style={styles.productMeta}>
                                Qty: {prod.quantity} • ₹{prod.price}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.label}>TOTAL INVESTMENT</Text>
                    <Text style={styles.totalPrice}>₹{item.totalPrice}</Text>
                </View>
                <TouchableOpacity style={styles.detailBtn}>
                    <Feather name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.dateBar}>
                <Feather name="clock" size={10} color="#9ca3af" />
                <Text style={styles.dateText}>
                    BOOKED {new Date(item.createdAt).toLocaleDateString('en-GB')}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#F54D27" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.headerSection}>
                <Text style={styles.subTitle}>YOUR HISTORY</Text>
                <View style={styles.titleRow}>
                    <Text style={styles.mainTitle}>My Orders<Text style={{ color: '#F54D27' }}>.</Text></Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{orders.length}</Text>
                    </View>
                </View>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Feather name="shopping-bag" size={50} color="#d1d5db" />
                    <Text style={styles.emptyText}>{error || "No Orders Yet"}</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerSection: { padding: 25, paddingTop: 40 },
    subTitle: { fontSize: 10, fontWeight: '900', color: '#F54D27', letterSpacing: 3, marginBottom: 5 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mainTitle: { fontSize: 34, fontWeight: '900', fontStyle: 'italic', color: '#111827' },
    countBadge: { backgroundColor: '#111827', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12 },
    countText: { color: '#fff', fontWeight: '900' },

    listPadding: { paddingHorizontal: 20, paddingBottom: 40 },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 30,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    orderInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    packageBox: { backgroundColor: '#F3F4F6', padding: 10, borderRadius: 15 },
    label: { fontSize: 8, fontWeight: '900', color: '#9ca3af', letterSpacing: 1 },
    orderIdText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontSize: 10, fontWeight: '900' },

    productsList: { marginBottom: 20 },
    productRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    productImg: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F3F4F6' },
    productDetails: { flex: 1 },
    productName: { fontSize: 13, fontWeight: '900', textTransform: 'uppercase', color: '#111827' },
    productMeta: { fontSize: 10, color: '#9ca3af', marginTop: 2 },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderStyle: 'dashed'
    },
    totalPrice: { fontSize: 22, fontWeight: '900', color: '#F54D27', fontStyle: 'italic' },
    detailBtn: { backgroundColor: '#111827', padding: 12, borderRadius: 15 },

    dateBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 15, opacity: 0.5 },
    dateText: { fontSize: 9, fontWeight: '900', color: '#9ca3af', letterSpacing: 1 },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 15, fontSize: 16, fontWeight: '900', color: '#d1d5db', textTransform: 'uppercase' }
});