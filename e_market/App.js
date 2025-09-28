import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";

// Redux
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/index";

// Telas do menu inferior
import MarketplaceScreen from "./screens/MarketPlaceScreen";
import MessageScreen from "./screens/MessageScreen";
import AccountScreen from "./screens/AccountScreen";
import SellScreen from "./screens/SellScreen";

// Telas extras (fora do tab)
import ItemScreen from "./screens/ItemScreen";
import VehicleScreen from "./screens/VehicleScreen";
import MyClassifieds from "./screens/MyClassifieds";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tabs
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;

          if (route.name === "Marketplace") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Vender") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Mensagem") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: "#319BE5",
        tabBarInactiveTintColor: "#000",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Vender" component={SellScreen} />
      <Tab.Screen name="Mensagem" component={MessageScreen} />
      <Tab.Screen name="Perfil" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// App principal
export default function App() {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Tabs ficam como rota principal */}
          <Stack.Screen name="MainTabs" component={BottomTabs} />

          {/* Telas extras (sem tab bar) */}
          <Stack.Screen
            name="ItemScreen"
            component={ItemScreen}
            options={{ headerShown: true, title: "Novo Item" }}
          />
          <Stack.Screen
            name="VehicleScreen"
            component={VehicleScreen}
            options={{ headerShown: true, title: "Novo Veículo" }}
          />
          <Stack.Screen
            name="MyClassifieds"
            component={MyClassifieds}
            options={{ headerShown: true, title: "Meus Classificados" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});