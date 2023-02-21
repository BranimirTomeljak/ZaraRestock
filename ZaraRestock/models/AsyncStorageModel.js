import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      console.log("ASM: " + data);
      return JSON.parse(data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
    return false;
  }
  console.log("Done.");
  return true;
};
