// App.js
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { store } from "./store";

// Auth
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Tabs (da main)
import MarketPlaceScreen from "./screens/MarketPlaceScreen";
import SellScreen from "./screens/SellScreen";
import MessageScreen from "./screens/MessageScreen";
import AccountScreen from "./screens/AccountScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2F87E1",
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Marketplace: "shopping-outline",
            Vender: "tag-outline",
            Mensagem: "message-outline",
            Perfil: "account-circle-outline",
          };
          return (
            <MaterialCommunityIcons name={icons[route.name]} color={color} size={size} />
          );
        },
      })}
    >
      <Tab.Screen name="Marketplace" component={MarketPlaceScreen} />
      <Tab.Screen name="Vender" component={SellScreen} />
      <Tab.Screen name="Mensagem" component={MessageScreen} />
      <Tab.Screen name="Perfil" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const token = useSelector((state) => state.auth?.token);

  return (
    <Stack.Navigator>
      {token ? (
        <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Criar conta" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

export const styles = StyleSheet.create({
  taskItemButtons: { flexDirection: "row", gap: 10 },
});
