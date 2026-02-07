import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNavigator from "./Homestack";
import Icon from 'react-native-vector-icons/Ionicons';
import OrdersScreen from '../components/orders'; // Apna sahi path check kar lena
import TestScreen from "../screens/toasthandle";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false, // 👈 Isse text labels nahi dikhenge (sirf icons)
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'myorders') {
                        iconName = focused ? 'receipt' : 'receipt-outline'; // 👈 Correct icon name
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Thoda halka white inactive ke liye

                tabBarStyle: {
                    backgroundColor: '#F54D27',
                    borderTopWidth: 0,
                    height: 65,
                    paddingBottom: 5, // Icons ko center karne ke liye
                    elevation: 10,    // Android shadow
                    shadowColor: '#000', // iOS shadow
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
            })}
        >
            <Tab.Screen name="Home" component={StackNavigator} />
            <Tab.Screen name="myorders" component={OrdersScreen} />
            <Tab.Screen name="Profile" component={TestScreen} />
        </Tab.Navigator>
    );
}