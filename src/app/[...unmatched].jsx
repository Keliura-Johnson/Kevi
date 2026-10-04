
import { ActivityIndicator, View } from 'react-native';

export default function Unmatched() {
    return (
        <View style={{ flex: 1, backgroundColor: '#0A0415', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7F56D9" />
        </View>
    );
}