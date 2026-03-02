import React, { useEffect, useState } from "react";
import {
    View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, SafeAreaView, FlatList, LayoutAnimation, Platform, UIManager
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../componet/axios";
import url from "../componet/url";

// Android ke liye animation enable karna padta hai
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CartScreen({ navigation }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // 1. Fetch User ID
    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("id");

            console.log('userid', id)
            if (id) setUserId(id);
            else setLoading(false);
        };
        getUserId();
    }, []);

    // 2. Fetch Cart Data
    useEffect(() => {
        if (userId) fetchCart();
    }, [userId]);

    const fetchCart = async () => {
        try {
            const res = await api.post("/api/cart/get", { userId });

            console.log('cardta', res)
            setCart(res.data.cart || []);
        } catch (err) {
            console.log("Cart fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete Item with Animation
    const handleDelete = async (itemId) => {
        try {
            await api.delete(`/api/cart/delete/${itemId}`);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCart(cart.filter((item) => item._id !== itemId));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const totalPrice = cart.reduce((sum, i) => sum + ((i.product?.price || 0) * (i.quantity || 0)), 0);

    if (loading) return (
        <View style={styles.center}><ActivityIndicator size="large" color="#F54D27" /></View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cart<Text style={{ color: '#F54D27' }}>.</Text></Text>
                <View style={styles.itemBadge}>
                    <Text style={styles.itemBadgeText}>{totalItems} ITEMS</Text>
                </View>
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>YOUR BAG IS EMPTY</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.shopNowText}>START SHOPPING</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cartCard}>
                        <Image
                            source={{ uri: `${url}/${item.product.images}` }}
                            style={styles.productImg}
                        />



                        <View style={styles.details}>
                            <Text style={styles.prodName} numberOfLines={1}>{item.product?.name}</Text>
                            <Text style={styles.prodPrice}>₹{item.product?.price}</Text>

                            <View style={styles.qtyContainer}>
                                <TouchableOpacity style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity style={styles.qtyBtn}><Text style={{ color: '#F54D27' }}>+</Text></TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.rightActions}>
                            <Text style={styles.subtotal}>₹{item.product?.price * item.quantity}</Text>
                            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* SUMMARY PANEL (Fixed at Bottom) */}
            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>TOTAL</Text>
                        <Text style={styles.totalAmount}>₹{totalPrice}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() => navigation.navigate('Checkout')}
                    >
                        <Text style={styles.checkoutText}>SECURE CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        paddingHorizontal: 25,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: { fontSize: 36, fontWeight: "900", fontStyle: 'italic', color: '#111827' },
    itemBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    itemBadgeText: { fontSize: 10, fontWeight: '900', color: '#9ca3af' },

    cartCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 2,
    },
    productImg: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#f9fafb' },
    details: { flex: 1, paddingHorizontal: 15 },
    prodName: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4 },
    prodPrice: { color: '#F54D27', fontWeight: 'bold' },

    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 50,
        width: 90,
        justifyContent: 'space-around',
        paddingVertical: 2
    },
    qtyBtn: { padding: 5, width: 25, alignItems: 'center' },
    qtyText: { fontWeight: 'bold', fontSize: 14 },

    rightActions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 70 },
    subtotal: { fontWeight: '900', fontSize: 16, fontStyle: 'italic' },
    deleteBtn: { marginTop: 10 },

    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 25,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    totalLabel: { fontWeight: '900', fontSize: 14, color: '#9ca3af' },
    totalAmount: { fontSize: 28, fontWeight: '900', color: '#111827', fontStyle: 'italic' },
    checkoutBtn: { backgroundColor: '#111827', height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    checkoutText: { color: '#fff', fontWeight: '900', letterSpacing: 1.5 },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontWeight: '900', fontSize: 18, color: '#d1d5db', fontStyle: 'italic' },
    shopNowText: { color: '#F54D27', fontWeight: 'bold', marginTop: 15, borderBottomWidth: 2, borderColor: '#F54D27' }
});