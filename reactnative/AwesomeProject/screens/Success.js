import React, { useState, Component, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Linking, Button } from "react-native";
import { Storage } from "expo-storage";

export default function Success({ navigation }) {
  const [onLoadData, setData] = useState({});

  useEffect(async () => {
    // write your code here, it's like componentWillMount

    setData(JSON.parse(await Storage.getItem({ key: `id` })));
  }, []);

  const url = "https://www.a1.si/";

  return (
    <View style={styles.container}>
      <Text>Uspešno ste se poskenirali kodo</Text>
      <Text>Če obišteče: </Text>
      <OpenURLButton url={url}>{url}</OpenURLButton>
      <Text>
        in najdete velikonočno jajce ki se nahaja pri Samsung galaxy s23 ultra,
        prejmete 50 točk in vaš prijatelj prejme 20 točk
      </Text>
      <Button title="Domov" onPress={() => navigation.replace("Homepage")} />
    </View>
  );
}
const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);
  return <Button title={children} onPress={handlePress} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
