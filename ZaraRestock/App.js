import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoggedOutMainMenuScreen from "./screens/LoggedOutMainMenuScreen";
import LoggedInMainMenuScreen from "./screens/LoggedInMainMenuScreen";
import NewTrackingScreen from "./screens/NewTrackingScreen";
import OldTrackingsScreen from "./screens/OldTrackingsScreen";

const Stack = createStackNavigator();

const App = () => {
  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    getUserId().then((userId) => {
      setUserId(userId);
    });
  }, []);
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
          name="OldTrackings"
          component={OldTrackingsScreen}
          options={headerOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;

const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userid');
    return userId;
  } catch (e) {
    console.error(e);
  }
};

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
  animationEnabled: false
};
