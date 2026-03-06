import React from 'react'; // React import karna zaroori hai
import { TouchableOpacity, Text } from 'react-native'; // Text yahan add kiya
import { useNotify } from '../redux/contextapi';

export default function Notifu() {
    const { showNotify } = useNotify();

    const handleAction = () => {
        showNotify("Data loaded successfully!", "success");
    };

    return (
        <TouchableOpacity
            onPress={handleAction}
            style={{ padding: 20, backgroundColor: '#eee', alignItems: 'center' }}
        >
            <Text>Click Me</Text>
        </TouchableOpacity>
    );
}