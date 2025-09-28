// App.js
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { store } from "./store";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Tabs (use suas telas reais)
import TaskHomeScreen from "./screens/TaskHomeScreen";   // Marketplace (Home)
import TaskListScreen from "./screens/TaskListScreen";   // Mensagem (placeholder)
import TaskFormScreen from "./screens/TaskFormScreen";   // Vender (form)
import TaskDetailScreen from "./screens/TaskDetailScreen"; // Perfil (placeholder)

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** Abas do app quando o usuário ESTÁ logado */
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
      <Tab.Screen name="Marketplace" component={TaskHomeScreen} />
      <Tab.Screen name="Vender" component={TaskFormScreen} />
      <Tab.Screen name="Mensagem" component={TaskListScreen} />
      <Tab.Screen name="Perfil" component={TaskDetailScreen} />
    </Tab.Navigator>
  );
}

/** Root decide entre AuthStack (não logado) e AppTabs (logado) */
function RootNavigator() {
  // ajuste o selector se seu reducer estiver em outra chave
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
