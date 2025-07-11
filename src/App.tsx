import { View, Text } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpoRoot } from 'expo-router';

NativeWindStyleSheet.setOutput({
  default: 'native',
  web: 'styleTag',
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ExpoRoot />
    </NavigationContainer>
  );
}
