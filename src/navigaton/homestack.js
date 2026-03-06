import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from '../componet/prodcuts';
import CartScreen from '../screen/cart';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    let cartCount = user?.cart?.length || 0;

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                // ✅ Ye line status bar ke niche padding auto-adjust karegi
                headerStatusBarHeight: insets.top,
                headerTitleStyle: {
                    fontWeight: '900',
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={ProductsScreen}
                options={{
                    // Brand Logo
                    headerTitle: () => (
                        <Text style={styles.brandTitle}>
                            CORE<Text style={{ color: '#F54D27' }}>CART</Text>
                        </Text>
                    ),
                    // Right Side Cart Icon
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('cart')}
                            style={styles.headerBtn}
                        >
                            <Feather name="shopping-bag" size={24} color="#111827" />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="cart"
                component={CartScreen}
                options={{
                    headerTitle: "MY CART",
                    headerTitleStyle: styles.cartTitleStyle,
                    // Back arrow ko status bar se chipakne se rokne ke liye
                    headerLeftContainerStyle: { paddingLeft: 10 },
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    brandTitle: {
        fontSize: 20,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#111827',
    },
    cartTitleStyle: {
        fontSize: 18,
        fontWeight: '900',
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5, // Screen edge se thoda gap
    },
    badge: {
        position: "absolute",
        top: 2,
        right: 2,
        backgroundColor: "#F54D27",
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "900",
    }
});