import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../redux/contextapi"; // Theme context

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { user } = useSelector(state => state.auth);
    const userId = user?.userdata?._id;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`https://eccomerce-wine.vercel.app/api/order/orderdata/${userId}`);
                const data = await res.json();
                if (data.success) {
                    setOrders(data.data.orders || []);
                }
            } catch (err) {
                Alert.alert("Error", "Unable to fetch orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    const renderItem = ({ item }) => (
        <View style={[styles.orderCard, { backgroundColor: isDark ? "#1f2937" : "#fff" }]}>
            {/* Order Info Header */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.idLabel}>ORDER ID</Text>
                    <Text style={[styles.idValue, { color: isDark ? "#fff" : "#111" }]}>
                        #{item._id.slice(-8).toUpperCase()}
                    </Text>
                </View>
                <View style={[styles.statusBadge,
                item.status === "Paid" ? styles.paidBadge : styles.pendingBadge]}>
                    <Text style={[styles.statusText,
                    item.status === "Paid" ? styles.paidText : styles.pendingText]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Product Mini List */}
            <View style={styles.productList}>
                {item.products.map(({ product, quantity }, idx) => (
                    <View key={idx} style={styles.productRow}>
                        <Image
                            source={{ uri: `https://eccomerce-wine.vercel.app${product?.images?.[0]}` }}
                            style={styles.productImage}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.productName, { color: isDark ? "#fff" : "#111" }]} numberOfLines={1}>
                                {product?.name || "Premium Item"}
                            </Text>
                            <Text style={styles.productMeta}>Qty: {quantity} • ₹{product?.price}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Pricing & Date */}
            <View style={[styles.footer, { borderTopColor: isDark ? "#374151" : "#F3F4F6" }]}>
                <View>
                    <Text style={styles.totalLabel}>TOTAL INVESTMENT</Text>
                    <Text style={styles.totalAmount}>₹{item.totalPrice}</Text>
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                </Text>
            </View>

            <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>VIEW DETAILS →</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) return (
        <View style={[styles.center, { backgroundColor: isDark ? "#0f1115" : "#f9fafb" }]}>
            <ActivityIndicator size="large" color="#F54D27" />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0f1115" : "#f9fafb" }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.subTitle}>YOUR HISTORY</Text>
                        <Text style={[styles.mainTitle, { color: isDark ? "#fff" : "#111" }]}>
                            MY ORDERS<Text style={{ color: "#F54D27" }}>.</Text>
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>NO ORDERS YET</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    listPadding: { padding: 20 },
    headerContainer: { marginBottom: 30, marginTop: 10 },
    subTitle: { color: "#F54D27", fontWeight: "900", fontSize: 12, letterSpacing: 4 },
    mainTitle: { fontSize: 44, fontWeight: "900", fontStyle: "italic", letterSpacing: -2, marginTop: -5 },

    orderCard: {
        borderRadius: 30,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
    idLabel: { fontSize: 10, fontWeight: "900", color: "#9ca3af", letterSpacing: 1 },
    idValue: { fontSize: 16, fontWeight: "900" },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    statusText: { fontSize: 10, fontWeight: "900" },
    paidBadge: { backgroundColor: "#D1FAE5" },
    paidText: { color: "#065F46" },
    pendingBadge: { backgroundColor: "#FEF3C7" },
    pendingText: { color: "#92400E" },

    productList: { marginBottom: 15 },
    productRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    productImage: { width: 50, height: 50, borderRadius: 12, backgroundColor: "#f3f4f6", marginRight: 15 },
    productName: { fontSize: 14, fontWeight: "800", textTransform: "uppercase" },
    productMeta: { fontSize: 11, color: "#9ca3af", fontWeight: "700" },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: 15,
        borderTopWidth: 1,
        borderStyle: "dashed",
    },
    totalLabel: { fontSize: 9, fontWeight: "900", color: "#9ca3af", letterSpacing: 1 },
    totalAmount: { fontSize: 24, fontWeight: "900", fontStyle: "italic", color: "#F54D27" },
    dateText: { fontSize: 10, fontWeight: "900", color: "#9ca3af" },

    viewBtn: { marginTop: 15, backgroundColor: "#F54D27", paddingVertical: 12, borderRadius: 15, alignItems: "center" },
    viewBtnText: { color: "#fff", fontWeight: "900", fontSize: 12, letterSpacing: 1 },

    emptyContainer: { marginTop: 100, alignItems: "center" },
    emptyText: { fontWeight: "900", color: "#9ca3af", fontSize: 16, fontStyle: "italic" }
});