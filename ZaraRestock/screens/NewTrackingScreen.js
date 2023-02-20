import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    axios
      .post("http://192.168.0.128:3000/api/login", {
        mail,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          const { id, username } = res.data;
          AsyncStorage.setItem("userid", id.toString());
          AsyncStorage.setItem("username", username.toString());
          navigation.navigate("LoggedInMainMenu");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Invalid credentials. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Mail"
        placeholderTextColor="#d3d3d3"
        value={mail}
        onChangeText={(value) => setMail(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#d3d3d3"
        secureTextEntry={true}
        value={password}
        onChangeText={(value) => setPassword(value)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
  input: {
    width: "80%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    color: "#ffffff",
    placeHolderTextColor: "#bbb",
  },
  button: {
    backgroundColor: "#c23616",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
