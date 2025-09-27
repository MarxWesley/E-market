import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TaskContextProvider } from "./contexts/TaskContext";
import TaskList from "./components/TaskList";
import TaskRegister from "./components/TaskRegister";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskListScreen from './screens/TaskListScreen';
import TaskFormScreen from './screens/TaskFormScreen';
import TaskHomeScreen from "./screens/TaskHomeScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";

import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { store } from './store/index';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <ReduxProvider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TaskHome">
            <Stack.Screen name="TaskHome" component={TaskHomeScreen}></Stack.Screen>
            <Stack.Screen name="TaskList" component={TaskListScreen}></Stack.Screen>
            <Stack.Screen name="TaskForm" component={TaskFormScreen}></Stack.Screen>
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    </ReduxProvider>
  );
}


export const styles = StyleSheet.create({

  taskItemButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
