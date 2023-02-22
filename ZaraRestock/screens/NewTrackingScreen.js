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

const NewTrackingScreen = ({ navigation }) => {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  const handleAddTracking = async () => {
    if (!url || !size.length === 0 || selectedPeriods.length === 0) {
      alert("Please fill in all fields.");
      return;
    }

    await axios
      .post("http://192.168.0.128:3000/api/tracking", {
        url,
        size,
        period: selectedPeriods,
      })
      .then((res) => {
        console.log(res.data);
        navigation.navigate("LoggedInMainMenu");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSize = (selectedSize) => {
    if (size.includes(selectedSize)) {
      setSize(size.filter((s) => s !== selectedSize));
    } else {
      setSize([...size, selectedSize]);
    }
  };

  const togglePeriodSelection = (period) => {
    setSelectedPeriods((selected) =>
      selected.includes(period)
        ? selected.filter((p) => p !== period)
        : [...selected, period]
    );
  };

  const isPeriodSelected = (period) => selectedPeriods.includes(period);

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
      <Text style={styles.label}>Size:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={size.includes("S") ? styles.radioSelected : styles.radio}
          onPress={() => toggleSize("S")}
        >
          <Text style={styles.radioText}>S</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={size.includes("M") ? styles.radioSelected : styles.radio}
          onPress={() => toggleSize("M")}
        >
          <Text style={styles.radioText}>M</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={size.includes("L") ? styles.radioSelected : styles.radio}
          onPress={() => toggleSize("L")}
        >
          <Text style={styles.radioText}>L</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Period:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radio,
            isPeriodSelected("1 week") && styles.radioSelected,
          ]}
          onPress={() => togglePeriodSelection("1 week")}
        >
          <Text style={styles.radioText}>1 week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            isPeriodSelected("1 month") && styles.radioSelected,
          ]}
          onPress={() => togglePeriodSelection("1 month")}
        >
          <Text style={styles.radioText}>1 month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            isPeriodSelected("6 months") && styles.radioSelected,
          ]}
          onPress={() => togglePeriodSelection("6 months")}
        >
          <Text style={styles.radioText}>6 months</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            isPeriodSelected("1 year") && styles.radioSelected,
          ]}
          onPress={() => togglePeriodSelection("1 year")}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  radio: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  radioSelected: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#3f51b5",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NewTrackingScreen;
