import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screen/login"
import OrdersScreen from "../screen/order"
import SignupScreen from "../screen/singup";
import CheckoutScreen from "../screen/CheckoutScreen"
import CartScreen from "../screen/cart";
import ProductDetailScreen from "../screen/ProductDetailScreen"
import PaymentScreen from "../screen/payment"



const Stack = createNativeStackNavigator();

export default function StackNavigator() {




    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="singup" component={SignupScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="cart" component={CartScreen} />
            <Stack.Screen name="productd" component={ProductDetailScreen} />
            <Stack.Screen name="orders" component={OrdersScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="payment" component={PaymentScreen} />
        </Stack.Navigator>
    );
}