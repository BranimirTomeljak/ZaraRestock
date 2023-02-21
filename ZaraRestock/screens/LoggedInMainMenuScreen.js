import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");

const LoggedInMainMenuScreen = ({ navigation }) => {
  const handleLogout = async () => {
    // Clear local storage
    try {
      await AsyncStorage.removeValue('userid');
      await AsyncStorage.removeValue('username');
    } catch (error) {
      console.error(error);
    }
    
    const res = await axios.get("http://192.168.0.128:3000/api/logout", {});

    // Navigate back to the login screen
    navigation.navigate("LoggedOutMainMenu");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="New Tracking"
          //onPress={() => navigation.navigate("NewTracking")}
          style={styles.button}
        />
        <Button
          title="Old Trackings"
          onPress={() => navigation.navigate("OldTrackings")}
          style={styles.button}
        />
      </View>
      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  button: {
    width: "100%",
    borderRadius: 5,
    color: "#ffffff",
    backgroundColor: "#c23616",
    padding: 16,
    marginBottom: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 5,
    color: "#ffffff",
    backgroundColor: "#c23616",
    padding: 8,
  },
});


export default LoggedInMainMenuScreen;
