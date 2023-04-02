import React, { useState, Component, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Leaderboard from "react-native-leaderboard";
import QRCode from "react-native-qrcode-svg";

import { Storage } from "expo-storage";

export default function LeaderboardScreen({ navigation }) {
  const [onLoadData, setData] = useState({});

  useEffect(async () => {
    // write your code here, it's like componentWillMount
    data = await Storage.getItem({ key: `id` });

    console.log(data);
    data = JSON.parse(data);
    return fetch(
      `https://63fb-2001-1470-ffef-fe01-f026-3942-9093-e7e5.eu.ngrok.io/createCode/${data.id}`
    )
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Če prijatelj izpolni izziv prejmete {onLoadData.points} točk
      </Text>
      <QRCode value={onLoadData.code} size={200} />
      <View style={styles.button}>
        <Button
          title="Domov"
          color="#FFFFFF"
          onPress={() => navigation.replace("Homepage")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 2,
    width: "90%",
    margin: 15,
    backgroundColor: "#bc0d0c",
    borderRadius: 10,
    elevation: 3,
  },
  text: {
    color: "#000000",
    fontSize: 23,
    textAlign: "center",
    padding: 10,
  },
});

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
  <View style={styles.button}>
    return <Button title={children} onPress={handlePress} />;
  </View>;
};
