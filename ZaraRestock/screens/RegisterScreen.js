import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");

const RegisterScreen = ({ navigation }) => {
  const [username, setUserame] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    await axios
      .post("http://192.168.0.128:3000/api/register", {
        username,
        mail,
        password,
      })
      .then(async (res) => {
        console.log(res.data);
        await AsyncStorage.storeData("userid", res.data.id.toString());
        await AsyncStorage.storeData("username", res.data.username.toString());
        await axios
        .get("http://192.168.0.128:3000/api/login/startup", {
          params: {
            userid: res.data.id,
          },
        })
        .then(async (res) => {
          console.log("Logged in backend.");
        })
        .catch((error) => {
          console.log(error);
        });
        navigation.navigate("LoggedInMainMenu");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#d3d3d3"
        value={username}
        onChangeText={setUserame}
      />
      <TextInput
        style={styles.input}
        placeholder="Mail"
        placeholderTextColor="#d3d3d3"
        value={mail}
        onChangeText={setMail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#d3d3d3"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#d3d3d3"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#fff",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#333",
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#c23616",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
