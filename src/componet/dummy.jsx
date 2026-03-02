import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Dummy = () => {

    const { user, isLoggedIn } = useSelector((state) => state.auth);

    console.log('data', user)


    let data = async () => {
        let data = await AsyncStorage.getItem("user")

        console.log('userdata', JSON.parse(data))
    }

    useEffect
        (() => {
            data()
        }, [])


    let navigaton = useNavigation()
    return (
        <View>
            <Text>Dummy</Text>

            <Button title='go abck' onPress={() => navigaton.navigate("singup")} />
            <Button title='go login' onPress={() => navigaton.navigate("login")} />
        </View>
    )
}

export default Dummy