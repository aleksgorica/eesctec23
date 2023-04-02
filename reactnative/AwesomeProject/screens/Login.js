import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import { Storage } from "expo-storage";

const App = ({ navigation }) => {
  const onPressLogin = (username) => {
    return fetch(
      `https://63fb-2001-1470-ffef-fe01-f026-3942-9093-e7e5.eu.ngrok.io/user/${username}`
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        // add async here
        console.log(responseJson);
        await Storage.setItem({
          key: "id",
          value: JSON.stringify(responseJson),
        });
        navigation.replace("Homepage");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [state, setState] = useState({
    username: "",
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foundify</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ username: text })}
        />
      </View>

      <TouchableOpacity
        onPress={() => onPressLogin(state.username)}
        style={styles.loginBtn}
      >
        <Text style={styles.loginText}>LOGIN </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4FD3DA",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#3AB4BA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white",
  },
  forgotAndSignUpText: {
    color: "white",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});
export default App;
