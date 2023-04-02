import React, { useState, Component, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Leaderboard from "react-native-leaderboard";

import { Storage } from "expo-storage";

export default function LeaderboardScreen({ navigation }) {
  const [onLoadData, setData] = useState({});

  useEffect(async () => {
    // write your code here, it's like componentWillMount
    data = JSON.parse(await Storage.getItem({ key: `id` }));

    return fetch(
      `https://63fb-2001-1470-ffef-fe01-f026-3942-9093-e7e5.eu.ngrok.io/friends`
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
      <Leaderboard data={onLoadData} labelBy="username" sortBy="score" />
      <Button title="Domov" onPress={() => navigation.replace("Homepage")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  return <Button title={children} onPress={handlePress} />;
};
