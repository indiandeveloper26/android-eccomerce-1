import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../redux/contextapi";
import axios from "axios";

export default function PaymentScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, reduxUserId } = route.params;

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const preparePage = async () => {
            const id = await AsyncStorage.getItem("id");
            setUserId(id);
            try {
                const res = await axios.get(`https://eccomerce-wine.vercel.app/api/order/${orderId}`);
                setOrder(res.data.order);
            } catch (err) {
                Alert.alert("Error", "Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };
        preparePage();
    }, [orderId]);

    const handlePayment = async () => {
        if (!orderId || !reduxUserId) {
            Alert.alert("Error", "Session expired, please try again");
            return;
        }

        try {
            const paymentRes = await axios.post("https://eccomerce-wine.vercel.app/api/pymnet/crate", {
                orderId: order._id,
                amount: order.totalPrice * 100,
            });

            const options = {
                key: "rzp_test_RqlfH5s7HXQ2nY",
                amount: paymentRes.data.amount,
                currency: "INR",
                name: "SwiftBuy Ecommerce",
                description: `Order #${order._id.slice(-6)}`,
                order_id: paymentRes.data.id,
                theme: { color: "#F54D27" },
                prefill: { email: "user@example.com", contact: "9999999999" }
            };

            RazorpayCheckout.open(options)
                .then(async (response) => {
                    await axios.post(`https://eccomerce-wine.vercel.app/api/order/${order._id}/pay`, {
                        userId,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    Alert.alert("Success", "Payment Successful 🎉");
                    navigation.replace("Orders");
                })
                .catch(() => Alert.alert("Payment Cancelled", "Don't worry, money wasn't deducted."));
        } catch (err) {
            Alert.alert("Error", "Payment initiation failed");
        }
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: isDark ? "#111" : "#fff" }]}>
            <ActivityIndicator size="large" color="#F54D27" />
            <Text style={{ marginTop: 10, color: isDark ? "#fff" : "#000" }}>Securing your transaction...</Text>
        </View>
    );

    const textColor = isDark ? "#F3F4F6" : "#1F2937";
    const cardBg = isDark ? "#1F2937" : "#FFFFFF";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#F3F4F6" }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: textColor }]}>Payment Details</Text>
                    <Text style={styles.subtitle}>Order ID: #{order._id.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Summary Card */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Bill Summary</Text>
                    {order.products.map((item, index) => (
                        <View key={index} style={styles.billRow}>
                            <Text style={styles.billLabel}>{item.product.name} (x{item.quantity})</Text>
                            <Text style={[styles.billValue, { color: textColor }]}>₹{item.price}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: textColor }]}>Amount to Pay</Text>
                        <Text style={styles.totalValue}>₹{order.totalPrice}</Text>
                    </View>
                </View>

                {/* Shipping Info Card */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Shipping to</Text>
                    <Text style={styles.addressText}>{order.address}</Text>
                </View>

                {/* Payment Action */}
                <View style={styles.actionSection}>
                    {order.paymentMethod === "Online" ? (
                        <>
                            <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
                                <Text style={styles.payBtnText}>Pay ₹{order.totalPrice} Securely</Text>
                            </TouchableOpacity>
                            <View style={styles.secureBadge}>
                                <Text style={styles.secureText}>🔒 SSL Secured & Encrypted Payment</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.codBox}>
                            <Text style={styles.codIcon}>🚚</Text>
                            <Text style={styles.codTitle}>Cash on Delivery</Text>
                            <Text style={styles.codSub}>Keep ₹{order.totalPrice} ready at the time of delivery.</Text>
                            <TouchableOpacity
                                style={[styles.payBtn, { backgroundColor: '#10B981', marginTop: 20 }]}
                                onPress={() => navigation.replace("Orders")}
                            >
                                <Text style={styles.payBtnText}>View My Orders</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { alignItems: 'center', marginBottom: 25 },
    title: { fontSize: 22, fontWeight: "900" },
    subtitle: { fontSize: 13, color: "#6B7280", marginTop: 4, letterSpacing: 1 },
    card: { borderRadius: 20, padding: 20, marginBottom: 15, elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
    billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    billLabel: { color: '#6B7280', flex: 1, marginRight: 10 },
    billValue: { fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 15, borderStyle: 'dashed', borderWidth: 0.5, borderRadius: 1 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 18, fontWeight: "800" },
    totalValue: { fontSize: 24, fontWeight: "900", color: "#F54D27" },
    addressText: { color: '#6B7280', lineHeight: 20 },
    actionSection: { marginTop: 10 },
    payBtn: { backgroundColor: "#F54D27", paddingVertical: 18, borderRadius: 16, alignItems: "center", elevation: 8, shadowColor: "#F54D27", shadowOpacity: 0.3, shadowRadius: 10 },
    payBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
    secureBadge: { alignItems: 'center', marginTop: 15 },
    secureText: { fontSize: 12, color: '#9CA3AF' },
    codBox: { alignItems: 'center', padding: 20 },
    codIcon: { fontSize: 40, marginBottom: 10 },
    codTitle: { fontSize: 20, fontWeight: '800', color: '#10B981' },
    codSub: { color: '#6B7280', textAlign: 'center', marginTop: 5 }
});