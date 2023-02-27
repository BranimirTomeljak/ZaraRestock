import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Root } from "popup-ui";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");
const Popup = require("../models/PopupModel");

const RegisterScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!mail || !password || !confirmPassword) {
      Keyboard.dismiss();
      Popup.warningPopup("Please fill in all fields.");
      return;
    }
    if (isValidEmail(mail) === false) {
      Keyboard.dismiss();
      Popup.warningPopup("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      Keyboard.dismiss();
      Popup.warningPopup("Password must be a least 6 characters long");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (password !== confirmPassword) {
      Keyboard.dismiss();
      Popup.warningPopup("Passwords do not match.");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    await axios
      .post("http://192.168.0.128:3000/api/register", {
        mail,
        password,
      })
      .then(async (res) => {
        console.log(res.data);
        Keyboard.dismiss();
        Popup.successPopupNavigation("Succcessfully registered.", navigation, "LoggedInMainMenu");
        await AsyncStorage.storeData("userid", res.data.id.toString());
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
      })
      .catch((error) => {
        if (error.response) {
          Keyboard.dismiss();
          Popup.dangerPopup(error.response.data);
          console.log(error.response.data);
        } else {
          Keyboard.dismiss();
          Popup.dangerPopup(error.message);
          console.log(error.message);
        }
      });
  };

  return (
    <Root>
      <View style={styles.container}>
        <Text style={styles.header}>Register</Text>
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
    </Root>
  );
};

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

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
