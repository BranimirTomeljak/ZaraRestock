import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import axios from "axios";
const AsyncStorage = require("../models/AsyncStorageModel");

const OldTrackingsScreen = ({ navigation }) => {
  const [userid, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      const userid = await AsyncStorage.getData("userid");
      setUserId(userid);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    fetchTrackings(userid);
  }, []);
  

  const fetchTrackings = async (userid) => {
    console.log("1111111");
    await axios.get(
      "http://192.168.0.128:3000/api/tracking",
      {
        params: {
          userid,
        }
      }
    ).then(async (res) => {
      console.log("sadfasdfas");
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
  };

  
  //const { id, username } = res.data;
  //console.log(trackings.data);
  /*return (
    <View>
      <Text>List of Objects:</Text>
      <FlatList
        data={listOfObjects}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
            <Text>{item.date}</Text>
            <Text>{item.trackingNumber}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );*/
};

export default OldTrackingsScreen;
