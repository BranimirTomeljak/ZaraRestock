import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

const LoggedInMainMenuScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    const res = axios.get("http://localhost:3000/logout", {});

    // Navigate back to the login screen
    navigation.navigate("LoggedOutMainMenu");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="New Tracking"
          onPress={() => {}}
          style={styles.button}
        />
        <Button
          title="Old Trackings"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    width: "80%",
    marginBottom: 20,
    borderRadius: 5,
    color: "#c23616"
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 5,
    color: "#c23616"
  },
});

export default LoggedInMainMenuScreen;
