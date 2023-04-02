import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import Login from "./screens/Login";
import Homepage from "./screens/Homepage";
import QRcode from "./screens/QRcode";
import Success from "./screens/Success";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import QRgenerate from "./screens/QRgenerate";
import History from "./screens/History";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Homepage" component={Homepage} />

        <Stack.Screen name="QRcode" component={QRcode} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
        <Stack.Screen name="QRgenerator" component={QRgenerate} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
