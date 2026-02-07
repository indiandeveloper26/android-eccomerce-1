import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../redux/contextapi";

export default function CheckoutScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { user } = useSelector((state) => state.auth || {});
    const reduxUserId = user?.userdata?._id;

    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Online");
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const prepareCheckout = async () => {
            const id = await AsyncStorage.getItem("id");
            setUserId(id || reduxUserId);

            const data = await AsyncStorage.getItem("buyNowProduct");
            if (!data) {
                Alert.alert("Error", "No product selected");
                navigation.navigate("Home");
                return;
            }
            setProduct(JSON.parse(data));
            setLoading(false);
        };
        prepareCheckout();
    }, []);

    const handlePlaceOrder = async () => {
        if (!userId) { Alert.alert("Login Required", "Please login first"); return; }
        if (!address.trim()) { Alert.alert("Address Required", "Please enter shipping address"); return; }

        try {
            const res = await fetch("https://eccomerce-wine.vercel.app/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    product,
                    quantity: 1,
                    totalPrice: product.price,
                    address,
                    paymentMethod,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Order failed");

            if (paymentMethod === "Online") {
                navigation.navigate("paymnet", { orderId: data.order._id, reduxUserId });
            } else {
                Alert.alert("🎉 Success", "Order placed via COD!", [{ text: "View Orders", onPress: () => navigation.navigate("Orders") }]);
            }
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: isDark ? "#111" : "#fff" }]}>
            <ActivityIndicator size="large" color="#F54D27" />
        </View>
    );

    const textColor = isDark ? "#F3F4F6" : "#1F2937";
    const cardBg = isDark ? "#1F2937" : "#FFFFFF";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#F3F4F6" }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                    <Text style={[styles.mainTitle, { color: textColor }]}>Confirm Order</Text>

                    {/* Product Summary Tile */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <View style={styles.productRow}>
                            <Image
                                source={{ uri: product?.images?.[0] ? `https://eccomerce-wine.vercel.app${product.images[0]}` : "https://via.placeholder.com/150" }}
                                style={styles.thumb}
                            />
                            <View style={styles.prodInfo}>
                                <Text style={[styles.prodName, { color: textColor }]} numberOfLines={1}>{product.name}</Text>
                                <Text style={styles.prodPrice}>₹{product.price}</Text>
                                <Text style={styles.qty}>Qty: 1</Text>
                            </View>
                        </View>
                    </View>

                    {/* Address Input */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <Text style={[styles.label, { color: textColor }]}>Delivery Address</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Street, Landmark, City, Pincode"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            style={[styles.input, { backgroundColor: isDark ? "#374151" : "#F9FAFB", color: textColor }]}
                        />
                    </View>

                    {/* Payment Selector */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <Text style={[styles.label, { color: textColor }]}>Payment Method</Text>

                        <TouchableOpacity
                            style={[styles.methodOption, paymentMethod === "Online" && styles.selectedOption]}
                            onPress={() => setPaymentMethod("Online")}
                        >
                            <Text style={[styles.optionText, paymentMethod === "Online" && styles.selectedText]}>💳 Online Payment</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodOption, paymentMethod === "COD" && styles.selectedOption]}
                            onPress={() => setPaymentMethod("COD")}
                        >
                            <Text style={[styles.optionText, paymentMethod === "COD" && styles.selectedText]}>💵 Cash on Delivery</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Order Total Card */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <View style={styles.priceRow}>
                            <Text style={{ color: "#6B7280" }}>Subtotal</Text>
                            <Text style={{ color: textColor }}>₹{product.price}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={{ color: "#6B7280" }}>Delivery</Text>
                            <Text style={{ color: "#10B981", fontWeight: 'bold' }}>FREE</Text>
                        </View>
                        <View style={[styles.priceRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }]}>
                            <Text style={[styles.totalLabel, { color: textColor }]}>Order Total</Text>
                            <Text style={styles.totalValue}>₹{product.price}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
                        <Text style={styles.orderBtnText}>
                            {paymentMethod === "Online" ? "Proceed to Payment" : "Confirm Order"}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    mainTitle: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
    card: { borderRadius: 20, padding: 16, marginBottom: 15, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
    productRow: { flexDirection: 'row', alignItems: 'center' },
    thumb: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#f0f0f0' },
    prodInfo: { marginLeft: 15, flex: 1 },
    prodName: { fontSize: 16, fontWeight: '700' },
    prodPrice: { fontSize: 16, color: '#F54D27', fontWeight: 'bold', marginTop: 2 },
    qty: { fontSize: 12, color: '#6B7280' },
    label: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
    input: { borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: "top", borderWidth: 1, borderColor: '#E5E7EB' },
    methodOption: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, backgroundColor: '#fff' },
    selectedOption: { borderColor: '#F54D27', backgroundColor: '#FFF5F2' },
    optionText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    selectedText: { color: '#F54D27' },
    priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    totalLabel: { fontSize: 18, fontWeight: "800" },
    totalValue: { fontSize: 20, fontWeight: "900", color: "#F54D27" },
    orderBtn: { backgroundColor: "#F54D27", paddingVertical: 18, borderRadius: 15, alignItems: "center", marginTop: 10, elevation: 5 },
    orderBtnText: { color: "#fff", fontWeight: "bold", fontSize: 17 }
});