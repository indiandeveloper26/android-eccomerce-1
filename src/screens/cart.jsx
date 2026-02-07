import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../redux/contextapi";

export default function CartScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { user } = useSelector((state) => state.auth || {});
    const userId = user?.userdata?._id;

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalPrice = cart.reduce((sum, i) => sum + ((i?.product?.price || 0) * (i?.quantity || 0)), 0);

    const fetchCart = async () => {
        try {
            if (!userId) {
                setError("Please login to see your cart");
                setLoading(false);
                return;
            }
            const res = await fetch("https://eccomerce-wine.vercel.app/api/cart/get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

            const safeCart = (data.cart || []).filter(item => item?.product && item?.quantity);
            setCart(safeCart);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.itemCard, { backgroundColor: isDark ? "#1F2937" : "#FFF" }]}>
            <Image
                source={{ uri: `https://eccomerce-wine.vercel.app${item.product.images?.[0]}` }}
                style={styles.productImage}
            />
            <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: isDark ? "#FFF" : "#1A1A1A" }]} numberOfLines={1}>
                    {item.product.name}
                </Text>
                <Text style={styles.itemCategory}>Premium Quality</Text>
                <Text style={styles.itemPrice}>₹{item.product.price}</Text>

                {/* Quantity UI */}
                <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                    <Text style={[styles.qtyText, { color: isDark ? "#FFF" : "#000" }]}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                </View>
            </View>
            <View style={styles.rightAction}>
                <Text style={styles.itemTotal}>₹{item.product.price * item.quantity}</Text>
                <TouchableOpacity style={styles.removeBtn}>
                    <Text style={{ color: '#FF5252', fontSize: 12, fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return (
        <View style={[styles.center, { backgroundColor: isDark ? "#111827" : "#F9FAFB" }]}>
            <ActivityIndicator size="large" color="#F54D27" />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#F9FAFB" }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#1A1A1A" }]}>My Cart</Text>
                <Text style={styles.headerCount}>{cart.length} Items</Text>
            </View>

            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329073.png' }} style={styles.emptyImg} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <TouchableOpacity style={styles.shopNow} onPress={() => navigation.navigate("Home")}>
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Floating Checkout Summary */}
                    <View style={[styles.footer, { backgroundColor: isDark ? "#1F2937" : "#FFF" }]}>
                        <View style={styles.totalRow}>
                            <View>
                                <Text style={styles.totalLabel}>Total Price</Text>
                                <Text style={styles.totalAmount}>₹{totalPrice}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.checkoutBtn}
                                onPress={() => navigation.navigate("Checkout")}
                            >
                                <Text style={styles.checkoutBtnText}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    headerTitle: { fontSize: 28, fontWeight: "900" },
    headerCount: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
    listContent: { paddingHorizontal: 16, paddingBottom: 120 },
    itemCard: {
        flexDirection: "row",
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: "center",
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    productImage: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#F3F4F6' },
    itemDetails: { flex: 1, marginLeft: 15 },
    itemName: { fontSize: 16, fontWeight: "700" },
    itemCategory: { fontSize: 12, color: '#9CA3AF', marginVertical: 2 },
    itemPrice: { fontSize: 16, color: "#F54D27", fontWeight: "800" },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    qtyBtn: { backgroundColor: '#F3F4F6', width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    qtyText: { marginHorizontal: 12, fontWeight: 'bold' },
    rightAction: { alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
    itemTotal: { fontSize: 15, fontWeight: "700", color: '#1A1A1A' },
    removeBtn: { paddingVertical: 5 },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
    totalAmount: { fontSize: 24, fontWeight: "900", color: '#F54D27' },
    checkoutBtn: { backgroundColor: "#F54D27", paddingHorizontal: 35, paddingVertical: 15, borderRadius: 18, elevation: 5 },
    checkoutBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
    emptyImg: { width: 150, height: 150, opacity: 0.8 },
    emptyTitle: { fontSize: 18, color: '#9CA3AF', fontWeight: '600', marginTop: 20 },
    shopNow: { marginTop: 20, backgroundColor: '#F54D27', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
    shopNowText: { color: '#FFF', fontWeight: 'bold' }
});