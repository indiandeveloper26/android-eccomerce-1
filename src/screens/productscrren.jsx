import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../redux/contextapi";
import ProductSlider from "../components/slider";

const { width } = Dimensions.get("window");

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const navigation = useNavigation();
    const { theme, colors } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("https://eccomerce-wine.vercel.app/api/productdata");
                const data = await res.json();
                setProducts(data.data || []);
                setFiltered(data.data || []);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!search) return setFiltered(products);
        const filteredProducts = products.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        );
        setFiltered(filteredProducts);
    }, [search, products]);

    if (loading) return (
        <View style={[styles.center, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
            <ActivityIndicator size="large" color="#F54D27" />
        </View>
    );

    const renderCard = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}
            onPress={() => navigation.navigate("Productsdetails", { slug: item.slug })}
        >
            {/* Image Section with Sale Tag */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{
                        uri: item.images?.[0]
                            ? `https://eccomerce-wine.vercel.app/${item.images[0]}`
                            : "https://via.placeholder.com/150",
                    }}
                    style={styles.image}
                />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>NEW</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.cardBody}>
                <Text style={styles.categoryLabel}>{item.category?.toUpperCase() || 'GENERAL'}</Text>
                <Text style={[styles.name, { color: isDark ? "#E0E0E0" : "#222" }]} numberOfLines={1}>
                    {item.name}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: isDark ? "#fff" : "#000" }]}>
                        ₹{item.discountPrice || item.price}
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.viewBtn}
                    onPress={() => navigation.navigate("Productsdetails", { slug: item.slug })}
                >
                    <Text style={styles.viewBtnText}>VIEW</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8F9FA" }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerArea}>
                        <Text style={[styles.mainTitle, { color: isDark ? "#fff" : "#1A1A1A" }]}>
                            Curated<Text style={{ color: "#F54D27" }}>.</Text>
                        </Text>

                        {/* Custom Search Box (No Icons needed) */}
                        <View style={[styles.searchBox, { backgroundColor: isDark ? "#1E1E1E" : "#fff" }]}>
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search items..."
                                placeholderTextColor={isDark ? "#666" : "#999"}
                                style={[styles.inputField, { color: isDark ? "#fff" : "#000" }]}
                            />
                        </View>

                        <View style={styles.sliderBox}>
                            <ProductSlider />
                        </View>

                        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#1A1A1A" }]}>
                            Our Collection ({filtered.length})
                        </Text>
                    </View>
                }
                renderItem={renderCard}
                ListEmptyComponent={
                    <Text style={[styles.noData, { color: isDark ? "#555" : "#AAA" }]}>
                        No items found
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    headerArea: { paddingHorizontal: 20, paddingTop: 30, marginBottom: 10 },
    mainTitle: { fontSize: 38, fontWeight: "900", letterSpacing: -1.5 },
    sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 20, marginBottom: 10, letterSpacing: -0.5 },
    searchBox: {
        height: 50,
        borderRadius: 15,
        paddingHorizontal: 20,
        marginTop: 20,
        justifyContent: "center",
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 2,
    },
    inputField: { fontSize: 16, fontWeight: "500" },
    sliderBox: { marginTop: 20, borderRadius: 20, overflow: "hidden" },
    row: { justifyContent: "space-between", paddingHorizontal: 20 },
    card: {
        width: (width / 2) - 28,
        marginBottom: 20,
        borderRadius: 25,
        padding: 6,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    imageWrapper: {
        width: '100%',
        height: 150,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: '#F3F4F6'
    },
    image: { width: "100%", height: "100%", resizeMode: "cover" },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#F54D27',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
    cardBody: { padding: 10 },
    categoryLabel: { fontSize: 9, fontWeight: "800", color: "#F54D27", letterSpacing: 1 },
    name: { fontSize: 15, fontWeight: "700", marginTop: 2 },
    priceRow: { marginTop: 5 },
    price: { fontSize: 16, fontWeight: "900" },
    viewBtn: {
        backgroundColor: "#F54D27",
        marginTop: 10,
        height: 35,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    viewBtnText: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
    noData: { textAlign: "center", marginTop: 40, fontSize: 16, fontWeight: "600" }
});