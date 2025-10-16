// App.js (feat/peter atualizado)
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

// Extras (fora do tab) — vieram da main
import CreateVehicleScreen from "./screens/CreateVehicleScreen";
import MyClassifieds from "./screens/MyClassifieds";
import CreateItemScreen from "./screens/CreateItemScreen";
import ItemDetailScreen from "./screens/ItemDetailScreen";
import EditItemScreen from "./screens/EditItemScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import AddressesScreen from "./screens/AddressesScreen";


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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          {/* Tabs como raiz quando logado */}
          <Stack.Screen name="AppTabs" component={AppTabs} />

          {/* Telas extras sem tab bar (mesmo padrão da main) */}
          <Stack.Screen
            name="CreateItemScreen"
            component={CreateItemScreen}
            options={{ headerShown: true, title: "Novo Item" }}
          />
          <Stack.Screen
            name="CreateVehicleScreen"
            component={CreateVehicleScreen}
            options={{ headerShown: true, title: "Novo Veículo" }}
          />
          <Stack.Screen
            name="MyClassifieds"
            component={MyClassifieds}
            options={{ headerShown: true, title: "Meus Classificados" }}
          />
          <Stack.Screen
            name="ItemDetailScreen"
            component={ItemDetailScreen}
            options={{ headerShown: true, title: "Detalhes" }}
          />
          <Stack.Screen
            name="EditItemScreen"
            component={EditItemScreen}
            options={{ headerShown: true, title: "Editar" }}
          />
          <Stack.Screen
            name="FavoriteScreen"
            component={FavoriteScreen}
            options={{ headerShown: true, title: "Favoritos" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: true, title: "Editar perfil" }}
          />
          <Stack.Screen
            name="Addresses"
            component={AddressesScreen}
            options={{ headerShown: true, title: "Endereços" }}
          />
          
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
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
