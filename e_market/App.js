import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { store } from "./store";

// Auth
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Tabs (da main)
import MarketPlaceScreen from "./screens/MarketPlaceScreen";
import SellScreen from "./screens/SellScreen";
import MessageScreen from "./screens/MessageScreen";
import AccountScreen from "./screens/AccountScreen";

// ✅ FALTAVA ISSO
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#319BE5",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: { height: 58, borderTopWidth: 1, borderTopColor: "#eaeaea", backgroundColor: "#fff" },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarIcon: ({ color, focused }) => {
          let name;
          if (route.name === "Marketplace") name = focused ? "storefront" : "storefront-outline";
          else if (route.name === "Vender") name = focused ? "pricetag" : "pricetag-outline";
          else if (route.name === "Mensagem") name = focused ? "chatbubble" : "chatbubble-outline";
          else if (route.name === "Perfil") name = focused ? "person" : "person-outline";
          return <Ionicons name={name} size={22} color={color} />;
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
