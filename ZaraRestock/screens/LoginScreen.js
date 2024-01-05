import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Root } from "popup-ui";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as Network from "expo-network";
import * as Constants from 'expo-constants';
const AsyncStorage = require("../models/AsyncStorageModel");
const Popup = require("../models/PopupModel");

const LoginScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    var ipaddress;
    const getipaddress = async () => {
      ipaddress = await Network.getIpAddressAsync();
      console.log(ipaddress); // Move the console.log statement here
    };
    getipaddress();

    console.log("asdasd");

    await axios
      .post("http://192.168.18.128:3000/api/login", {
        mail,
        password,
      })
      .then(async (res) => {
        if (res.status === 200) {
          const { id } = res.data;
          await AsyncStorage.storeData("userid", id.toString());
          navigation.navigate("LoggedInMainMenu");
        }
      })
      .catch((error) => {
        console.log(error);
        Keyboard.dismiss();
        Popup.warningPopup("Error. Please try again.");
        setPassword("");
      });
  };

  return (
    <Root>
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
    </Root>
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
