import AsyncStorage from "@react-native-async-storage/async-storage"


export const setAsyncData = async(key: string, data: any) => {
    if (typeof data !== 'string')
    {
        await AsyncStorage.setItem(key,  JSON.stringify(data))
    }
    else {
       await AsyncStorage.setItem(key,  data)
    }

}
export const getAsyncData = async(key: string) => {
    // let value = await AsyncStorage.getItem(key)
    // return value

      try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null; // No data found

        // Try parsing the value

        try {
       console.log("retrievingdata:", key, JSON.parse(value));
      return JSON.parse(value); // If it parses successfully, it's an object
        } catch (error) {
          console.log("retrievingdata:", key, value);

      return value; // If parsing fails, it's a plain string
    }
  } catch (e) {
    console.error("Error retrieving data:", e);
    return null;
  }
}
