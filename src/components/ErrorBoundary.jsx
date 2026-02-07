import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Aap yaha logging service call kar sakte ho (Sentry, LogRocket)
        console.log("Error caught by ErrorBoundary:", error);
        console.log(info.componentStack);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong!</Text>
                    <Text style={styles.error}>{this.state.error.toString()}</Text>
                    <Button title="Try Again" onPress={this.resetError} />
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: 'red' },
    error: { marginBottom: 20, textAlign: 'center' },
});
