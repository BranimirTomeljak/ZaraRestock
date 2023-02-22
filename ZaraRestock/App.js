import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoggedOutMainMenuScreen from "./screens/LoggedOutMainMenuScreen";
import LoggedInMainMenuScreen from "./screens/LoggedInMainMenuScreen";
import NewTrackingScreen from "./screens/NewTrackingScreen";
import MyTrackingsScreen from "./screens/MyTrackingsScreen";
const AsyncStorage = require("./models/AsyncStorageModel");
const Stack = createStackNavigator();

const App = () => {
  const [userId, setUserId] = useState(null);
  const [fetchComplete, setFetchComplete] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
      const userId = await AsyncStorage.getData("userid");
      setUserId(userId);
      setFetchComplete(true);
    }
    fetchUserId();
  }, []);

  if (!fetchComplete) return null;

  const initialRouteName = userId ? "LoggedInMainMenu" : "LoggedOutMainMenu";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="LoggedOutMainMenu"
          component={LoggedOutMainMenuScreen}
          options={headerOptions}
        />
        <Stack.Screen
          name="LoggedInMainMenu"
          component={LoggedInMainMenuScreen}
          options={headerOptions}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={headerOptions}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={headerOptions}
        />
        <Stack.Screen
          name="NewTracking"
          component={NewTrackingScreen}
          options={headerOptions}
        />
        <Stack.Screen
          name="MyTrackings"
          component={MyTrackingsScreen}
          options={headerOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;

const headerOptions = {
  title: "ZaraRestock",
  headerStyle: {
    backgroundColor: "#c23616",
  },
  headerTintColor: "#d3d3d3",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
  animationEnabled: false,
};
