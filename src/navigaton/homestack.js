import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

// Screens
import ProductsScreen from "../componet/prodcuts";
import CartScreen from "../screen/cart";
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
    const insets = useSafeAreaInsets();

    let navigation = useNavigation()

    // Custom Header Component taaki dono screen pe same dikhe
    const BrandHeader = (safeTop) => (
        <View style={{ marginTop: safeTop }}>
            <Text style={styles.brandTitle}>
                CORE<Text style={{ color: '#F54D27' }}>CART</Text>
            </Text>
        </View>
    );

    const safeTop = Platform.OS === 'android' ? insets.top + 5 : 0;

    return (
        <Stack.Navigator
            initialRouteName="Home" // Pehle Home dikhega
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#fff',
                    // Compact and clean height
                    height: Platform.OS === 'ios' ? 60 + insets.top : 70 + insets.top,
                },
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerTitle: () => BrandHeader(safeTop),
            }}
        >
            {/* HOME SCREEN */}
            <Stack.Screen
                name="Home"
                component={ProductsScreen}
                options={{

                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('cart')}
                            style={[styles.headerBtn, { marginTop: safeTop, marginRight: 10 }]}
                        >
                            <View>
                                <Feather name="shopping-bag" size={24} color="#111827" />
                                <View style={styles.badgeDot} />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />

            {/* CART SCREEN */}
            <Stack.Screen
                name="cart"
                component={CartScreen}
                options={{
                    // Cart screen pe back button dikhana hai toh yahan custom headerLeft de sakte ho
                    headerTitle: "MY CART",
                    headerTitleStyle: styles.cartTitleStyle,
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    brandTitle: {
        fontSize: 22,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#111827',
        letterSpacing: -1,
    },
    cartTitleStyle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F54D27',
        borderWidth: 2,
        borderColor: '#fff',
    }
});