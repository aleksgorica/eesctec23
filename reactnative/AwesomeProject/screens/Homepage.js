import React, {
  useState,
  Component,
  Image,
  useEffect,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Storage } from "expo-storage";

export default function HomeScreen({ navigation }) {
  const url = "https://www.a1.si/";

  const [onLoadData, setData] = useState({});

  useEffect(async () => {
    // write your code here, it's like componentWillMount
    const data = JSON.parse(await Storage.getItem({ key: `id` }));
    console.log(data, data.id);

    return fetch(
      `https://63fb-2001-1470-ffef-fe01-f026-3942-9093-e7e5.eu.ngrok.io/user/${data.username}`
      //   `https://63fb-2001-1470-ffef-fe01-f026-3942-9093-e7e5.eu.ngrok.io/user/nika`
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        // add async here
        await Storage.setItem({
          key: "id",
          value: JSON.stringify(responseJson),
        });
        console.log("json", responseJson);
        setData(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pozdravljeni: {onLoadData.username}</Text>
      <Text style={styles.text}>Imate {onLoadData.score} točk</Text>

      {onLoadData.referal ? (
        <Text style={styles.text}>
          Priporočil vas je {onLoadData.referal.username}
        </Text>
      ) : (
        <Text></Text>
      )}
      {onLoadData.validated ? (
        <Text style={styles.text}>Uspešno ste našli jajce</Text>
      ) : (
        <Text style={styles.text}>
          Niste še našli jajca, Najdete ga lahko na{" "}
          <OpenURLButton url={url}>{url}</OpenURLButton>
        </Text>
      )}
      <View style={styles.button}>
        <Button
          title="Skeniraj kodo"
          color="#FFFFFF"
          onPress={() => navigation.replace("QRcode")}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Deli kodo"
          color="#FFFFFF"
          onPress={() => navigation.replace("QRgenerator")}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Lestvica"
          color="#FFFFFF"
          style={styles.button}
          onPress={() => navigation.replace("LeaderboardScreen")}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Zgodovina"
          color="#FFFFFF"
          onPress={() => navigation.replace("History")}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="LOGOUT"
          color="#FFFFFF"
          onPress={() => navigation.replace("Login")}
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
    padding: 5,
    width: "90%",
    margin: 5,
    backgroundColor: "#bc0d0c",
    borderRadius: 10,
    elevation: 3,
  },
  text: {
    color: "#000000",
    fontSize: 23,
    textAlign: "center",
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
