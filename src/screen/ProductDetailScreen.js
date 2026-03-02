import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { fetchProducts } from '../redux/productdata';
import { useGetProductsQuery } from '../redux/productslice';
import api from '../componet/axios';


const { width } = Dimensions.get('window');


export default function ProductDetailScreen({ route }) {
    const navigation = useNavigation();

    const { slug } = route.params; // Home se slug pass karna

    // let slug = 'fasdfa'

    console.log('params', slug)
    const dispatch = useDispatch();

    const [userId, setUserId] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [adding, setAdding] = useState(false);
    const [product, setProduct] = useState(null);

    // const { products, loading } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const { data: products, isLoading, isError, refetch } = useGetProductsQuery();


    console.log('product data', products.data)

    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("id");
            if (id) setUserId(id);
        };
        getUserId();
    }, []);

    useEffect(() => {
        if (products.data.length > 0) {

            console.log('filter ')
            const found = products.data.find((p) => p.slug === slug);
            if (found) setProduct(found);
            else dispatch(fetchProducts());
        } else {
            dispatch(fetchProducts());
        }
    }, [products, slug]);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            Alert.alert("Login Required", "Please login first to add items to cart.");
            return;
        }
        setAdding(true);
        try {
            // Apni API ka IP sahi se dalna localhost nahi chalta mobile pe
            const res = await api.post("/api/cart/add", {
                userId,
                productId: product._id
            });

            console.log('add to cart', res)
            Alert.alert("Success", "Added to cart!");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Something went wrong");
        } finally {
            setAdding(false);
        }
    };

    const handleBuyNow = () => {
        localStorage.setItem("buyNowProduct", JSON.stringify(product));
        router.push("/checkout");
    };

    if (isLoading || !product) {
        return (
            <View style={styles.center}>
                <Text>hiiii{JSON.stringify(product)}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTag}>PRODUCT DETAILS</Text>
                <TouchableOpacity onPress={() => navigation.navigate('cart')}>
                    <Feather name="shopping-bag" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageSection}>
                    <Image
                        source={{ uri: `http://192.168.31.144:3000${product.images?.[activeImage]}` }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />

                    {/* Rating Badge */}
                    <View style={styles.ratingBadge}>
                        <Feather name="star" size={12} color="#F54D27" style={{ marginRight: 4 }} />
                        <Text style={styles.ratingText}>4.9 (120 REVIEWS)</Text>
                    </View>

                    {/* Thumbnails Overlay */}
                    <View style={styles.thumbContainer}>
                        {product.images?.map((img, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setActiveImage(idx)}
                                style={[
                                    styles.thumbItem,
                                    activeImage === idx && styles.activeThumb
                                ]}
                            >
                                <Image source={{ uri: `http://192.168.31.144:3000/${img}` }} style={styles.thumbImg} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.category}>{product.category?.toUpperCase()}</Text>
                    <Text style={styles.name}>{product.name}<Text style={{ color: '#F54D27' }}>.</Text></Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        {product.discountPrice && (
                            <Text style={styles.oldPrice}>₹{product.discountPrice}</Text>
                        )}
                        <View style={styles.stockBadge}>
                            <Text style={styles.stockText}>IN STOCK</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        {product.description || "A masterclass in modern design and premium materials. Engineered for those who value both style and functionality."}
                    </Text>

                    {/* Trust Badges */}
                    <View style={styles.trustRow}>
                        <TrustItem icon="truck" label="FAST DELIVERY" />
                        <TrustItem icon="shield" label="ORIGINAL" />
                        <TrustItem icon="zap" label="FLASH SALE" />
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.cartBtn, adding && { backgroundColor: '#e5e7eb' }]}
                    onPress={handleAddToCart}
                    disabled={adding}
                >
                    {adding ? <ActivityIndicator size="small" color="#9ca3af" /> : (
                        <>
                            <Feather name="shopping-bag" size={18} color="#fff" />
                            <Text style={styles.cartBtnText}>ADD TO CART</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => {
                        AsyncStorage.setItem("buyNowProduct", JSON.stringify(product));
                        navigation.navigate('Checkout');
                    }}
                >
                    <Text style={styles.buyBtnText}>BUY NOW</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const TrustItem = ({ icon, label }) => (
    <View style={styles.trustItem}>
        <View style={styles.trustIconBox}>
            <Feather name={icon} size={16} color="#9ca3af" />
        </View>
        <Text style={styles.trustText}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTag: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 2 },

    imageSection: { position: 'relative', width: width, height: width * 1.2 },
    mainImage: { width: '100%', height: '100%' },
    ratingBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: { fontSize: 10, fontWeight: '900', color: '#111827' },

    thumbContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
    },
    thumbItem: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        marginRight: 10,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    activeThumb: { borderColor: '#F54D27' },
    thumbImg: { width: '100%', height: '100%' },

    infoContainer: { padding: 25 },
    category: { color: '#F54D27', fontWeight: '900', fontSize: 12, letterSpacing: 3, marginBottom: 8 },
    name: { fontSize: 32, fontWeight: '900', color: '#111827', textTransform: 'lowercase', marginBottom: 15 },

    priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
    price: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#111827' },
    oldPrice: { fontSize: 18, color: '#d1d5db', textDecorationLine: 'line-through', marginLeft: 10, fontWeight: '700' },
    stockBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 15, marginBottom: 5 },
    stockText: { color: '#16a34a', fontSize: 10, fontWeight: '900' },

    description: { fontSize: 15, color: '#6b7280', lineHeight: 24, fontWeight: '500' },

    trustRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#f3f4f6'
    },
    trustItem: { alignItems: 'center', flex: 1 },
    trustIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    trustText: { fontSize: 8, fontWeight: '900', color: '#9ca3af' },

    bottomBar: {
        padding: 20,
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderColor: '#f3f4f6',
        backgroundColor: '#fff'
    },
    cartBtn: {
        flex: 1.5,
        backgroundColor: '#111827',
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    cartBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
    buyBtn: {
        flex: 1,
        backgroundColor: '#F54D27',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 }
});