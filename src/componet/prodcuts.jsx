import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList,
    Image, TouchableOpacity, ActivityIndicator, Dimensions,
    StatusBar, SafeAreaView, RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGetProductsQuery } from '../redux/productslice';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Productslide from './slider';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;



export default function ProductsScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const { data: apiResponse, isLoading, isError, refetch } = useGetProductsQuery();

    const { user, isLoggedIn } = useSelector((state) => state.auth);

    console.log('datapp', isLoggedIn)
    let navigaton = useNavigation()

    const products = useMemo(() => {
        if (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) {
            return apiResponse.data;
        }
        return [];
    }, [apiResponse]);

    const filteredData = useMemo(() => {
        if (!products.length) return [];
        return products.filter(p => {
            const productName = p.name ? String(p.name).toLowerCase() : "";
            const productCategory = p.category ? String(p.category).toLowerCase() : "";
            const searchLower = search.toLowerCase();
            return productName.includes(searchLower) || productCategory.includes(searchLower);
        });
    }, [search, products]);

    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.heroText}>Curated{"\n"}<Text style={styles.highlight}>Collections.</Text></Text>

            <View style={styles.searchBar}>
                <Icon name="search-outline" size={20} color="#888" />
                <TextInput
                    placeholder="Search premium items..."
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={search}
                    onChangeText={setSearch}
                />

            </View>


            <Productslide />
        </View>
    );




    const ProductCard = ({ item }) => {
        const ratingValue = useMemo(() => {
            if (typeof item.ratings === 'object' && item.ratings !== null) {
                return item.ratings.average || '4.0';
            }
            return item.ratings || '4.0';
        }, [item.ratings]);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigaton.navigate("productd", { slug: item?.slug })}


            // onPress={() => console.log('data', item.
            //     slug
            // )}

            >
                <View style={styles.imageBox}>
                    <Image
                        source={{ uri: `https://eccomerce-wine.vercel.app/${item.images}` || 'https://via.placeholder.com/150' }}
                        style={styles.img}
                        resizeMode="cover"
                    />

                    <Text>
                        {item?.images || item.images[0]}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.category}>{item.category || "PREMIUM"}</Text>
                    <Text style={styles.name} numberOfLines={1}>{item.name || "Product"}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{item.price || '0'}</Text>
                        <View style={styles.rating}>
                            <Icon name="star" size={12} color="#FF5722" />
                            <Text style={styles.ratingText}>{String(ratingValue)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading && products.length === 0) {
        return <View style={[styles.container, styles.centered]}><ActivityIndicator size="large" color="#FF5722" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <FlatList
                data={filteredData}
                numColumns={2}
                keyExtractor={(item, index) => (item._id ? String(item._id) : String(index))}
                ListHeaderComponent={Header}
                renderItem={({ item }) => <ProductCard item={item} />}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#FF5722" />}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Text style={{ color: '#999' }}>No products available.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' }, // Pura background white
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20 },
    heroText: { color: '#1a1a1a', fontSize: 32, fontWeight: '800' }, // Dark text for white BG
    highlight: { color: '#FF5722' }, // Orange highlight
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', // Light grey search bar
        height: 50, borderRadius: 15, paddingHorizontal: 15, marginTop: 20,
        borderWidth: 1, borderColor: '#E0E0E0'
    },
    input: { flex: 1, color: '#000', marginLeft: 10 },
    row: { justifyContent: 'space-between', paddingHorizontal: 15 },
    card: {
        width: CARD_WIDTH,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 5,
        // Subtle shadow for white cards
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    imageBox: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F9F9F9' },
    img: { width: '100%', height: '100%' },
    info: { padding: 8 },
    category: { color: '#FF5722', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    name: { color: '#333', fontSize: 14, fontWeight: '600', marginTop: 2 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    price: { color: '#1a1a1a', fontSize: 16, fontWeight: '700' },
    rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    ratingText: { color: '#FF5722', fontSize: 11, fontWeight: '700', marginLeft: 3 }
});