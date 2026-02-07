import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
    SafeAreaView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../redux/contextapi";
import { fetchProducts } from "../redux/productslice";
import { setUserFromStorage } from "../redux/slice";
import Toast from "../components/toast";

const { width } = Dimensions.get("window");

const ProductDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { colors, showToast } = useTheme();
    const { slug } = route.params;

    const scrollX = useRef(new Animated.Value(0)).current;
    const [product, setProduct] = useState(null);
    const [adding, setAdding] = useState(false);

    const { products = [], loading = false, error = null } = useSelector((state) => state.products || {});
    const { user } = useSelector((state) => state.auth || {});

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) dispatch(setUserFromStorage(JSON.parse(userData)));
            } catch (err) { console.log("Error loading user:", err); }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (!products.length) dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (products.length && slug) {
            const found = products.find((p) => p.slug === slug);
            setProduct(found || null);
        }
    }, [products, slug]);

    const handleAddToCart = async () => {
        if (!user?.userdata?._id) {
            showToast("please login first");
            navigation.navigate("login");
            return;
        }
        setAdding(true);
        try {
            const res = await fetch("https://eccomerce-wine.vercel.app/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.userdata._id,
                    productId: product._id,
                }),
            });
            if (!res.ok) throw new Error("Failed to add to cart");
            showToast("Added to cart successfully! 🛒");
        } catch (err) {
            alert(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleBuyNow = async () => {
        await AsyncStorage.setItem("buyNowProduct", JSON.stringify(product));
        navigation.navigate("Checkout");
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#F54D27" />
        </View>
    );

    if (!product) return (
        <View style={styles.center}><Text>Product not found</Text></View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Text>🤍</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Slider */}
                <View style={styles.imageContainer}>
                    <Animated.ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        {product.images?.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: `https://eccomerce-wine.vercel.app/${img}` }}
                                style={styles.mainImage}
                                resizeMode="cover"
                            />
                        ))}
                    </Animated.ScrollView>

                    {/* Pagination Dots */}
                    <View style={styles.dotRow}>
                        {product.images?.map((_, i) => {
                            const dotWidth = scrollX.interpolate({
                                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                                outputRange: [8, 20, 8],
                                extrapolate: 'clamp'
                            });
                            return <Animated.View key={i} style={[styles.dot, { width: dotWidth }]} />;
                        })}
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <View style={styles.badgeRow}>
                        <Text style={styles.categoryBadge}>{product.category}</Text>
                        <Text style={styles.stockStatus}>In Stock</Text>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.mainPrice}>₹{product.price}</Text>
                        {product.discountPrice && (
                            <View style={styles.discountRow}>
                                <Text style={styles.oldPrice}>₹{product.discountPrice}</Text>
                                <Text style={styles.offPercentage}>
                                    {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{product.description}</Text>
                </View>
            </ScrollView>

            {/* Sticky Bottom Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.cartIconButton, adding && { opacity: 0.6 }]}
                    onPress={handleAddToCart}
                    disabled={adding}
                >
                    <Text style={styles.cartIconText}>{adding ? "..." : "Add to Cart"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: '#fff'
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: { fontSize: 16, fontWeight: '600', color: '#111', flex: 1, textAlign: 'center', marginHorizontal: 10 },

    // Image Slider
    imageContainer: { backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
    mainImage: { width: width, height: 350 },
    dotRow: { flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 20, width: '100%' },
    dot: { height: 8, borderRadius: 4, backgroundColor: '#F54D27', marginHorizontal: 4 },

    // Content
    contentSection: { padding: 20 },
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    categoryBadge: { backgroundColor: '#F54D2715', color: '#F54D27', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    stockStatus: { color: '#10B981', fontWeight: '600', fontSize: 12 },
    productName: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 10 },

    priceContainer: { marginBottom: 15 },
    mainPrice: { fontSize: 28, fontWeight: '900', color: '#111' },
    discountRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    oldPrice: { fontSize: 16, color: '#9CA3AF', textDecorationLine: 'line-through' },
    offPercentage: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },

    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
    descriptionText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },

    // Footer Actions
    footer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12
    },
    cartIconButton: {
        flex: 1,
        height: 54,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartIconText: { color: '#111827', fontSize: 16, fontWeight: '700' },
    buyNowButton: {
        flex: 1.5,
        height: 54,
        borderRadius: 15,
        backgroundColor: '#F54D27',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#F54D27',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buyNowText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});



export default ProductDetailsScreen