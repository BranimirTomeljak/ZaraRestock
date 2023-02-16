import React, { useState } from "react";
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

const App = () => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/analyser", { value })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.main}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Enter some data"
        style={styles.button}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
});
