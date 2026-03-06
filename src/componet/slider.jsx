import React, { useMemo } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { useGetProductsQuery } from "../redux/productslice";

const { width } = Dimensions.get("window");

export default function ProductSlider() {

    const { data: apiResponse, isLoading } = useGetProductsQuery();

    const products = useMemo(() => {
        if (apiResponse?.success && Array.isArray(apiResponse.data)) {
            return apiResponse.data.slice(0, 5);
        }
        return [];
    }, [apiResponse]);

    if (isLoading) return null;

    return (

        <View style={styles.container}>

            <Swiper
                autoplay
                autoplayTimeout={3}
                showsPagination
                dotColor="#ccc"
                activeDotColor="#FF5722"
            >

                {products.map((item, index) => (
                    <View key={index} style={styles.slide}>

                        <Image
                            source={{
                                uri: `https://eccomerce-wine.vercel.app/${item.images}`
                            }}
                            style={styles.image}
                        />

                    </View>
                ))}

            </Swiper>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        height: 200,
        marginTop: 10
    },

    slide: {
        flex: 1,
        paddingHorizontal: 15
    },

    image: {
        width: "100%",
        height: "100%",
        borderRadius: 14
    }

});