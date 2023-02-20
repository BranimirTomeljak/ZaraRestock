import React from "react";
import { View, Text, FlatList } from "react-native";

const OldTrackingsScreen = ({}) => {
  const listOfObjects = ["Saab", "Volvo", "BMW"];
  return (
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
  );
};

export default OldTrackingsScreen;
