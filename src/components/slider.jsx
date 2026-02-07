import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING = (width - CARD_WIDTH) / 2;

const ProductSlider = () => {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchSliderProducts = async () => {
            try {
                const res = await fetch("https://eccomerce-wine.vercel.app/api/productdata");
                const data = await res.json();
                setProducts(data.data?.slice(0, 5) || []);
            } catch (error) {
                console.log("Fetch error:", error);
            }
        };
        fetchSliderProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const interval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % products.length;
                setCurrentIndex(nextIndex);
                scrollRef.current?.scrollTo({
                    x: nextIndex * CARD_WIDTH,
                    animated: true,
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, products]);

    const onScroll = (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / CARD_WIDTH);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    // FIXED: Return null yahan nahi, balki render ke andar conditional loading dikhayenge
    // Taaki Hooks ka order hamesha stable rahe.

    return (
        <View style={styles.container}>
            {products.length === 0 ? (
                <View style={[styles.card, { width: CARD_WIDTH, alignSelf: 'center', justifyContent: 'center' }]}>
                    <Text style={{ textAlign: 'center' }}>Loading Deals...</Text>
                </View>
            ) : (
                <>
                    <Animated.ScrollView
                        horizontal
                        ref={scrollRef}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: SPACING }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false, listener: onScroll }
                        )}
                        scrollEventThrottle={16}
                    >
                        {products.map((item, index) => {
                            const inputRange = [
                                (index - 1) * CARD_WIDTH,
                                index * CARD_WIDTH,
                                (index + 1) * CARD_WIDTH,
                            ];

                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.9, 1.05, 0.9],
                                extrapolate: "clamp",
                            });

                            return (
                                <Animated.View
                                    key={item._id || index.toString()}
                                    style={[styles.cardContainer, { width: CARD_WIDTH, transform: [{ scale }] }]}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => navigation.navigate("Productsdetails", { slug: item.slug })}
                                        style={styles.card}
                                    >
                                        <Image
                                            source={{ uri: `https://eccomerce-wine.vercel.app/${item.images?.[0]}` }}
                                            style={styles.image}
                                        />
                                        <View style={styles.overlay}>
                                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                                            <Text style={styles.price}>₹{item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </Animated.ScrollView>

                    <View style={styles.dotContainer}>
                        {products.map((_, i) => {
                            const dotWidth = scrollX.interpolate({
                                inputRange: [(i - 1) * CARD_WIDTH, i * CARD_WIDTH, (i + 1) * CARD_WIDTH],
                                outputRange: [8, 20, 8],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange: [(i - 1) * CARD_WIDTH, i * CARD_WIDTH, (i + 1) * CARD_WIDTH],
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });
                            return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />;
                        })}
                    </View>
                </>
            )}
        </View>
    );
};

export default ProductSlider;

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    cardContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
    card: {
        width: '94%',
        height: 180,
        backgroundColor: "#eee",
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 8,
    },
    image: { width: "100%", height: "100%", position: 'absolute' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 20,
        justifyContent: 'flex-end',
    },
    name: { fontWeight: "bold", fontSize: 20, color: '#fff' },
    price: { fontWeight: "bold", color: '#F54D27', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 5, marginTop: 5 },
    dotContainer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
    dot: { height: 8, borderRadius: 4, backgroundColor: "#F54D27", marginHorizontal: 4 },
});