import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");

const NewTrackingScreen = ({ navigation }) => {
  const [url, setUrl] = useState("");
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTracking = async () => {
    if (selectedSizes.length === 0 || !selectedPeriod) {
      alert("Please fill in all fields.");
      return;
    }

    await axios
      .post("http://192.168.0.128:3000/api/tracking", {
        url,
        size: selectedSizes,
        period: selectedPeriod,
      })
      .then((res) => {
        console.log(res.data);
        navigation.navigate("LoggedInMainMenu");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePeriodSelection = (selectedPeriod) => {
    setSelectedPeriod(selectedPeriod);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // validate the URL input value and save it to the database
    if (isValidUrl(url)) {
      await axios
        .post("http://192.168.0.128:3000/api/analyser/sizes", {
          url,
        })
        .then((res) => {
          console.log(res.data);
          setSizes(res.data);
        })
        .catch((error) => {
          alert("Error. Try again!")
          console.log(error);
        });
    }
    setIsSubmitting(false);
  };

  const isValidUrl = (url) => {
    return true;
  };

  const handleSizeSelection = (selectedSize) => {
    setSelectedSizes((selected) =>
      selected.includes(selectedSize)
        ? selected.filter((size) => size !== selectedSize)
        : [...selected, selectedSize]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Tracking</Text>
      <TextInput
        style={styles.input}
        placeholder="URL"
        placeholderTextColor="#d3d3d3"
        value={url}
        onChangeText={setUrl}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirm URL</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Size:</Text>
      {isSubmitting && <ActivityIndicator />}
      <View style={styles.radioContainer}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={
              selectedSizes.includes(size) ? styles.radioSelected : styles.radio
            }
            onPress={() => handleSizeSelection(size)}
          >
            <Text style={styles.radioText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Period:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radio,
            selectedPeriod === "1 week" ? styles.radioSelected : styles.radio,
          ]}
          onPress={() => handlePeriodSelection("1 week")}
        >
          <Text style={styles.radioText}>1 week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            selectedPeriod === "1 month" ? styles.radioSelected : styles.radio,
          ]}
          onPress={() => handlePeriodSelection("1 month")}
        >
          <Text style={styles.radioText}>1 month </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            selectedPeriod === "6 months" ? styles.radioSelected : styles.radio,
          ]}
          onPress={() => handlePeriodSelection("6 months")}
        >
          <Text style={styles.radioText}>6 months</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            selectedPeriod === "1 year" ? styles.radioSelected : styles.radio,
          ]}
          onPress={() => handlePeriodSelection("1 year")}
        >
          <Text style={styles.radioText}>1 year</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddTracking}>
        <Text style={styles.buttonText}>Add Tracking</Text>
      </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff"
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#ffffff",
    placeHolderTextColor: "#bbb",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  radio: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  radioSelected: {
    borderWidth: 1,
    borderColor: "#c23616",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  radioText: {
    fontSize: 16,
    color: "#ddd",
  },
  button: {
    backgroundColor: "#c23616",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NewTrackingScreen;