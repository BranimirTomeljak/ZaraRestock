import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Root } from "popup-ui";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");
const Popup = require("../models/PopupModel");

const MyTrackingsScreen = ({ navigation }) => {
  const [userid, setUserId] = useState(null);
  const [trackings, setTrackings] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
      const userid = await AsyncStorage.getData("userid");
      setUserId(userid);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userid) fetchTrackings(userid);
  }, [userid]);

  const fetchTrackings = async (userid) => {
    await axios
      .get("http://192.168.0.128:3000/api/tracking", {
        params: {
          userid: userid,
        },
      })
      .then(async (res) => {
        const trackings = res.data;
        setTrackings(trackings);
      })
      .catch((error) => {
        if (error.response) {
          Popup.dangerPopup(error.response.data);
          console.log(error.response.data);
        } else {
          Popup.dangerPopup(error.message);
          console.log(error.message);
        }
      });
  };

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const dateRefactor = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}. - ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
  };

  return (
    <Root>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>URL</Text>
          <Text style={styles.headerCell}>Size</Text>
          <Text style={styles.headerCell}>Created</Text>
          <Text style={styles.headerCell}>Until</Text>
          <Text style={styles.headerCell}>Success</Text>
        </View>
        {trackings.map((tracking) => (
          <View style={styles.row} key={tracking.id}>
            <TouchableOpacity
              style={styles.cell}
              onPress={() => handlePress(tracking.url)}
            >
              <Text style={{ color: "#ffffff" }}>{tracking.url}</Text>
            </TouchableOpacity>
            <Text style={styles.cell}>{tracking.size}</Text>
            <Text style={styles.cell}>{dateRefactor(tracking.created_on)}</Text>
            <Text style={styles.cell}>{dateRefactor(tracking.until)}</Text>
            <Text style={styles.cell}>
              {tracking.success == "in-progress"
                ? "In progress"
                : tracking.success}
            </Text>
          </View>
        ))}
        <StatusBar style="dark" />
      </ScrollView>
    </Root>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
    paddingVertical: 8,
    flexWrap: "nowrap",
  },
  cell: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  headerCell: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    flexShrink: 1,
  },
});

export default MyTrackingsScreen;