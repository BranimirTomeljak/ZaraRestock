import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");

const LoggedInMainMenuScreen = ({ navigation }) => {
  const handleLogout = async () => {
    // Clear local storage
    try {
      await AsyncStorage.removeValue("userid");
    } catch (error) {
      console.error(error);
    }

    const res = await axios.get("http://192.168.18.128:3000/api/logout", {});

    // Navigate back to the login screen
    navigation.navigate("LoggedOutMainMenu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NewTracking")}
        >
          <Text style={styles.buttonText}>New Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyTrackings")}
        >
          <Text style={styles.buttonText}>My Trackings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222222",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#c23616",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: "30%",
    height: 40,
    backgroundColor: "#c26d16",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});


export default LoggedInMainMenuScreen;
