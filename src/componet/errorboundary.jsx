import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const ErrorScreen = ({ error, resetError }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.content}>
                {/* Ek animated emoji ya icon */}
                <Text style={styles.emoji}>🛠️</Text>

                <Text style={styles.title}>System Pause</Text>

                <Text style={styles.description}>
                    App mein kuch technical issue aaya hai. Humne error note kar liya hai.
                </Text>

                {/* Error Detail Box (Sirf debug ke liye useful hai) */}
                <View style={styles.errorBox}>
                    <Text style={styles.errorText} numberOfLines={3}>
                        {error?.toString()}
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={resetError}
                >
                    <Text style={styles.buttonText}>Restart Screen</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A1A',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    errorBox: {
        backgroundColor: '#F1F1 stripes', // Light grey pattern
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 15,
        marginVertical: 25,
        width: '100%',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    errorText: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#FF5252',
    },
    button: {
        backgroundColor: '#F54D27', // Aapka brand color
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 20,
        shadowColor: "#F54D27",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ErrorScreen;