import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/ProfileScreen';
import Home from '../screens/home';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator initialRouteName="profile">
            <Stack.Screen name="profile" component={ProfileScreen} />
            <Stack.Screen name="Details" component={Home} />
        </Stack.Navigator>
    );
}
