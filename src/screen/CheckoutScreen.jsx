import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions, TextInput, ActivityIndicator,
    SafeAreaView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import api from '../componet/axios';
import url from "../componet/url"
const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
    const navigation = useNavigation();

    console.log('chelout', url)

    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Online");
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        const prepareCheckout = async () => {
            try {
                const storedId = await AsyncStorage.getItem("id");
                const buyProduct = await AsyncStorage.getItem("buyNowProduct");

                if (storedId) setUserId(storedId);

                if (buyProduct) {
                    setProduct(JSON.parse(buyProduct));
                } else {
                    Alert.alert("Error", "No product selected!");
                    navigation.goBack();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        prepareCheckout();
    }, []);

    const handlePlaceOrder = async () => {
        if (!userId) return Alert.alert("Login Required", "Please login first.");
        if (!address.trim()) return Alert.alert("Required", "Shipping address is required!");

        setPlacingOrder(true);
        try {
            const res = await api.post("/api/order", {
                userId,
                product,
                quantity: 1,
                totalPrice: product.price,
                address,
                paymentMethod,
            });

            if (res.data.success) {
                Alert.alert("Success", "Order secured successfully!");
                if (paymentMethod === "Online") {
                    // Navigate to Payment Screen
                    navigation.navigate('payment', { orderId: res.data.order._id });
                } else {
                    navigation.navigate('orders');
                }
            }
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to place order");
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading || !product) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#F54D27" />
                <Text style={styles.loadingText}>SECURE CHECKOUT...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={20} color="#111827" />
                        <Text style={styles.backText}>RETURN</Text>
                    </TouchableOpacity>
                    <View style={styles.secureBadge}>
                        <Feather name="shield" size={14} color="#10b981" />
                        <Text style={styles.secureText}>SECURE SSL</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Order Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.sectionTag}>ORDER SUMMARY</Text>
                        <View style={styles.productRow}>
                            <Image source={{ uri: `${url}/${product.images}` }} style={styles.prodImg} />
                            <View style={styles.prodInfo}>
                                <Text style={styles.prodName}>{product.name}</Text>
                                <Text style={styles.prodPrice}>₹{product.price}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Subtotal</Text>
                            <Text style={styles.priceVal}>₹{product.price}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Shipping</Text>
                            <Text style={[styles.priceVal, { color: '#10b981' }]}>FREE</Text>
                        </View>
                        <View style={[styles.priceRow, { marginTop: 10 }]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalVal}>₹{product.price}</Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>

                        {/* Address Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <View style={styles.iconCircle}><Feather name="map-pin" size={16} color="#fff" /></View>
                                <Text style={styles.inputLabel}>DELIVERY DETAILS</Text>
                            </View>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Enter full shipping address..."
                                multiline
                                numberOfLines={4}
                                value={address}
                                onChangeText={setAddress}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        {/* Payment Method */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <View style={[styles.iconCircle, { backgroundColor: '#111827' }]}><Feather name="credit-card" size={16} color="#fff" /></View>
                                <Text style={styles.inputLabel}>PAYMENT METHOD</Text>
                            </View>

                            <View style={styles.radioGrid}>
                                <TouchableOpacity
                                    style={[styles.radioBox, paymentMethod === 'Online' && styles.radioActive]}
                                    onPress={() => setPaymentMethod('Online')}
                                >
                                    <Text style={[styles.radioTitle, paymentMethod === 'Online' && styles.radioTextActive]}>ONLINE PAY</Text>
                                    <Text style={styles.radioSub}>UPI, Card, Wallet</Text>
                                    {paymentMethod === 'Online' && <View style={styles.radioDot} />}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.radioBox, paymentMethod === 'COD' && styles.radioActive]}
                                    onPress={() => setPaymentMethod('COD')}
                                >
                                    <Text style={[styles.radioTitle, paymentMethod === 'COD' && styles.radioTextActive]}>CASH ON DEL.</Text>
                                    <Text style={styles.radioSub}>Pay at door</Text>
                                    {paymentMethod === 'COD' && <View style={styles.radioDot} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={styles.payBtn}
                        onPress={handlePlaceOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Feather name="shopping-bag" size={20} color="#fff" />
                                <Text style={styles.payBtnText}>CONFIRM ORDER & PAY</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 15, fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 2 },

    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', backgroundColor: '#fff' },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    backText: { fontSize: 12, fontWeight: '900', color: '#111827' },
    secureBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, opacity: 0.6 },
    secureText: { fontSize: 9, fontWeight: '900' },

    summaryCard: { margin: 20, padding: 25, backgroundColor: '#fff', borderRadius: 35, elevation: 2 },
    sectionTag: { fontSize: 10, fontWeight: '900', color: '#F54D27', letterSpacing: 2, marginBottom: 20 },
    productRow: { flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 20 },
    prodImg: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#f3f4f6' },
    prodName: { fontSize: 18, fontWeight: '900', color: '#111827', fontStyle: 'italic', textTransform: 'uppercase' },
    prodPrice: { fontSize: 16, fontWeight: 'bold', color: '#6b7280', marginTop: 5 },

    divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 15, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    priceLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
    priceVal: { fontSize: 13, color: '#111827', fontWeight: 'bold' },
    totalLabel: { fontSize: 20, fontWeight: '900', color: '#111827' },
    totalVal: { fontSize: 22, fontWeight: '900', color: '#F54D27' },

    formSection: { paddingHorizontal: 20 },
    inputGroup: { marginBottom: 30 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F54D27', justifyContent: 'center', alignItems: 'center' },
    inputLabel: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#111827' },

    textArea: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        fontSize: 14,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        minHeight: 100,
        textAlignVertical: 'top'
    },

    radioGrid: { flexDirection: 'row', gap: 12 },
    radioBox: {
        flex: 1,
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f3f4f6',
        position: 'relative'
    },
    radioActive: { borderColor: '#F54D27', backgroundColor: '#fff' },
    radioTitle: { fontSize: 12, fontWeight: '900', color: '#9ca3af' },
    radioTextActive: { color: '#111827' },
    radioSub: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
    radioDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F54D27' },

    bottomBar: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    payBtn: {
        backgroundColor: '#F54D27',
        height: 65,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: "#F54D27",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8
    },
    payBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});