import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductsScreen from "../screens/productscrren";
import Home from '../screens/home';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from "../screens/cart";
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/login';
import CheckoutScreen from "../screens/cheackout"
import PaymentScreen from "../screens/paymnet"









const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Homee"
            screenOptions={({ navigation, route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#F54D27',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                },
                headerLeft: ({ tintColor, canGoBack }) =>
                    canGoBack ? (
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-back" size={24} color={tintColor} />
                        </TouchableOpacity>
                    ) : null,
                headerRight: ({ tintColor }) => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={() => navigation.navigate("Cart")}
                    >
                        <Icon name="cart" size={24} color={tintColor} />
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen
                name="Homee"
                component={ProductsScreen}
                options={{ title: "Products" }}
            />
            <Stack.Screen
                name="Productsdetails"
                component={ProductDetailsScreen}
                options={{ title: "Product Details" }}
            />
            <Stack.Screen
                name="Details"
                component={Home}
                options={{ title: "Home" }}
            />
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: "Cart" }}
            />
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ title: "Cart" }}
            />
            <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ title: "Checkout" }}
            />
            <Stack.Screen
                name="paymnet"
                component={PaymentScreen}
                options={{ title: "paymnet" }}
            />
        </Stack.Navigator>
    );
}



