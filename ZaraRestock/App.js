import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoggedOutMainMenuScreen from "./screens/LoggedOutMainMenuScreen";
import LoggedInMainMenuScreen from "./screens/LoggedInMainMenuScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoggedOutMainMenu">
        <Stack.Screen name="LoggedOutMainMenu" component={LoggedOutMainMenuScreen} />
        <Stack.Screen name="LoggedInMainMenu" component={LoggedInMainMenuScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;